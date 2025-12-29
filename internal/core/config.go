package core

import (
	"fmt"
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	App AppConfig
}

type AppConfig struct {
	Port int    `env:"PORT" env-default:"8080"`
	Env  string `env:"APP_ENV" env-default:"development"`
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
