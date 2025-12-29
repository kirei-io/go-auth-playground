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

func (repo *AuthRepository) Update(ctx context.Context, userID uuid.UUID, updateDto UpdateUserRequest) (*database.User, error) {
	var user database.User

	err := repo.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		u, err := gorm.G[database.User](tx).Preload("Role", nil).Where("id = ?", userID).Take(ctx)
		if err != nil {
			return err
		}

		if updateDto.Name != nil {
			u.Name = *updateDto.Name
		}
		if updateDto.Password != nil {
			u.PasswordHash = *updateDto.Password
		}

		rows, err := gorm.G[database.User](tx).Where("id = ?", userID).Updates(ctx, u)

		if err != nil {
			return err
		}

		if rows == 0 {
			return fmt.Errorf("Not update rows when update user")
		}

		user = u
		return nil
	})

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (repo *AuthRepository) Delete(ctx context.Context, userID uuid.UUID, hard bool) (*database.User, error) {
	var user database.User
	err := repo.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
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
