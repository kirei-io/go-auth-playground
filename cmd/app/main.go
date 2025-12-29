package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kirei-io/go-auth-playground/internal/auth"
	"github.com/kirei-io/go-auth-playground/internal/core"
	"github.com/kirei-io/go-auth-playground/internal/database"
)

func main() {
	cfg := core.GetConfig()
	database.InitDb(&cfg.Db)

	r := gin.Default()

	authRepo := auth.NewAuthRepository(database.Clinet)
	authService := auth.NewAuthService(&cfg.Auth, authRepo)
	authController := auth.NewAuthController(authService)

	r.GET("/ping", func(c *gin.Context) {

		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"ctrl":    authController,
		})
	})

	if err := r.Run(fmt.Sprintf(":%s", fmt.Sprint(cfg.App.Port))); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}

}
