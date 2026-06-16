# AGENTS.md

Working protocol for any task in this repository:

1. Identify the task type and select only the local repository files that are relevant to that task.
2. Read only those relevant local files before making changes.
3. If any selected local file references shared standards or shared operational guidance that are relevant to the same task, read those shared documents too before proceeding.
4. Treat repository-local documents as repository-specific additions, restrictions, or overrides to shared guidance.
5. If a repository-local rule conflicts with a shared rule, the local repository rule takes precedence.

When applicable, read the repository in this order:

1. [README.md](README.md) for the repository purpose, quick start, and documentation map.
2. [docs/architecture.md](docs/architecture.md) for the repository structure and runtime components.
3. [docs/examples.md](docs/examples.md) for a tour of the example API, events, pipelines, context, and plugs.
4. [docs/local-development.md](docs/local-development.md) for local setup and service startup.
5. [docs/deployment.md](docs/deployment.md) for configuration and runtime parameters.
6. [docs/contributing.md](docs/contributing.md) for the repository workflow and expected developer commands.
7. [docs/testing.md](docs/testing.md) before changing code or tests.
8. [docs/migrations.md](docs/migrations.md) when a task mentions schema or data migrations.
9. [docs/documentation.md](docs/documentation.md) when changing repository documentation.

Then inspect the code paths relevant to the task:

- [`backend/swo_playground/app.py`](backend/swo_playground/app.py): Extension SDK application entry point
- [`backend/swo_playground/settings.py`](backend/swo_playground/settings.py): extension settings and required environment variables
- [`backend/pyproject.toml`](backend/pyproject.toml): backend dependencies, lint, test, and type-check configuration
- [`backend/migrations/`](backend/migrations/): migration files managed by `mpt-tool`
- [`backend/tests/`](backend/tests/): backend test suite
- [`frontend/src/modules/`](frontend/src/modules/): React plug entry points (one bundle per module)
- [`frontend/src/shared/`](frontend/src/shared/): shared frontend components, hooks, and model helpers
- [`frontend/esbuild.config.js`](frontend/esbuild.config.js): frontend build that emits plug bundles into `static/`
- [`make/`](make): canonical commands used by the repository
- [`Dockerfile`](Dockerfile) and [`compose.yaml`](compose.yaml): backend container and local stack
- [`.github/workflows/pr-build-merge.yml`](.github/workflows/pr-build-merge.yml): CI checks
- [`.github/workflows/release-extension.yml`](.github/workflows/release-extension.yml): manual release workflow for extensions (validate version, annotated tag, GitHub release, Dependency-Track)
- [`.github/workflows/release-library.yml`](.github/workflows/release-library.yml): manual release workflow for libraries (build and publish to PyPI, annotated tag, GitHub release, Dependency-Track)

Operational guidance:

- Prefer the documented `make` targets over ad hoc Docker commands.
- Treat Docker as the default local execution model for this repository.
- Keep `README.md` short and navigational. Put topic-specific behavior under `docs/`.
- For shared meaning of common `make` targets and validation flow, prefer the shared knowledge documents instead of inferring local semantics from target names alone.
