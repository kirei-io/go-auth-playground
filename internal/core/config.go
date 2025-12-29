package core

import (
	"fmt"
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	App  AppConfig
	Db   DbConfig
	Auth AuthConfig
}

type AppConfig struct {
	Port int    `env:"PORT" env-default:"8080"`
	Env  string `env:"APP_ENV" env-default:"development"`
}

type DbConfig struct {
	Host     string `env:"DB_HOST" env-default:"localhost"`
	User     string `env:"DB_USER" env-default:"user"`
	Password string `env:"DB_PASSWORD" env-default:"password"`
	Name     string `env:"DB_NAME" env-default:"go-auth-playground"`
	Port     int    `env:"DB_PORT" env-default:"5432"`
}

type AuthConfig struct {
	JWTSecret     string `env:"JWT_SECRET" env-default:"very-secret-key"`
	Issuer        string `env:"JWT_ISSUER" env-default:"go-auth-playground"`
	TokenHoursTTL int    `env:"JWT_HOURS_TTL" env-default:"24"`
}

var (
	cfg  *Config
	once sync.Once
)

func GetConfig() *Config {
	once.Do(func() {
		cfg = &Config{}
		if err := cleanenv.ReadEnv(cfg); err != nil {
			panic(fmt.Sprintf("failed to load config: %v", err))
		}
	})
	return cfg
}
