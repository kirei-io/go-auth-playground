package auth

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/kirei-io/go-auth-playground/internal/core"
	"github.com/kirei-io/go-auth-playground/internal/database"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo      *AuthRepository
	jwtSecret []byte
	issuer    string
	tokenTTL  time.Duration
}

func NewAuthService(cfg *core.AuthConfig, repo *AuthRepository) *AuthService {
	return &AuthService{
		jwtSecret: []byte(cfg.JWTSecret),
		issuer:    cfg.Issuer,
		tokenTTL:  time.Duration(cfg.TokenHoursTTL) * time.Hour,
		repo:      repo,
	}
}

func (s *AuthService) HashPassword(password string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(b), err
}

func (s *AuthService) CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (s *AuthService) GenerateToken(userID uuid.UUID, email, role string) (string, error) {
	claims := JWTClaims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.tokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    s.issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(s.jwtSecret)
}

func (s *AuthService) ParseToken(tokenString string, claims *JWTClaims) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return s.jwtSecret, nil
	})
}

func (s *AuthService) ExtractToken(authBearer string) (string, error) {
	// "Authorization: Bearer <token>"
	if authBearer == "" {
		return "", fmt.Errorf("Authorization header is required")
	}

	parts := strings.SplitN(authBearer, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", fmt.Errorf("Authorization header format must be Bearer {token}")
	}

	return parts[1], nil
}

func (s *AuthService) Signup(ctx context.Context, dto *CreateCreateRequest) (*AuthResponse, error) {
	role, err := s.repo.GetRoleByName(ctx, "user")
	if err != nil {
		return nil, fmt.Errorf("default role not found")
	}

	hashedPassword, err := s.HashPassword(dto.Password)
	if err != nil {
		return nil, err
	}

	user := s.createUserFromDto(dto, hashedPassword)
	user.RoleID = role.ID
	user.Role = *role

	if err := s.repo.Create(ctx, &user); err != nil {
		return nil, err
	}

	accessToken, err := s.GenerateToken(user.ID, user.Email, role.Name)
	if err != nil {
		return nil, err
	}

	resp := s.userModelToResponseDto(&user, accessToken)
	return &resp, nil
}

func (s *AuthService) Login(ctx context.Context, dto *LoginRequest) (*AuthResponse, error) {
	user, err := s.repo.GetByEmail(ctx, dto.Email)
	if err != nil {
		return nil, err
	}

	if !s.CheckPasswordHash(dto.Password, user.PasswordHash) {
		return nil, err
	}

	accessToken, err := s.GenerateToken(user.ID, user.Email, user.Role.Name)
	if err != nil {
		return nil, err
	}

	resp := s.userModelToResponseDto(user, accessToken)
	return &resp, nil
}

func (s *AuthService) Self(ctx context.Context, email string) (*AuthResponse, error) {
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	resp := s.userModelToResponseDto(user, "")
	return &resp, nil
}

func (s *AuthService) Delete(ctx context.Context, userID uuid.UUID) (*AuthResponse, error) {
	user, err := s.repo.Delete(ctx, userID, false)

	if err != nil {
		return nil, err
	}

	resp := s.userModelToResponseDto(user, "")

	return &resp, nil
}

func (s *AuthService) createUserFromDto(dto *CreateCreateRequest, passwordHash string) database.User {
	u := database.User{
		Email:        dto.Email,
		PasswordHash: passwordHash,
	}

	if dto.Name != nil {
		u.Name = *dto.Name
	}
	if dto.Login != nil {
		u.Login = *dto.Login
	}

	return u
}

func (s *AuthService) userModelToResponseDto(model *database.User, accessToken string) AuthResponse {
	return AuthResponse{
		AccessToken: accessToken,
		Email:       model.Email,
		Role:        model.Role.Name,
		Name:        &model.Name,
		Login:       &model.Login,
		CreatedAt:   model.CreatedAt,
		UpdatedAt:   model.UpdatedAt,
	}
}
