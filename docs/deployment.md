# Deployment

This document describes runtime configuration.

It is the source of truth for environment parameters referenced by local development and deployment flows.

## Configuration Source

The repository runtime expects environment variables, typically provided through files under `backend/` for local Docker Compose usage.

Docker Compose reads:

- `backend/.env` for the default platform integration workflow
- `backend/.env.local` for local mock mode
- `backend/.env.sample` as sample values for local checks and metadata validation. Inside the backend container, this file is available as `.env.sample`.

Local setup instructions live in [docs/local-development.md](local-development.md).

## Extension Identity

These settings identify the extension instance to the SDK runtime and the
Marketplace. They are present in `backend/.env.sample` and are required for the
extension to register and authenticate.

| Environment Variable | Default | Example | Description |
| --- | --- | --- | --- |
| `SDK_EXTENSION_API_KEY` | - | `<extension-api-key>` | API key used for extension registration and runtime task operations |
| `SDK_EXTENSION_ID` | - | `EXT-1111-1111` | Extension identifier used during instance registration |
| `SDK_EXTENSION_URL` | - | `https://extensions.example.com` | Extension registration endpoint used during platform startup (points at `devmock` in local mock mode) |

## Core Application Settings

| Environment Variable | Default | Example | Description |
| --- | --- | --- | --- |
| `MPT_API_BASE_URL` | - | `https://api.platform.softwareone.com` | SoftwareOne Marketplace API URL, required by the runtime (use `http://devmock:8000` in local mock mode) |
| `MPT_PRODUCTS_IDS` | `PRD-1111-1111` | `PRD-1234-1234,PRD-4321-4321` | Comma-separated list of Marketplace product ids |
| `MPT_TOOL_STORAGE_TYPE` | `local` | `airtable` | Storage type for MPT tools |
| `MPT_TOOL_STORAGE_AIRTABLE_API_KEY` | - | `patXXXXXXXXXXXXXX` | Airtable API key when Airtable storage is enabled |
| `MPT_TOOL_STORAGE_AIRTABLE_BASE_ID` | - | `appXXXXXXXXXXXXXX` | Airtable base id when Airtable storage is enabled |
| `MPT_TOOL_STORAGE_AIRTABLE_TABLE_NAME` | - | `MigrationTracking` | Airtable table name when Airtable storage is enabled |
| `MPT_ORDERS_API_POLLING_INTERVAL_SECS` | `120` | `60` | Order polling interval in seconds |

## AppInsights Settings

`APPLICATIONINSIGHTS_CONNECTION_STRING` and `OTEL_SERVICE_NAME` are optional for local development unless local telemetry is explicitly enabled. In production or telemetry-enabled environments, set both variables together.

| Environment Variable | Default | Example | Description |
| --- | --- | --- | --- |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | - | `InstrumentationKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;IngestionEndpoint=https://westeurope-1.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/` | Azure Application Insights connection string |
| `OTEL_SERVICE_NAME` | - | `Swo.Extensions.<ServiceName>` | Service name shown in telemetry |

## Required Configuration By Run Mode

The minimum settings depend on the runner used in
[docs/local-development.md](local-development.md):

- **`make run` (platform integration)**: reads `backend/.env` (optional for
  Compose, but the extension needs real values). Set at least `MPT_PRODUCTS_IDS`,
  `MPT_API_BASE_URL`, and the `SDK_EXTENSION_API_KEY` / `SDK_EXTENSION_ID` /
  `SDK_EXTENSION_URL` values for the target Marketplace.
- **`make run-local` (mock mode)**: requires `backend/.env.local`. The
  `SDK_EXTENSION_*` and `MPT_API_BASE_URL` values point at the local `devmock`
  service.

## Local Example

Example `backend/.env` snippet for platform integration:

```env
SDK_EXTENSION_API_KEY=<extension-api-key>
SDK_EXTENSION_ID=EXT-1111-1111
SDK_EXTENSION_URL=https://extensions.example.com
MPT_API_BASE_URL=https://api.s1.show
MPT_ORDERS_API_POLLING_INTERVAL_SECS=120
MPT_PRODUCTS_IDS=PRD-1111-1111,PRD-2222-2222
MPT_TOOL_STORAGE_TYPE=local
MPT_TOOL_STORAGE_AIRTABLE_API_KEY=<airtable-api-key>
MPT_TOOL_STORAGE_AIRTABLE_BASE_ID=<airtable-base-id>
MPT_TOOL_STORAGE_AIRTABLE_TABLE_NAME=<airtable-table-name>
```

Example `backend/.env.local` snippet for devmock local mode:

```env
SDK_EXTENSION_API_KEY=<extension-api-key>
SDK_EXTENSION_ID=EXT-1111-1111
SDK_EXTENSION_URL=http://devmock:8000
MPT_API_BASE_URL=http://devmock:8000
MPT_PRODUCTS_IDS=PRD-1111-1111
MPT_TOOL_STORAGE_TYPE=local
```

`MPT_PRODUCTS_IDS` is a comma-separated list of Marketplace product identifiers.

The `MPT_TOOL_STORAGE_*` variables mirror the storage configuration documented in `mpt-tool`. When `MPT_TOOL_STORAGE_TYPE=local`, the Airtable variables may remain unset locally. When `MPT_TOOL_STORAGE_TYPE=airtable`, set `MPT_TOOL_STORAGE_AIRTABLE_API_KEY`, `MPT_TOOL_STORAGE_AIRTABLE_BASE_ID`, and `MPT_TOOL_STORAGE_AIRTABLE_TABLE_NAME` together.

## Static Assets

Frontend plug bundles are generated into `static/` and served by the backend at
`/static`. Plug metadata references these bundles with `/static/...` hrefs. The
build also emits TypeScript declarations into `static/types/`.

How `static/` reaches the backend depends on the image stage in
[`Dockerfile`](../Dockerfile):

- **dev** (used by `compose.yaml`): `static/` is bind-mounted into the backend
  container at `/extension/static`, so the frontend watcher's output is picked up
  live.
- **prod**: the bundles are built in the `frontend-build` stage and baked into
  the image, so the production container ships its own `static/` and runs as a
  non-root user.
