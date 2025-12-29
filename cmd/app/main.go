package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kirei-io/go-auth-playground/internal/core"
	"github.com/kirei-io/go-auth-playground/internal/database"
)

func main() {
	cfg := core.GetConfig()

	r := gin.Default()
	_, err := database.InitDb()

	if err != nil {
		log.Fatal(err)
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	if err := r.Run(fmt.Sprintf(":%s", fmt.Sprint(cfg.App.Port))); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}

}
