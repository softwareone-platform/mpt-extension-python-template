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

## How the Extension Runs

This repository is a single extension with two layers that meet at the
repository-level `static/` folder: the backend (Extension SDK) serves that
folder at `/static`, and the frontend build writes plug bundles into it. Before
the backend can register plugs, `static/` must already contain the bundles their
metadata references, so the run order is always:

1. `make build` generates the frontend bundles into `static/`.
2. A runner (`make run` or `make run-local`) starts the backend, which mounts
   `static/` at `/static` and exposes the extension.

The two runners differ in *what* the backend connects to and *whether* the plug
is rendered inside the Marketplace Portal (MPT).

## Choosing a Runner

| | `make run-local` | `make run` |
| --- | --- | --- |
| Purpose | Local development runtime | Platform integration: validate real plug behavior inside MPT |
| Backend command | `mpt-ext run --local` (FastAPI + uvicorn) | `mpt-ext run` (registers the instance, platform runtime) |
| Compose files | `compose.yaml` + `compose.local.yaml` | `compose.yaml` |
| Extra services | `devmock` (WireMock) + Jaeger | Jaeger |
| Marketplace API | mocked by `devmock` | real Marketplace |
| Required config | `backend/.env.local` (**required**) | `backend/.env` with real Marketplace settings |
| `/static` | served; confirms a bundle is reachable | served and loaded by MPT inside the plug iframe |
| Renders the plug in MPT? | No — only proves the asset is reachable | Yes — real socket, context, modal, events, auth |

Use `make run-local` for day-to-day development without a real Marketplace.
`make run` is the only mode that exercises the full plug UI inside MPT.

### `make run-local` (local mock mode)

```bash
make run-local
```

Runs the backend with `mpt-ext run --local` and starts the WireMock `devmock`
service from `compose.local.yaml`. The extension is exposed on
`http://localhost:8080`; `devmock` listens on `http://localhost:8000` and uses
the mappings under `peripherals/devmock/`. This mode **requires**
`backend/.env.local` (see [Required Configuration](#required-configuration)).

### `make run` (platform integration)

```bash
make run
```

Runs the backend with `mpt-ext run`, which registers the extension instance and
exposes its routes and `/static` assets to MPT. This is the mode that renders
the plug inside the Portal, so it needs a `backend/.env` pointing at a real
Marketplace.

## Scopes

`run` and `run-local` accept `scope=backend|frontend|all` (default `all`). An
invalid value fails fast with `Invalid scope '<x>'. Use one of: backend
frontend all`.

| Scope | What starts | Notes |
| --- | --- | --- |
| `all` (default) | backend + frontend watcher + Jaeger (+ `devmock` in local mode) | Runs **detached** (`-d`); the terminal returns immediately |
| `backend` | backend (+ Jaeger by dependency) | Runs in the **foreground**; no frontend watcher, so bundles are not rebuilt |
| `frontend` | frontend watcher only | Runs in the **foreground**; rebuilds bundles into `static/` but has no backend, so calls to `/api/v2/agreements` will not respond |

The frontend watcher (`scope=frontend` or `all`) watches `frontend/` and
regenerates plug bundles into `static/` on change. In `make run-local`, the
`devmock` service starts as a backend dependency for any scope that starts the
backend.

## Required Configuration

The minimum environment needed depends on the runner. The full parameter
reference lives in [docs/deployment.md](deployment.md); do not duplicate it here.

- **`make run-local`**: `backend/.env.local` is **required** (`compose.local.yaml`
  declares it `required: true`). `backend/.env.sample` shows the expected shape,
  including the `SDK_EXTENSION_*` values and `MPT_API_BASE_URL=http://devmock:8000`.
- **`make run`**: `backend/.env` is optional for Compose to start the container,
  but the extension needs real Marketplace settings to integrate — at minimum
  `MPT_PRODUCTS_IDS` (enforced by [`settings.py`](../backend/swo_playground/settings.py)),
  `MPT_API_BASE_URL`, and the `SDK_EXTENSION_API_KEY` / `SDK_EXTENSION_ID` /
  `SDK_EXTENSION_URL` values for the target Marketplace.

## Operating a Detached Run

Because `scope=all` runs detached, use these helpers to observe and stop it:

```bash
make logs    # follow backend + frontend logs (scope-aware)
make down    # stop and remove the containers
make bash    # open an interactive backend shell
```

Jaeger traces are available at `http://localhost:16686` (OTLP ingest on `4318`).

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
