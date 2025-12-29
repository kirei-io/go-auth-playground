package core

import (
	"fmt"
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	App AppConfig
	Db  DbConfig
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
