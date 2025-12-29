# Go Project Template

A Go project structure with Docker, Air (hot reload), and clean architecture principles.

## Dependencies

- Go 1.25+
- Docker & Docker Compose
- Make (`sudo apt install make` (Ubuntu), `scoop install make` (Windows))
- Config: github.com/ilyakaznacheev/cleanenv
- Hot Reload: github.com/air-verse/air

## Setup
### Initialize environment:

```bash
make copy-env
```

### Run the project:

```bash
make run-dev
```

## Project structure

- `./cmd/app/` - Entry point of the application.
- `./internal/core/` - Global shared logic (config, router, database connection).
- `./internal/<module_name>/` - Feature-based modules (e.g., auth, users).

## Commands

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `make help`     | Show all available commands             |
| `make copy-env` | Create .env from example                |
| `make run-dev`  | Start Docker containers with hot-reload |
| `make stop-dev` | Stop and remove containers              |
| `make clean`    | Cleanup Go cache and Docker resources   |
