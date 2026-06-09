# Local Development

This document describes how to run the repository locally in the supported Docker workflow.

## Prerequisites

- Docker with the `docker compose` plugin
- `make`

## Setup

Build the development image and install dependencies:

```bash
make build
```

`make build` uses `scope=all` by default. To work on one side only:

```bash
make build scope=backend
make build scope=frontend
```

## Running the Service

Start the service in platform integration mode:

```bash
make run
```

`make run` starts backend, frontend, and Jaeger when `scope=all`. Use scoped startup when needed:

```bash
make run scope=backend
make run scope=frontend
```

The frontend container watches `frontend/` and writes generated plug assets into `static/`.

## Local Mock Mode

For local development without a real Marketplace API, use:

```bash
make run-local
```

This runs the backend with `mpt-ext run --local` and starts the WireMock devmock service from `compose.local.yaml`. The extension service is exposed on `http://localhost:8080`; the devmock service listens on `http://localhost:8000` and uses mappings under `peripherals/devmock/`.

Local mock mode requires `backend/.env.local`. The sample values in `backend/.env.sample` show the expected local devmock shape.

Useful helper commands:

```bash
make bash
make down
make logs
```

## Environment Parameters

Local startup reads environment files from the backend directory:

- `backend/.env` is optional for the default Compose workflow.
- `backend/.env.local` is required by `make run-local`.
- `backend/.env.sample` contains sample values used by local checks and metadata validation.

The parameter reference lives in [docs/deployment.md](deployment.md). Use that document for:

- required and optional environment variables
- example values
- runtime-specific notes for Marketplace integration and AppInsights

Do not duplicate the parameter reference in this file.

## Frontend Development

Frontend source lives under `frontend/src/`. The build creates static plug bundles under `static/`, which are served by the backend and referenced by the plug metadata.

Use the repository make targets instead of running npm directly unless debugging a frontend-only issue:

```bash
make check scope=frontend
make test scope=frontend
make format scope=frontend
```
