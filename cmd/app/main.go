package main

import (
	"log"

	"github.com/kirei-io/go-project-template/internal/core"
)

func main() {
	cfg := core.GetConfig()
	log.Printf("Starting application in [%s] mode", cfg.App.Env)
	log.Println("Hello World!")
}
