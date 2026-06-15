# Contributing

This document describes repository-specific contribution rules.

Shared rules live in `mpt-extension-skills/standards` and should not be duplicated here:

- documentation standard: [documentation.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/documentation.md)
- makefile structure: [makefiles.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/makefiles.md)
- commit message rules: [commit-messages.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/commit-messages.md)
- dependency management: [packages-and-dependencies.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/packages-and-dependencies.md)
- extension design guidance: [extensions-best-practices.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/extensions-best-practices.md)
- pull request rules: [pull-requests.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/pull-requests.md)
- Python coding conventions: [python-coding.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/standards/python-coding.md)

Shared operational knowledge also lives there:

- build and validation flow: [knowledge/build-and-checks.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/build-and-checks.md)
- common make target meanings: [knowledge/make-targets.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/make-targets.md)

## Development Model

The default development environment is Docker-based.

- Use `make build` to build the image and sync dependencies with `uv`.
- Use `make bash` when you need an interactive backend container session.

If the repository supports a local-only workflow outside Docker, document it explicitly in [docs/local-development.md](local-development.md). Otherwise, treat Docker as the default path.

For service startup and local environment expectations, use [docs/local-development.md](local-development.md).

## Code Changes

Repository-specific expectations:

- Keep production code in the repository's main application modules.
- Keep tests under `tests/`, mirroring the production module structure where practical.
- Prefer small, explicit changes that preserve the repository's intended scope.
- When adding a new extension behavior, update or add tests in the same change.

## Validation Before Review

Follow the shared build-and-checks knowledge for the general validation flow.

Repository-specific command entrypoints before review:

```bash
make check
make test
```

Use `make check-all` for the combined validation workflow. Most targets accept `scope=backend`, `scope=frontend`, or `scope=all`; the default is `all`.

`make review` runs a CodeRabbit review in interactive mode (configured by [`.coderabbit.yaml`](../.coderabbit.yaml)); pass `args=<options>` to override or extend it.

See [docs/testing.md](testing.md) for repository-specific testing expectations.

## Releases

Releases are cut by manually dispatching a GitHub Actions workflow with the target version (`X.Y.Z`, no `v` prefix). The branch selected at dispatch time decides the release type: `main` produces a pre-release, a `release/*` branch produces the latest release. Each workflow validates the version (semver, no existing published release, greater than the latest reachable tag) and is safe to re-run.

This repository is the extension/library template and ships both release workflows:

- [`.github/workflows/release-extension.yml`](../.github/workflows/release-extension.yml): for extension repositories. Creates the annotated tag and the GitHub release and runs Dependency-Track; the container image is built by a separate external system.
- [`.github/workflows/release-library.yml`](../.github/workflows/release-library.yml): for Python library repositories. Additionally builds and publishes the package to PyPI via OIDC trusted publishing. The PyPI trusted publisher is bound to the workflow filename, so keep the filename stable when adopting it.

## Documentation Changes

When changing repository docs:

- Update [docs/local-development.md](local-development.md), [docs/deployment.md](deployment.md), [docs/testing.md](testing.md), [docs/migrations.md](migrations.md), or [docs/documentation.md](documentation.md) when the corresponding workflow changes.
- Follow the shared documentation standard for structure and naming.
