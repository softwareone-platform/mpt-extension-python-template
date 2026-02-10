[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=softwareone-platform_swo-extension-playground&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=softwareone-platform_swo-extension-playground)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=softwareone-platform_swo-extension-playground&metric=coverage)](https://sonarcloud.io/summary/new_code?id=softwareone-platform_swo-extension-playground)

[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)

# SoftwareONE Extension playground

Playground Extension with the SoftwareONE Marketplace


## Getting started

### Prerequisites

- Docker and Docker Compose plugin (`docker compose` CLI)
- `make`
- [CodeRabbit CLI](https://www.coderabbit.ai/cli) (optional. Used for running review check locally)


### Make targets overview

Common development workflows are wrapped in the `Makefile`. Run `make help` to see the list of available commands.

### How the Makefile works

The project uses a modular Makefile structure that organizes commands into logical groups:

- **Main Makefile** (`Makefile`): Entry point that automatically includes all `.mk` files from the `make/` directory
- **Modular includes** (`make/*.mk`): Commands are organized by category:
  - `common.mk` - Core development commands (build, test, format, etc.)
  - `repo.mk` - Repository management and dependency commands
  - `migrations.mk` - Database migration commands (Only available in extension repositories)
  - `external_tools.mk` - Integration with external tools


You can extend the Makefile with your own custom commands creating a `local.mk` file inside make folder. This file is
automatically ignored by git, so your personal commands won't affect other developers or appear in version control.


### Setup

Follow these steps to set up the development environment:

#### 1. Clone the repository

```bash
git clone <repository-url>
```
```bash
cd swo-extension-playground
```

#### 2. Create environment configuration

Copy the sample environment file and update it with your values:

```bash
cp .env.sample .env
```

Edit the `.env` file with your actual configuration values. See the [Configuration](#configuration) section for details on available variables.

#### 3. Build the Docker images

Build the development environment:

```bash
make build
```

This will create the Docker images with all required dependencies and the virtualenv.

> **Note on local development without Docker:**
> Docker is the primary development environment, the default setup and Makefile commands are designed to work only with Docker.
> `.venv` is used as the default virtualenv, and the project folder is mounted as a volume in docker-compose.
> If you want to run the project locally (without Docker), use a different virtualenv name to avoid confusion
> (e.g., `.venv_local`, `env/`, `venv`, `ENV/` - it will be ignored from docker and gitignore)
> You can also set the `UV_PROJECT_ENVIRONMENT` in your .env file to point `uv` to your local environment.

#### 4. Verify the setup

Run the test suite to ensure everything is configured correctly:

```bash
make test
```

You're now ready to start developing! See [Running the service](#running-the-service) for next steps.


## Running the service

Before running, ensure your `.env` file is populated with real endpoints and tokens.

Start the app:

```bash
make run
```

The service will be available at `http://localhost:8080`.

Example `.env` snippet for real services:

```env
EXT_WEBHOOKS_SECRETS={"PRD-1111-1111": "<webhook-secret-for-product>", "PRD-2222-2222": "<webhook-secret-for-product>"}
MPT_API_BASE_URL=https://api.s1.show
MPT_API_TOKEN=c0fdafd7-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MPT_INITIALIZER="swo_playground.initializer.initialize"
MPT_KEY_VAULT_NAME=""
MPT_ORDERS_API_POLLING_INTERVAL_SECS=120
MPT_PORTAL_BASE_URL=https://portal.s1.show
MPT_PRODUCTS_IDS=PRD-1111-1111,PRD-2222-2222
```

`MPT_PRODUCTS_IDS` is a comma-separated list of SWO Marketplace Product identifiers.
For each product ID in the `MPT_PRODUCTS_IDS` list, define the corresponding entry in the `EXT_WEBHOOKS_SECRETS` JSON using the product ID as the key.


## Developer utilities

Useful helper targets during development:

```bash
make bash      # open a bash shell in the app container
make check     # run ruff, flake8, and lockfile checks
make check-all # run checks and tests
make format    # auto-format code and imports
make review    # check the code in the cli by running CodeRabbit
make shell     # open a Django shell in the app container
```

### Migration commands

The mpt-tool provides commands for managing database migrations:

```bash
make migrate-check                           # check migration status
make migrate-data                            # run data migrations
make migrate-schema                          # run schema migrations
make migrate-list                            # list available migrations
make migrate-new-data name=migration_id      # create a new data migration
make migrate-new-schema name=migration_id    # create a new schema migration
```


# Configuration

The following environment variables are typically set in `.env`. Docker Compose reads them when using the Make targets described above.

## Application

| Environment Variable                   | Default                 | Example                                   | Description                                                                               |
|----------------------------------------|-------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------|
| `EXT_WEBHOOKS_SECRETS`                 | -                       | {"PRD-1111-1111": "123qweasd3432234"}     | Webhook secret of the Draft validation Webhook in SoftwareONE Marketplace for the product |
| `MPT_API_BASE_URL`                     | `http://localhost:8000` | `https://api.platform.softwareone.com`    | SoftwareONE Marketplace API URL                                                           |
| `MPT_API_TOKEN`                        | -                       | eyJhbGciOiJSUzI1N...                      | SoftwareONE Marketplace API Token                                                         |
| `MPT_INITIALIZER`                      | -                       | swo_playground.initializer.initialize     | Initializer function                                                                      |
| `MPT_KEY_VAULT_NAME`                   | mpt-key-vault           | swo-playground-kv                         | Key Vault name                                                                            |
| `MPT_PRODUCTS_IDS`                     | PRD-1111-1111           | PRD-1234-1234,PRD-4321-4321               | Comma-separated list of SoftwareONE Marketplace Product ID                                |
| `MPT_PORTAL_BASE_URL`                  | `http://localhost:8000` | `https://portal.softwareone.com`          | SoftwareONE Marketplace Portal URL                                                        |
| `MPT_TOOL_STORAGE_TYPE`                | `local`                 | `airtable`                                | Storage type for MPT tools (local or airtable)                                            |
| `MPT_TOOL_STORAGE_AIRTABLE_API_KEY`    | -                       | patXXXXXXXXXXXXXX                         | Airtable API key for MPT tool storage (required when storage type is airtable)            |
| `MPT_TOOL_STORAGE_AIRTABLE_BASE_ID`    | -                       | appXXXXXXXXXXXXXX                         | Airtable base ID for MPT tool storage (required when storage type is airtable)            |
| `MPT_TOOL_STORAGE_AIRTABLE_TABLE_NAME` | -                       | MigrationTracking                         | Airtable table name for MPT tool storage (required when storage type is airtable)         |


### Azure AppInsights

| Environment Variable                    | Default                            | Example                                                                                                                                                                                               | Description                                                                                                   |
|-----------------------------------------|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | -                                  | `InstrumentationKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;IngestionEndpoint=https://westeurope-1.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/` | Azure Application Insights connection string                                                                  |
| `OTEL_SERVICE_NAME`                     | -                                  | Swo.Extensions.Playground                                                                                                                                                                             | Service name that is visible in the AppInsights logs                                                          |

### Other

| Environment Variable                   | Default | Example | Description                                                          |
|----------------------------------------|---------|---------|----------------------------------------------------------------------|
| `MPT_ORDERS_API_POLLING_INTERVAL_SECS` | 120     | 60      | Orders polling interval from the Software Marketplace API in seconds |
