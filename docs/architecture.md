# Architecture

Keep this document focused on actual architecture decisions for the repository.

This repository is a small Marketplace extension playground. It is intentionally minimal, but it now has stable backend and frontend examples that should stay documented here.

## Runtime Components

- `backend/swo_playground/app.py` creates the `ExtensionApp` and registers all routers.
- `backend/swo_playground/routers/api/` exposes extension API endpoints.
- `backend/swo_playground/routers/events/` declares Marketplace event handlers.
- `backend/swo_playground/flows/pipelines/` contains simple order and agreement pipelines.
- `backend/swo_playground/flows/steps/` contains reusable pipeline steps.
- `backend/swo_playground/routers/plugs/` declares Marketplace Portal plug metadata.
- `frontend/src/modules/` contains the React plug entry points.
- `static/` contains generated frontend bundles served by the backend.

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

## Persistence And Migrations

Migration examples live in `backend/migrations/` and are managed by `mpt-tool`; see [docs/migrations.md](migrations.md).

## Guidance

- Avoid fictional or speculative architecture.
- Put workflow details in the other topic-specific documents under `docs/`.
- Update this file when the repository gains stable components or non-trivial design rules.
