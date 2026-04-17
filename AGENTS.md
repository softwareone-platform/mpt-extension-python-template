# AGENTS.md

Working protocol for any task in this repository:

1. Identify the task type and select only the local repository files that are relevant to that task.
2. Read only those relevant local files before making changes.
3. If any selected local file references shared standards or shared operational guidance that are relevant to the same task, read those shared documents too before proceeding.
4. Treat repository-local documents as repository-specific additions, restrictions, or overrides to shared guidance.
5. If a repository-local rule conflicts with a shared rule, the local repository rule takes precedence.

When applicable, read the repository in this order:

1. [README.md](README.md) for the repository purpose, quick start, and documentation map.
2. [docs/architecture.md](docs/architecture.md) for the template architecture placeholder and future design notes.
3. [docs/local-development.md](docs/local-development.md) for local setup and service startup.
4. [docs/deployment.md](docs/deployment.md) for configuration and runtime parameters.
5. [docs/contributing.md](docs/contributing.md) for the repository workflow and expected developer commands.
6. [docs/testing.md](docs/testing.md) before changing code or tests.
7. [docs/migrations.md](docs/migrations.md) when a task mentions schema or data migrations.
8. [docs/documentation.md](docs/documentation.md) when changing repository documentation.

Then inspect the code paths relevant to the task:

- [`swo_playground/apps.py`](swo_playground/apps.py): Django app registration and extension entry point
- [`swo_playground/api.py`](swo_playground/api.py): HTTP API and validation flow
- [`swo_playground/events.py`](swo_playground/events.py): event listeners
- [`swo_playground/steps.py`](swo_playground/steps.py): fulfillment pipeline steps
- [`tests/`](tests/): test coverage examples and fixtures
- [`make/`](make/): canonical commands used by the repository

Operational guidance:

- Prefer the documented `make` targets over ad hoc Docker commands.
- Treat Docker as the default local execution model for this repository.
- Keep documentation modular. Update the specific file in `docs/` instead of expanding `README.md` into a full manual.
- Do not invent undocumented migration behavior. If the codebase has no concrete migration examples, document the current constraint and keep changes aligned with `mpt-service-cli migrate`.
- For shared meaning of common `make` targets and validation flow, prefer the shared knowledge documents instead of inferring local semantics from target names alone.
