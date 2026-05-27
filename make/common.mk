DC = docker compose -f compose.yaml


down:  ## Stop and remove containers
	$(DC) down

format:  ## Format backend code
	$(RUN) bash -c "uv run ruff check --select I --fix . && uv run ruff format ."

uv-add: ## Add a production dependency (pkg=<package_name>)
	$(call require,pkg)
	$(RUN) bash -c "uv add $(pkg)"
	$(MAKE) build scope=backend

uv-add-dev: ## Add a dev dependency (pkg=<package_name>)
	$(call require,pkg)
	$(RUN) bash -c "uv add --dev $(pkg)"
	$(MAKE) build scope=backend

uv-upgrade: ## Upgrade all packages or a specific package (use pkg="package_name" to target one)
	$(RUN) bash -c "uv lock $(if $(pkg),--upgrade-package $(pkg),--upgrade) && uv sync"
	$(MAKE) build scope=backend
