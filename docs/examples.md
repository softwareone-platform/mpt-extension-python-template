# Examples

This repository is a template: the code under `backend/mpt_extension_python_template/` and
`frontend/src/` is a set of small, working examples of the extension building
blocks. This document is a guided tour of those examples and where to find them.

It describes *what this repository demonstrates*, not the SDK APIs themselves.
For the library APIs, see the SDK usage guides linked from [README.md](../README.md).

## Trying It With Postman

[`backend/docs/postman_collection.json`](../backend/docs/postman_collection.json)
is a ready-made Postman collection for a locally running backend (default
`base_url` `http://localhost:8080`, the port exposed by `make run-local`). Auth
is wired automatically through a collection-level pre-request script. It contains
sample requests for the example routes below — the `/bypass` operational routes
(`health`, `live`, `ready`), the order and agreement events, the agreement API
(including list pagination, get, not-found, and sync), and a schedule delivery —
so you can exercise the template without writing requests by hand.

## Application Wiring

[`backend/mpt_extension_python_template/app.py`](../backend/mpt_extension_python_template/app.py) creates the
`ExtensionApp` and registers every example router:

- `events_orders_router` — order event handling
- `events_agreements_router` — agreement event handling
- `api_agreements_router` — agreement API endpoints
- `schedules_agreements_router` — the scheduled agreement synchronization
- `plug_portal_router` — top-level portal plugs (the `learn-extensions` navigation group with the examples app and guide nested under it, plus the `add` showcase)
- `plug_modals_router` — socketless modal plugs (`dialog` and `wizard`) opened by id from the examples "Modals" view
- `plug_agreements_router` — agreement plugs (the agreement tab example plus the agreements `add` showcase)
- `plug_orders_router` / `plug_subscriptions_router` / `plug_assets_router` / `plug_accounts_router` — per-entity `add` showcase plugs

Each router below is an independent example and can be read on its own.

## API Endpoints

[`backend/mpt_extension_python_template/routers/api/agreement.py`](../backend/mpt_extension_python_template/routers/api/agreement.py)
exposes an `APIRouter` under `/api/v2/agreements`:

| Route | Name | Demonstrates |
| --- | --- | --- |
| `GET /` | `agreements-list` | Paginated reads with `ctx.request.pagination` and `PaginatedResult` / `APIResponse.paginated` |
| `GET /{agreement_id}` | `agreements-get` | Reading a single agreement via `ctx.mpt_api_service`, returning `APIResponse.ok`, and turning a Marketplace 404 into an SDK `NotFoundError` so the route answers 404 |
| `POST /{agreement_id}/sync` | `agreements-sync` | A read as the calling account followed by a write back as the extension vendor (see [Two Account Identities](#two-account-identities)) |

These handlers read Marketplace data through `ctx.mpt_api_service.agreements`.
The `sync` route is the backend half of the frontend "Sync now" example (see
[Plugs](#plugs)).

## Two Account Identities

Every SDK context carries two Marketplace services: `ctx.mpt_api_service`,
authenticated as the account in the incoming request token, and
`ctx.vendor_mpt_api_service`, authenticated as the vendor account that owns the
extension. Use the first by default; reach for the second only when a flow has
to act as the extension owner regardless of who triggered it.

The `agreements-sync` route shows both in one handler — it reads as the caller,
then writes back as the vendor:

```python
agreement = await ctx.mpt_api_service.agreements.get_by_id(agreement_id)
await ctx.vendor_mpt_api_service.agreements.update(
    agreement_id, {"externalIds": {"vendor": agreement.external_ids.vendor}}
)
```

`externalIds.vendor` is deliberate: each actor owns one key of that object, so
the calling account could not perform this write at all. The value written is
the one already there, so the example changes no data. See
[docs/architecture.md](architecture.md#data-flow) for when to reach for each
service.

The schedule below is the other case: it has no calling account to inherit, so
it reads as the vendor.

## Schedules

[`backend/mpt_extension_python_template/routers/schedules/agreement.py`](../backend/mpt_extension_python_template/routers/schedules/agreement.py)
registers a `ScheduleRouter` task. The SDK runs no in-process scheduler: it
publishes the cron configuration in the extension metadata (`schedules:` in
`meta.yaml`) and the Extension Framework delivers each occurrence as a task
event.

| Route | Id / name | Demonstrates |
| --- | --- | --- |
| `POST /schedules/v1/agreements/sync` | `agreements.sync` / `agreements-sync-schedule` | A `@task(...)` registration with a five-field `cron`, the delivery metadata in `ctx.meta`, vendor-scoped reads, and `ctx.task.progress(...)` |

The handler reads the first page of vendor agreements, logs each one and
reports progress; it changes no agreement state, since this is an example.

[docs/architecture.md](architecture.md#data-flow) covers the delivery model the
handler has to live with, and the SDK
[schedules guide](https://github.com/softwareone-platform/mpt-extension-sdk/blob/main/docs/sdk_usage/schedules.md)
documents the delivery protocol, the watchdog cadence and the task lifetime
limits.

## Events

The template shows the two event styles supported by the SDK:

- **Task event** —
  [`routers/events/order.py`](../backend/mpt_extension_python_template/routers/events/order.py)
  registers `@orders_router.task("/purchase")` for
  `platform.commerce.order.status_changed`, filtered by a `condition` on the
  configured `product.id`s. It receives a standard `OrderContext` and runs the
  `PurchasePipeline`.
- **Non-task event with a custom context** —
  [`routers/events/agreement.py`](../backend/mpt_extension_python_template/routers/events/agreement.py)
  registers `@agreements_router.event("/complete")` for
  `platform.commerce.agreement.status_changed`, with a richer condition
  (`...,eq(status,Active)`) and a `context_adapter_type=EventAgreementContext`. It
  runs the `CompleteAgreementPipeline`.

Both conditions are built from `get_extension_settings().product_ids`, showing
how event registration uses extension settings.

## Pipelines And Steps

Event handlers delegate to small pipelines, demonstrating the
pipeline/step composition pattern:

- [`flows/pipelines/orders/purchase.py`](../backend/mpt_extension_python_template/flows/pipelines/orders/purchase.py)
  (`PurchasePipeline`) → `StartOrderProcessing` and `CompleteOrder` from
  [`mpt-extension-contrib-order-status`](https://github.com/softwareone-platform/mpt-extension-python-contrib/tree/main/order-status)
  around [`flows/steps/log_order.py`](../backend/mpt_extension_python_template/flows/steps/log_order.py)
  (`LogOrderStep`, logs the order id). The contrib steps switch the order to
  `Processing` and `Completed` using the product's default status templates
  (pass `template_name=...` to select a named template instead).
- [`flows/pipelines/agreements/complete.py`](../backend/mpt_extension_python_template/flows/pipelines/agreements/complete.py)
  (`CompleteAgreementPipeline`) → [`flows/steps/log_agreement.py`](../backend/mpt_extension_python_template/flows/steps/log_agreement.py)
  (`LogAgreementStep`, logs the agreement id and the custom context field).

A pipeline is a `BasePipeline` whose `steps` property returns an ordered list of
`BaseStep`s. `PurchasePipeline` shows both kinds of steps: shared steps reused
from a contrib library and a local step (`LogOrderStep`) standing in for the
extension's own fulfillment logic.

## Custom Context

[`backend/mpt_extension_python_template/context/agreement.py`](../backend/mpt_extension_python_template/context/agreement.py)
defines `EventAgreementContext`, an example context adapter that extends the SDK
`AgreementContext` with an extra `mock_field` and overrides `from_context`. It is
wired into the agreement event (`context_adapter_type=...`) and consumed by
`LogAgreementStep`, showing how to carry extension-specific data through a
pipeline.

## Plugs

Plugs are qualified with the extension id (`SDK_EXTENSION_ID`) through two
helpers in
[`routers/plugs/common.py`](../backend/mpt_extension_python_template/routers/plugs/common.py):

| Helper | Applies to | Result |
| --- | --- | --- |
| `plug_name(...)` | every plug | `Plug here (EXT-1111-1111)` |
| `plug_id(...)` | socket-mounted plugs only | `agreements-agreement-ext-1111-1111` |

Several deployments of this template can be registered against the same account,
one per developer or per environment. The Portal renders the plug name on its
own and aggregates the plugs of every installed extension into the same socket,
so without the qualifiers two deployments produce indistinguishable buttons and
colliding ids.

Worth knowing:

- Modal plug ids stay bare: this extension's own frontend resolves them with
  `useMPTModal().open('dialog')` and has no access to `SDK_EXTENSION_ID`.
- Bundle paths stay bare: `add_plug` qualifies the id but leaves `href` on
  `/static/add-<socket>/index.js`, which maps to a built directory.
- `NavigationPlug` derives `<socket>.<id>`, so its children target
  `portal.learn-extensions-ext-1111-1111` and each deployment gets its own
  navigation group.
- The helpers read the id from the extension settings, not from
  `get_runtime_settings()`: loading the runtime settings is what builds the
  metadata that asks for the plugs.

The tables below show ids in their qualified form, with `<extension-id>`
standing in for the lower-cased `SDK_EXTENSION_ID`.

[`backend/mpt_extension_python_template/routers/plugs/agreements.py`](../backend/mpt_extension_python_template/routers/plugs/agreements.py)
declares a Marketplace Portal plug through a `PlugRouter`. The plug points
at a frontend bundle via `href` and binds to a Portal `socket`. The frontend
module name matches the bundle path one-to-one:

| Plug id / socket | Frontend module | Demonstrates |
| --- | --- | --- |
| `agreements-agreement-<extension-id>` — `portal.commerce.agreements.agreement` | [`modules/agreements-agreement/`](../frontend/src/modules/agreements-agreement/) | A full agreement tab: sync status, `useAgreementSync`, status chips, and a "Sync now" action calling the `sync` API |

## Modal Plugs (Opened By Id)

[`backend/mpt_extension_python_template/routers/plugs/modals.py`](../backend/mpt_extension_python_template/routers/plugs/modals.py)
declares two `ModalPlug`s. A modal plug has **no socket**: the platform never
renders it as a page action, and it exists only to be opened programmatically
by id via `useMPTModal().open('<plug-id>')`. The examples app "Modals" view
([`modules/examples/views/Modals.tsx`](../frontend/src/modules/examples/views/Modals.tsx))
opens both plugs by id, passes a `context` payload to them, and displays the
result each modal reports back through `close(data)` (delivered to the opener's
`onClose` callback):

| Plug id | Frontend module | Demonstrates |
| --- | --- | --- |
| `dialog` | [`modules/dialog/`](../frontend/src/modules/dialog/) | A confirmation dialog that renders the opener's `question` from `useMPTContext()` and returns `{ confirmed: true/false }` |
| `wizard` | [`modules/wizard/`](../frontend/src/modules/wizard/) | A multi-step `Wizard` that echoes the opener context and returns `{ completed: true/false }` |

The result objects above are what these modals pass to `close(data)`. When a
modal is dismissed without an explicit close — for example through the
platform's modal chrome — `onClose` receives `undefined`, so openers must guard
against an `undefined` result before reading fields like `confirmed` or
`completed`.

Each module's `index.tsx` follows the same entry-point pattern: import the
`safe-storage` shim, call `setup()` from `@mpt-extension/sdk`, and mount the
`App` with `createRoot`. The shared building blocks the agreement tab reuses
(`useAgreement`, `useAgreementId`, `AgreementDetailsList`, `model.ts`) live under
[`frontend/src/shared/`](../frontend/src/shared/); see
[docs/architecture.md](architecture.md#frontend) for the frontend structure.

## UI SDK Showcase Plugs

These plugs demonstrate the UI SDK breadth rather than a specific business flow.
Like the agreement plugs, they are organised **per entity** — one `PlugRouter`
file each: [`portal.py`](../backend/mpt_extension_python_template/routers/plugs/portal.py)
(top-level: the `learn-extensions` group with examples and guide, `add`),
[`orders.py`](../backend/mpt_extension_python_template/routers/plugs/orders.py),
[`subscriptions.py`](../backend/mpt_extension_python_template/routers/plugs/subscriptions.py),
[`assets.py`](../backend/mpt_extension_python_template/routers/plugs/assets.py),
[`accounts.py`](../backend/mpt_extension_python_template/routers/plugs/accounts.py), and the
agreements `add` plug in [`agreements.py`](../backend/mpt_extension_python_template/routers/plugs/agreements.py):

| Plug id / socket | Frontend module | Demonstrates |
| --- | --- | --- |
| `learn-extensions-<extension-id>` — `portal` | — (no bundle) | A `NavigationPlug` container: a href-less navigation grouping node whose id derives the nested socket `portal.learn-extensions-<extension-id>` for the two plugs below |
| `examples-<extension-id>` — `portal.learn-extensions-<extension-id>` | [`modules/examples/`](../frontend/src/modules/examples/) | A multi-tab React app (`react-router`) touring the UI SDK: Introduction, Basics, Context (`useMPTContext`), API calls (the `http` client feeding a server-driven `Grid` via `useGridWithRql` + RQL), UI elements (buttons, inputs, selects, toggles, date pickers, grids, entity references), and Modals (the socketless `dialog` / `wizard` round-trip via `useMPTModal().open()`) |
| `guide-<extension-id>` — `portal.learn-extensions-<extension-id>` | [`modules/guide/`](../frontend/src/modules/guide/) | Rendering bundled Markdown with `InlineMarkdown` (esbuild `.md` text loader) |
| `add-<socket>-<extension-id>` (one per socket) | [`modules/add-*/`](../frontend/src/modules/) | A "plug here" scaffold shown on every remaining Portal socket, so the full set of sockets is covered |

The `add-*` plugs cover many near-identical sockets without duplicating logic:
each is a thin module directory whose `index.tsx` mounts the shared
[`AddPlugShowcase`](../frontend/src/shared/components/AddPlugShowcase.tsx)
component with its socket passed as a prop, and each maps to one `add_plug(...)`
line in the matching per-entity router (the helper lives in
[`plugs/common.py`](../backend/mpt_extension_python_template/routers/plugs/common.py)).

## Migrations

[`backend/migrations/`](../backend/migrations/) contains example data and schema
migrations. They are intentionally fake placeholders; see
[docs/migrations.md](migrations.md).
