# Migrations

Shared migration knowledge lives in:

- [knowledge/migrations.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/migrations.md)
- [knowledge/make-targets.md](https://github.com/softwareone-platform/mpt-extension-skills/blob/main/knowledge/make-targets.md)

This file documents repository-specific migration behavior only.

## Migration Files

Repository migration scripts live in [`backend/migrations/`](../backend/migrations/).

This repository uses the standard migration workflow and standard make-based command wiring used across related repositories. Use the shared migration knowledge above as the primary reference.

## Repository-Specific Constraint

The current migrations are fake/example migrations used to demonstrate the repository shape:

- `20260527134121_fake_data_migration.py`
- `20260527134133_fake_schema_migration.py`

Replace or remove these examples when the repository gains real data or schema migrations.

## When To Update This Document

Update this file when the repository changes:

- migration file locations
- migration command entry points
- required execution order
- rollout or safety constraints specific to this repository
