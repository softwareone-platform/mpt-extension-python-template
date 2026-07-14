# Examples

This repository is a playground: the code under `backend/swo_playground/` and
`frontend/src/` is a set of small, working examples of the extension building
blocks. This document is a guided tour of those examples and where to find them.

It describes *what this repository demonstrates*, not the SDK APIs themselves.
For the library APIs, see the SDK usage guides linked from [README.md](../README.md).

## Trying It With Postman

[`backend/docs/postman_collection.json`](../backend/docs/postman_collection.json)
is a ready-made Postman collection for a locally running backend (default
`base_url` `http://localhost:8080`, the port exposed by `make run-local`). Auth
is wired automatically through a collection-level pre-request script. It contains
sample requests for the example routes below — `/health`, the order and agreement
events, and the agreement API (including list pagination, get, not-found, and
sync) — so you can exercise the playground without writing requests by hand.

## Application Wiring

[`backend/swo_playground/app.py`](../backend/swo_playground/app.py) creates the
`ExtensionApp` and registers every example router:

- `events_orders_router` — order event handling
- `events_agreements_router` — agreement event handling
- `api_agreements_router` — agreement API endpoints
- `plug_portal_router` — top-level portal plugs (the `learn-extensions` navigation group with the examples app and guide nested under it, plus the `add` showcase)
- `plug_agreements_router` — agreement plugs (the real examples plus the agreements `add` showcase)
- `plug_orders_router` / `plug_subscriptions_router` / `plug_assets_router` / `plug_accounts_router` — per-entity `add` showcase plugs

Each router below is an independent example and can be read on its own.

## API Endpoints

[`backend/swo_playground/routers/api/agreement.py`](../backend/swo_playground/routers/api/agreement.py)
exposes an `APIRouter` under `/api/v2/agreements`:

| Route | Name | Demonstrates |
| --- | --- | --- |
| `GET /` | `agreements-list` | Paginated reads with `ctx.request.pagination` and `PaginatedResult` / `APIResponse.paginated` |
| `GET /{agreement_id}` | `agreements-get` | Reading a single agreement via `ctx.mpt_api_service` and returning `APIResponse.ok` |
| `POST /{agreement_id}/sync` | `agreements-sync` | A write-style action that re-reads current Marketplace data |

These handlers read Marketplace data through `ctx.mpt_api_service.agreements`.
The `sync` route is the backend half of the frontend "Sync now" example (see
[Plugs](#plugs)).

## Events

The playground shows the two event styles supported by the SDK:

- **Task event** —
  [`routers/events/order.py`](../backend/swo_playground/routers/events/order.py)
  registers `@orders_router.task("/purchase")` for
  `platform.commerce.order.status_changed`, filtered by a `condition` on the
  configured `product.id`s. It receives a standard `OrderContext` and runs the
  `PurchasePipeline`.
- **Non-task event with a custom context** —
  [`routers/events/agreement.py`](../backend/swo_playground/routers/events/agreement.py)
  registers `@agreements_router.event("/complete")` for
  `platform.commerce.agreement.status_changed`, with a richer condition
  (`...,eq(status,Active)`) and a `context_adapter_type=EventAgreementContext`. It
  runs the `CompleteAgreementPipeline`.

Both conditions are built from `get_extension_settings().product_ids`, showing
how event registration uses extension settings.

## Pipelines And Steps

Event handlers delegate to small pipelines, demonstrating the
pipeline/step composition pattern:

- [`flows/pipelines/orders/purchase.py`](../backend/swo_playground/flows/pipelines/orders/purchase.py)
  (`PurchasePipeline`) → [`flows/steps/log_order.py`](../backend/swo_playground/flows/steps/log_order.py)
  (`LogOrderStep`, logs the order id).
- [`flows/pipelines/agreements/complete.py`](../backend/swo_playground/flows/pipelines/agreements/complete.py)
  (`CompleteAgreementPipeline`) → [`flows/steps/log_agreement.py`](../backend/swo_playground/flows/steps/log_agreement.py)
  (`LogAgreementStep`, logs the agreement id and the custom context field).

A pipeline is a `BasePipeline` whose `steps` property returns an ordered list of
`BaseStep`s. The steps here only log, on purpose — they are the place real
fulfillment logic would go.

## Custom Context

[`backend/swo_playground/context/agreement.py`](../backend/swo_playground/context/agreement.py)
defines `EventAgreementContext`, an example context adapter that extends the SDK
`AgreementContext` with an extra `mock_field` and overrides `from_context`. It is
wired into the agreement event (`context_adapter_type=...`) and consumed by
`LogAgreementStep`, showing how to carry extension-specific data through a
pipeline.

## Plugs

[`backend/swo_playground/routers/plugs/agreements.py`](../backend/swo_playground/routers/plugs/agreements.py)
declares three Marketplace Portal plugs through a `PlugRouter`. Each plug points
at a frontend bundle via `href` and binds to a Portal `socket`. The frontend
module names match the bundle paths one-to-one:

| Plug id / socket | Frontend module | Demonstrates |
| --- | --- | --- |
| `agreements-agreement` — `portal.commerce.agreements.agreement` | [`modules/agreements-agreement/`](../frontend/src/modules/agreements-agreement/) | A full agreement tab: sync status, `useAgreementSync`, status chips, and a "Sync now" action calling the `sync` API |
| `agreements-line-actions` — `portal.commerce.agreements.line.actions` | [`modules/agreements-line-actions/`](../frontend/src/modules/agreements-line-actions/) | A modal (`useMPTModal`) that renders agreement details with a Close action |
| `agreements-agreement-actions` — `portal.commerce.agreements.agreement.actions` | [`modules/agreements-agreement-actions/`](../frontend/src/modules/agreements-agreement-actions/) | A multi-step `Wizard` that reviews agreement details (read-only) |

Each module's `index.tsx` follows the same entry-point pattern: import the
`safe-storage` shim, call `setup()` from `@mpt-extension/sdk`, and mount the
`App` with `createRoot`. The shared building blocks they reuse (`useAgreement`,
`useAgreementId`, `AgreementDetailsList`, `model.ts`) live under
[`frontend/src/shared/`](../frontend/src/shared/); see
[docs/architecture.md](architecture.md#frontend) for the frontend structure.

## UI SDK Showcase Plugs

These plugs demonstrate the UI SDK breadth rather than a specific business flow.
Like the agreement plugs, they are organised **per entity** — one `PlugRouter`
file each: [`portal.py`](../backend/swo_playground/routers/plugs/portal.py)
(top-level: the `learn-extensions` group with examples and guide, `add`),
[`orders.py`](../backend/swo_playground/routers/plugs/orders.py),
[`subscriptions.py`](../backend/swo_playground/routers/plugs/subscriptions.py),
[`assets.py`](../backend/swo_playground/routers/plugs/assets.py),
[`accounts.py`](../backend/swo_playground/routers/plugs/accounts.py), and the
agreements `add` plug in [`agreements.py`](../backend/swo_playground/routers/plugs/agreements.py):

| Plug id / socket | Frontend module | Demonstrates |
| --- | --- | --- |
| `learn-extensions` — `portal` | — (no bundle) | A `NavigationPlug` container: a href-less navigation grouping node whose id derives the nested socket `portal.learn-extensions` for the two plugs below |
| `examples` — `portal.learn-extensions` | [`modules/examples/`](../frontend/src/modules/examples/) | A multi-tab React app (`react-router`) touring the UI SDK: Introduction, Basics, Context (`useMPTContext`), API calls (the `http` client feeding a server-driven `Grid` via `useGridWithRql` + RQL), and UI elements (buttons, inputs, selects, toggles, date pickers, grids, entity references) |
| `guide` — `portal.learn-extensions` | [`modules/guide/`](../frontend/src/modules/guide/) | Rendering bundled Markdown with `InlineMarkdown` (esbuild `.md` text loader) |
| `add-<socket>` (one per socket) | [`modules/add-*/`](../frontend/src/modules/) | A "plug here" scaffold shown on every remaining Portal socket, so the full set of sockets is covered |

The `add-*` plugs cover many near-identical sockets without duplicating logic:
each is a thin module directory whose `index.tsx` mounts the shared
[`AddPlugShowcase`](../frontend/src/shared/components/AddPlugShowcase.tsx)
component with its socket passed as a prop, and each maps to one `add_plug(...)`
line in the matching per-entity router (the helper lives in
[`plugs/common.py`](../backend/swo_playground/routers/plugs/common.py)).

A socket-less modal round-trip demo (a dialog/wizard opened purely via
`useMPTModal().open()`) is intentionally not included yet: the backend `Plug`
requires a `socket`, so it awaits a dedicated modal plug type in the SDK.

## Migrations

[`backend/migrations/`](../backend/migrations/) contains example data and schema
migrations. They are intentionally fake placeholders; see
[docs/migrations.md](migrations.md).
