.PHONY: run-dev stop-dev clean copy-env help

.DEFAULT_GOAL := help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

copy-env: ## Create .env from .env.example if it doesn't exist
	@if [ ! -f .env ]; then \
		cp .env.example .env && echo "✅ .env file created successfully"; \
	else \
		echo "⚠️  .env file already exists"; \
	fi

run-dev: ## Run project in Docker with hot reload (Air)
	docker-compose up --build

stop-dev: ## Stop all project containers
	docker-compose down

clean: ## Remove Go cache and unused Docker resources
	go clean
	docker system prune -f
