## Add repo-specific targets here. Do not modify the shared *.mk files.

RUN = $(DC) run --rm backend
RUN_IT = $(DC) run --rm -it backend
RUN_FRONTEND = $(DC) run --rm frontend
scope ?= all

VALID_SCOPES := backend frontend all
ifeq ($(filter $(scope),$(VALID_SCOPES)),)
$(error Invalid scope '$(scope)'. Use one of: $(VALID_SCOPES))
endif

bash:  ## Open a bash shell
	$(RUN_IT) bash

build:  ## Build frontend assets and backend image. Optional: scope=backend|frontend|all
	@if [ "$(scope)" = "frontend" ] || [ "$(scope)" = "all" ]; then \
		$(RUN_FRONTEND) bash -c "npm ci && npm run build"; \
	fi
	@if [ "$(scope)" = "backend" ] || [ "$(scope)" = "all" ]; then \
		$(DC) build backend; \
		$(RUN) uv sync; \
	fi

check:  ## Check code quality. Optional: scope=backend|frontend|all
	@if [ "$(scope)" = "backend" ] || [ "$(scope)" = "all" ]; then \
		$(RUN) bash -c "uv run ruff format --check . && uv run ruff check . && uv run flake8 . && uv run mypy . && uv lock --check"; \
	fi
	@if [ "$(scope)" = "frontend" ] || [ "$(scope)" = "all" ]; then \
		$(RUN_FRONTEND) bash -c "npm ci && npm run check"; \
	fi

check-all:  ## Run checks, tests, frontend build, and metadata validation. Optional: scope=backend|frontend|all
	$(MAKE) check scope=$(scope)
	$(MAKE) test scope=$(scope)
	@if [ "$(scope)" = "frontend" ] || [ "$(scope)" = "all" ]; then \
		$(RUN_FRONTEND) bash -c "npm ci && npm run build"; \
	fi
	@if [ "$(scope)" = "all" ]; then \
		$(RUN) bash -c 'trap "rm -f meta.yaml meta.generated.yaml" EXIT; while IFS= read -r line || [ -n "$$line" ]; do case "$$line" in ""|\#*) continue;; esac; export "$$line"; done < .env.sample; uv run mpt-ext meta generate && uv run mpt-ext meta validate'; \
	fi

logs: ## Show logs
	@if [ "$(scope)" = "backend" ]; then \
		$(DC) logs -f backend; \
	elif [ "$(scope)" = "frontend" ]; then \
		$(DC) logs -f frontend; \
	elif [ "$(scope)" = "all" ]; then \
		$(DC) logs -f backend frontend; \
	fi

run:  ## Run service in platform integration mode
	@if [ "$(scope)" = "backend" ]; then \
		$(DC) up backend; \
	fi
	@if [ "$(scope)" = "frontend" ]; then \
		$(DC) up frontend; \
	fi
	@if [ "$(scope)" = "all" ]; then \
		$(DC) up -d; \
	fi

run-local:  ## Run backend in --local mode with Jaeger and frontend watch static asset generation
	@if [ "$(scope)" = "backend" ]; then \
		$(DC) -f compose.local.yaml up backend; \
	fi
	@if [ "$(scope)" = "frontend" ]; then \
		$(DC) -f compose.local.yaml up frontend; \
	fi
	@if [ "$(scope)" = "all" ]; then \
		$(DC) -f compose.local.yaml up -d; \
	fi

test:  ## Run tests. Optional: scope=backend|frontend|all
	@if [ "$(scope)" = "backend" ] || [ "$(scope)" = "all" ]; then \
		$(RUN) pytest $(args); \
	fi
	@if [ "$(scope)" = "frontend" ] || [ "$(scope)" = "all" ]; then \
		$(RUN_FRONTEND) bash -c "npm ci && npm test"; \
	fi
