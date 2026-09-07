# Testing

Shared unit-test rules live in [unittests.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/unittests.md). Frontend (UI) tests follow [extensions-ui-testing-best-practices.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/extensions-ui-testing-best-practices.md).

Shared build and target knowledge also applies:

- [knowledge/build-and-checks.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/build-and-checks.md)
- [knowledge/make-targets.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/make-targets.md)

This file documents only repository-specific testing behavior.

## Test Scope

The current test scope covers:

- backend app route registration for API, event, schedule, and plug routes
- generated plug and schedule metadata
- agreement API handlers
- order and agreement event handlers
- the agreement schedule handler
- order and agreement pipeline execution
- pipeline step logging behavior
- frontend plug components, hooks, and shared model helpers

## Commands

Use the repository make targets:

```bash
make test
make check
make check-all
```

Repository command mapping:

- `make test` runs backend `pytest` and frontend `jest`
- `make test scope=backend` runs backend `pytest`
- `make test scope=frontend` runs frontend `npm test`
- `make check` runs backend formatting/lint/type/lock checks and frontend TypeScript/ESLint checks
- `make check scope=backend` runs `ruff format --check`, `ruff check`, `flake8`, `mypy`, and `uv lock --check`
- `make check scope=frontend` runs `tsc --noEmit` and `eslint`
- `make check-all` runs checks, tests, frontend build, and metadata generation/validation for `scope=all`

The CI workflow in [`.github/workflows/pr-build-merge.yml`](../.github/workflows/pr-build-merge.yml) uses the same `make build` and `make check-all` flow, and additionally runs a SonarCloud/SonarQube scan (`SONAR_TOKEN`) as a quality gate that can block the pull request.

## Pytest Configuration

Repository-specific test settings come from [`backend/pyproject.toml`](../backend/pyproject.toml):

- tests are discovered under `tests`
- `pythonpath` includes the repository root
- coverage is collected for `mpt_extension_python_template`
- tests run with `--import-mode=importlib`

## Environment Variables In Tests

[`backend/tests/conftest.py`](../backend/tests/conftest.py) assigns
`MPT_PRODUCTS_IDS` and `SDK_EXTENSION_ID` at module level, before any test module
is imported. The event routers interpolate the product ids into their `condition`
at import time, so a per-test fixture runs too late for those. The plug routers
resolve the extension id lazily through the cached `get_extension_settings()`,
and it is pinned in the same place so both values come from one source.

Both must be assigned, not set with `setdefault`. Compose passes `backend/.env`
into the container, so a developer's own `SDK_EXTENSION_ID` would otherwise reach
the suite and break the tests that assert qualified plug names and ids.

Any new setting read at import time must be pinned there the same way.

## Writing Tests

Repository-specific guidance:

- Use fixtures from [`backend/tests/conftest.py`](../backend/tests/conftest.py) where possible, and from the per-package conftest closest to the tests that need them (for example [`backend/tests/routers/conftest.py`](../backend/tests/routers/conftest.py), which builds autospecced `MPTAPIService` doubles).
- Take those doubles from `mpt_api_service` and `vendor_mpt_api_service`. They are
  separate instances built by the same factory fixture, because the tests that
  cover a vendor-identity flow assert which service performed each call; do not
  collapse them into one.
- Mock external Marketplace SDK calls rather than calling real services.
- Keep tests focused on the behavior of the extension layer, not on internals of `mpt-extension-sdk` itself.
- Keep frontend tests close to the component, hook, or model module they cover.
- Use generated devmock payloads only as stable examples; do not depend on live Marketplace services.
- Follow the shared unit-test standard for AAA structure, parametrization, mocking rules, deterministic behavior, and coverage expectations.

## Frontend Tests

Frontend tests run with Jest + Testing Library (`make test scope=frontend`).
Repository-specific patterns:

- Co-locate tests with the module they cover (`App.test.tsx`, `*.test.ts` next to
  the component, hook, or model under `frontend/src/`).
- Mock the SDK HTTP client (`http` from `@mpt-extension/sdk`) instead of hitting a
  backend; assert on rendered output and load/error states.
- Reuse shared fixtures from [`frontend/src/shared/test-utils/`](../frontend/src/shared/test-utils/)
  (for example `agreement-mocks.ts`) rather than redefining agreement payloads.
- Render components with Testing Library and query by accessible roles/labels.

## When Tests Are Required

Add or update tests when a change modifies:

- API request handling
- event processing
- schedule handling
- pipeline step behavior
- plug registration, plug metadata, or static asset references
- frontend plug behavior
- command output
- dependency wiring in the extension app

If a change only affects documentation, tests are not required.
