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
- `plug_agreements_router` — Marketplace Portal plugs

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

## Migrations

[`backend/migrations/`](../backend/migrations/) contains example data and schema
migrations. They are intentionally fake placeholders; see
[docs/migrations.md](migrations.md).
