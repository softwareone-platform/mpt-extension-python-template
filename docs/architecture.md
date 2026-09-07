# Architecture

Keep this document focused on actual architecture decisions for the repository.

This repository is a small Marketplace extension template. It is intentionally minimal, but it now has stable backend and frontend examples that should stay documented here.

## Runtime Components

- `backend/mpt_extension_python_template/app.py` creates the `ExtensionApp` and registers all routers.
- `backend/mpt_extension_python_template/settings.py` defines `ExtensionSettings` and the required environment variables (for example `MPT_PRODUCTS_IDS`).
- `backend/mpt_extension_python_template/routers/api/` exposes extension API endpoints.
- `backend/mpt_extension_python_template/routers/events/` declares Marketplace event handlers.
- `backend/mpt_extension_python_template/routers/schedules/` declares cron-driven schedule handlers.
- `backend/mpt_extension_python_template/flows/pipelines/` contains simple order and agreement pipelines.
- `backend/mpt_extension_python_template/flows/steps/` contains reusable pipeline steps.
- `backend/mpt_extension_python_template/context/` contains context adapters (for example `EventAgreementContext`) used by pipelines.
- `backend/mpt_extension_python_template/routers/plugs/` declares Marketplace Portal plug metadata; `plug_name(...)` and `plug_id(...)` in `plugs/common.py` qualify plug names and socket-mounted plug ids with `SDK_EXTENSION_ID`, so concurrent deployments stay distinguishable and their ids do not collide in the Portal.
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
- agreement schedule route `/schedules/v1/agreements/sync`
- Marketplace Portal plugs that load bundles from `/static/`: the agreement plug, socketless modal plugs opened by id, and a UI SDK showcase (an examples app, a guide, and per-socket "add a plug" demos)

## Data Flow

Agreement API handlers read Marketplace agreement data through the SDK API service and return SDK `APIResponse` objects.

Handler contexts carry two Marketplace services: `ctx.mpt_api_service`, authenticated as the account in the incoming request token, and `ctx.vendor_mpt_api_service`, authenticated as the vendor account that owns the extension. Handlers use the first by default; the `agreements-sync` write-back and the agreement schedule use the second, because their effect must not depend on the calling account.

Schedule handlers are not driven by an in-process scheduler: the SDK publishes the cron configuration in the extension metadata and the Extension Framework delivers each occurrence as a task event. The handler is submitted to the SDK runner and the delivery is answered immediately.

A delivery only runs the handler when it claims the platform task; a delivery that arrives while another execution holds the task is answered with a reschedule instead. Schedule flows must still be idempotent, because a delivery that re-claims the task after a reschedule runs the handler again from the beginning. Progress reporting is best-effort: a failed report neither fails the handler nor extends the task lifetime limits. A schedule cannot reuse the event pipelines either, since `BasePipeline.execute` is typed for `EventBaseContext` and passing a `ScheduleContext` to it fails under `mypy --strict`.

Event handlers receive Marketplace event payloads, log the event context, and execute a small pipeline. The purchase pipeline also reuses the shared `StartOrderProcessing` and `CompleteOrder` steps from `mpt-extension-contrib-order-status` to move the order through its status templates. The pipelines are deliberately simple examples and should remain focused on extension-layer behavior rather than SDK internals.

Portal plugs are declared by backend metadata. The frontend build writes JavaScript bundles into `static/`; those bundles are referenced by plug `href` values and mounted into the backend container.

## Frontend

Frontend authoring rules — SDK usage, module structure, styling, and iframe
compatibility shims — live in the shared
[frontend standard](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/extensions-ui-best-practices.md).
This section only covers what is specific to *this* repository:

- **Module layout**: each directory under `frontend/src/modules/<name>/` is a plug
  with an `index.tsx` entry point; the esbuild config
  ([`frontend/esbuild.config.js`](../frontend/esbuild.config.js)) emits one IIFE
  bundle per module into `static/<name>/index.js`.
- **Shared layer**: `frontend/src/shared/` holds reusable building blocks —
  `components/` (presentational UI, including `AddPlugShowcase` reused by the
  `add-*` modules), `hooks/` (for example `useAgreement`, which fetches
  `/api/v2/agreements/{id}` through the SDK `http` client and exposes
  load/error/ready states), and `model.ts` (response types and formatters).
- **Build output**: the build emits bundles plus sourcemaps, and TypeScript
  declarations under `static/types/`.

The static-asset bridge is the contract between the layers: the frontend writes
into `static/`, the backend serves it at `/static`, and the dev/prod image stages
differ in whether `static/` is bind-mounted or baked in (see
[docs/deployment.md](deployment.md)). The iframe styling shims under
`frontend/src/fixes/` exist for the reasons described in the shared standard's
iframe-compatibility section.

## Persistence And Migrations

Migration examples live in `backend/migrations/` and are managed by `mpt-tool`; see [docs/migrations.md](migrations.md).

## Guidance

- Avoid fictional or speculative architecture.
- Put workflow details in the other topic-specific documents under `docs/`.
- Update this file when the repository gains stable components or non-trivial design rules.
