package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/kirei-io/go-auth-playground/internal/auth"
	"github.com/kirei-io/go-auth-playground/internal/core"
	"github.com/kirei-io/go-auth-playground/internal/database"
)

func main() {
	cfg := core.GetConfig()
	database.InitDb(&cfg.Db)

	r := gin.Default()

	authRepo := auth.NewAuthRepository(database.Client)
	authService := auth.NewAuthService(&cfg.Auth, authRepo)
	authController := auth.NewAuthController(authService)

	v1 := r.Group("/api/v1")
	{
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/signup", authController.Signup)
			authGroup.POST("/login", authController.Login)

			protected := authGroup.Group("")
			protected.Use(auth.AuthMiddleware(authService))
			{
				protected.GET("/self", authController.Self)
			}
		}
	}

	addr := fmt.Sprintf(":%d", cfg.App.Port)
	log.Printf("Server is running on %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}

}
