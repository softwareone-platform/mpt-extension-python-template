FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS base

WORKDIR /extension

ENV UV_LINK_MODE=copy
ENV PATH=/extension/.venv/bin:$PATH

FROM base AS build

COPY . .

RUN uv sync --frozen --no-cache --no-dev

FROM build AS dev

RUN uv sync --frozen --no-cache --dev

CMD ["swoext", "run"]

FROM build AS prod

RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /extension

USER appuser

RUN rm -rf tests/

CMD ["swoext", "run", "--no-color"]
