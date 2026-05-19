# Testing

Shared unit-test rules live in [unittests.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/unittests.md).

Shared build and target knowledge also applies:

- [knowledge/build-and-checks.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/build-and-checks.md)
- [knowledge/make-targets.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/make-targets.md)

This file documents only repository-specific testing behavior.

## Test Scope

Document the areas that the repository tests currently cover. Typical examples:

- extension app registration
- HTTP validation behavior
- event handling
- fulfillment pipeline steps
- management command behavior

Document representative test locations here when the repository has stable test coverage patterns.

## Commands

Use the repository make targets:

```bash
make test
make check
make check-all
```

Repository command mapping:

- `make test` runs `pytest`
- `make check` runs formatting, linting, and lockfile validation
- `make check-all` runs both checks and tests

## Pytest Configuration

Document the repository-specific test settings from [`pyproject.toml`](../pyproject.toml), for example:

- tests run from `tests/`
- coverage is collected for the main application package
- `pythonpath` includes the repository root

## Writing Tests

Repository-specific guidance:

- Use fixtures from [`tests/conftest.py`](../tests/conftest.py) where possible.
- Mock external Marketplace SDK calls rather than calling real services.
- Keep tests focused on the behavior of the extension layer, not on internals of `mpt-extension-sdk` itself.
- Follow the shared unit-test standard for AAA structure, parametrization, mocking rules, deterministic behavior, and coverage expectations.

Remove or replace any example paths in this file once the repository has its own stable test layout.

## When to Add Tests

Add or update tests when a change modifies:

- API request handling
- event processing
- pipeline step behavior
- command output
- dependency wiring in the extension app

If a change only affects documentation, tests are not required.
