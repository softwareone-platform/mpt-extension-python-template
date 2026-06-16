# Testing

Shared unit-test rules live in [unittests.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/unittests.md).

Shared build and target knowledge also applies:

- [knowledge/build-and-checks.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/build-and-checks.md)
- [knowledge/make-targets.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/make-targets.md)

This file documents only repository-specific testing behavior.

## Test Scope

The current test scope covers:

- backend app route registration for API, event, and plug routes
- agreement API handlers
- order and agreement event handlers
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
- coverage is collected for `swo_playground`
- tests run with `--import-mode=importlib`

## Writing Tests

Repository-specific guidance:

- Use fixtures from [`backend/tests/conftest.py`](../backend/tests/conftest.py) where possible.
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
- pipeline step behavior
- plug registration or static asset references
- frontend plug behavior
- command output
- dependency wiring in the extension app

If a change only affects documentation, tests are not required.
