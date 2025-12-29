package database

import (
	"fmt"
	"log"

	"github.com/kirei-io/go-auth-playground/internal/core"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Clinet *gorm.DB

func InitDb(cfg *core.DbConfig) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Moscow",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, fmt.Sprint(cfg.Port),
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("Falled to connect DB: %v", err)
	}

	log.Println("Success connect to DB!")

	err = db.AutoMigrate(&Role{}, &User{})
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	seedRoles(db)
	Clinet = db
}

func seedRoles(db *gorm.DB) {
	roles := []string{"admin", "user"}
	for _, r := range roles {
		db.FirstOrCreate(&Role{}, Role{Name: r})
	}
}
