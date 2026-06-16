# Architecture

Keep this document focused on actual architecture decisions for the repository.

This repository is a small Marketplace extension playground. It is intentionally minimal, but it now has stable backend and frontend examples that should stay documented here.

## Runtime Components

- `backend/swo_playground/app.py` creates the `ExtensionApp` and registers all routers.
- `backend/swo_playground/settings.py` defines `ExtensionSettings` and the required environment variables (for example `MPT_PRODUCTS_IDS`).
- `backend/swo_playground/routers/api/` exposes extension API endpoints.
- `backend/swo_playground/routers/events/` declares Marketplace event handlers.
- `backend/swo_playground/flows/pipelines/` contains simple order and agreement pipelines.
- `backend/swo_playground/flows/steps/` contains reusable pipeline steps.
- `backend/swo_playground/context/` contains context adapters (for example `EventAgreementContext`) used by pipelines.
- `backend/swo_playground/routers/plugs/` declares Marketplace Portal plug metadata.
- `frontend/src/modules/` contains the React plug entry points.
- `static/` contains generated frontend bundles served by the backend.

This document covers how the backend and frontend layers fit together in *this*
repository; for the SDK APIs themselves, see the SDK references in
[README.md](../README.md).

## Entry Points

The extension currently registers:

- agreement API routes under `/api/v2/agreements`
- order event route `/events/v2/orders/purchase`
- agreement event route `/events/v2/agreements/complete`
- agreement-related Marketplace Portal plugs that load bundles from `/static/`

## Data Flow

Agreement API handlers read Marketplace agreement data through the SDK API service and return SDK `APIResponse` objects.

Event handlers receive Marketplace event payloads, log the event context, and execute a small pipeline. The pipelines are deliberately simple examples and should remain focused on extension-layer behavior rather than SDK internals.

Portal plugs are declared by backend metadata. The frontend build writes JavaScript bundles into `static/`; those bundles are referenced by plug `href` values and mounted into the backend container.

## Frontend

The frontend follows a small set of conventions:

- **Plugs**: each directory under `frontend/src/modules/<name>/` is a plug with an
  `index.tsx` entry point. The esbuild config ([`frontend/esbuild.config.js`](../frontend/esbuild.config.js))
  discovers these entry points by convention and emits one IIFE bundle per module
  into `static/<name>/index.js`. The bundle filename must match the `href` in the
  plug metadata, or MPT cannot load the iframe.
- **Shared layer**: `frontend/src/shared/` holds reusable building blocks —
  `components/` (presentational UI), `hooks/` (for example `useAgreement`, which
  fetches `/api/v2/agreements/{id}` through the SDK `http` client and exposes
  load/error/ready states), and `model.ts` (response types and formatters).
- **Build output**: the build emits bundles plus sourcemaps, and TypeScript
  declarations under `static/types/`.

The static-asset bridge is the contract between the layers: the frontend writes
into `static/`, the backend serves it at `/static`, and the dev/prod image stages
differ in whether `static/` is bind-mounted or baked in (see
[docs/deployment.md](deployment.md)). For the iframe-specific styling shims under
`frontend/src/fixes/`, see the code comments — they are expected to shrink as the
UI SDK evolves and are intentionally not documented here yet.

## Persistence And Migrations

Migration examples live in `backend/migrations/` and are managed by `mpt-tool`; see [docs/migrations.md](migrations.md).

## Guidance

- Avoid fictional or speculative architecture.
- Put workflow details in the other topic-specific documents under `docs/`.
- Update this file when the repository gains stable components or non-trivial design rules.
