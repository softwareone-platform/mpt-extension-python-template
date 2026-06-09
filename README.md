# SWO Extension Playground

`swo-extension-playground` is a minimal SoftwareOne Marketplace extension built on top of `mpt-extension-sdk` and `mpt-tool`.

It is primarily a playground repository: it shows the baseline extension shape, agreement API endpoints, order and agreement event listeners, small fulfillment pipelines, Marketplace Portal plugs, and the development workflow used by extension repositories in this ecosystem.

## Repository Layout

- `backend/swo_playground/` contains the extension package.
- `backend/tests/` contains the pytest suite.
- `frontend/` contains the React plug source code.
- `static/` contains generated plug assets served by the extension.
- `make/*.mk` contains the repository make targets.
- `compose.yaml` defines the Docker-based development environment.
- `compose.local.yaml` adds local mock services for `mpt-ext run --local`.

## Quick Start

Prerequisites:

- Docker with the `docker compose` plugin
- `make`

Recommended setup:

```bash
make build
make test
make run-local
```

Local mock mode exposes the application on `http://localhost:8080`.

Most make targets accept `scope=backend`, `scope=frontend`, or `scope=all`. The default scope is `all`.

## Common Commands

Shared meaning of common make targets is documented in:

- [knowledge/make-targets.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/make-targets.md)
- [knowledge/build-and-checks.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/build-and-checks.md)

## Documentation

- [AGENTS.md](AGENTS.md): entry point for AI agents
- [docs/architecture.md](docs/architecture.md): architecture placeholder for future repository-specific design
- [docs/contributing.md](docs/contributing.md): repository-specific development workflow
- [docs/local-development.md](docs/local-development.md): local setup and service startup
- [docs/deployment.md](docs/deployment.md): runtime configuration and deployment-facing settings
- [docs/testing.md](docs/testing.md): testing strategy and commands
- [docs/migrations.md](docs/migrations.md): migration workflow and current constraints
- [docs/documentation.md](docs/documentation.md): repository documentation rules

Keep repository-specific workflow details in the documents under [`docs/`](docs/), not in this file.
