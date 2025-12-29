package auth

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/kirei-io/go-auth-playground/internal/database"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{
		db: db,
	}
}

func (repo *AuthRepository) GetRoleByName(ctx context.Context, name string) (*database.Role, error) {
	role, err := gorm.G[database.Role](repo.db).Where("name = ?", name).Take(ctx)
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (repo *AuthRepository) Create(ctx context.Context, user *database.User) error {
	return gorm.G[database.User](repo.db).Create(ctx, user)
}

func (repo *AuthRepository) GetByEmail(ctx context.Context, email string) (*database.User, error) {
	user, err := gorm.G[database.User](repo.db).Preload("Role", nil).Where("email = ?", email).Take(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (repo *AuthRepository) deleteTransaction(ctx context.Context, userID uuid.UUID, hard bool) (*database.User, error) {
	var user database.User
	err := repo.db.Transaction(func(tx *gorm.DB) error {
		currentTx := tx
		if hard {
			currentTx = tx.Unscoped()
		}

		u, err := gorm.G[database.User](currentTx).Preload("Role", nil).Where("id = ?", userID).Take(ctx)
		if err != nil {
			return err
		}

		user = u

		rowsAffected, err := gorm.G[database.User](currentTx).Where("id = ?", userID).Delete(ctx)
		if err != nil {
			return err
		}

		if rowsAffected == 0 {
			return fmt.Errorf("No rows affected when delete user %s", userID)
		}

		return nil
	})

	return &user, err
}

func (repo *AuthRepository) Delete(ctx context.Context, userID uuid.UUID) (*database.User, error) {
	return repo.deleteTransaction(ctx, userID, false)
}

func (repo *AuthRepository) PermamentDelete(ctx context.Context, userID uuid.UUID) (*database.User, error) {
	return repo.deleteTransaction(ctx, userID, true)
}
