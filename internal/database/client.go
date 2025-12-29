package database

import (
	"fmt"

	"github.com/kirei-io/go-auth-playground/internal/core"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDb() (*gorm.DB, error) {
	cfg := core.GetConfig().Db
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Moscow",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, fmt.Sprint(cfg.Port),
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("Falled to connect DB: %v", err)
	}

	fmt.Println("Success connect to DB!")

	return db, nil
}
