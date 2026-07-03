# Building Extensions for the SoftwareONE Marketplace

## What Is an Extension?

An Extension is a third-party web application whose UI plugs into the SoftwareONE Marketplace
platform. Each Extension can contribute one or more **Plugs** — independent UI pieces, each targeting
a named **Socket** (a predefined place in the platform UI, such as an order detail tab or a top-level
navigation section). A Plug is a JavaScript bundle that the platform loads into an iframe when the
corresponding Socket is rendered.

The three terms to remember: **Extension** is your app, **Socket** is where it appears, **Plug** is
what you ship to fill that socket.

## Extension Structure

A typical extension has two parts:

- **Frontend** — React/TypeScript UI, organised as one module per Plug, each built into its own JS
  bundle under `/static`.
- **Backend** — Python/FastAPI service handling platform events, validation webhooks, background
  tasks, scheduled jobs, and custom API endpoints.

## Declaring Plugs

Unlike a `meta.yaml`-based extension, this playground declares its Plugs **in Python** using a
`PlugRouter`. Each `Plug` maps a socket to the static bundle that fills it:

```python
from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

showcase_router = PlugRouter()

@showcase_router.register()
def showcase_plugs() -> list[Plug]:
    return [
        Plug(
            id="examples",
            name="Extension examples",
            description="SDK UI capabilities showcase.",
            socket="portal",
            href="/static/examples/index.js",
        ),
    ]
```

The router is then mounted on the extension app with `ext_app.include_router(showcase_router)`.

## Building the Frontend

Each directory under `frontend/src/modules` is an entry point. `esbuild` bundles every
`<module>/index.tsx` into `/static/<module>/index.js`. In your entry point you call `setup()` from the
SDK and mount your React app into the provided root element:

```tsx
import { setup } from '@mpt-extension/sdk';
import { createRoot } from 'react-dom/client';
import App from './App';

setup((element: Element) => {
  const root = createRoot(element);
  root.render(<App/>);
});
```

## What to Explore Next

- **UI elements** — buttons, inputs, selects, toggles, date pickers, grids and entity references from
  `@softwareone-platform/sdk-react-ui-v0`.
- **Context** — read the current user, account, and the entity in scope with `useMPTContext()`.
- **API calls** — call the Marketplace API or your own backend with the auto-authenticated `http`
  client.
- **Modals** — open dialogs and wizards with `useMPTModal()` and pass results back to the opener.
