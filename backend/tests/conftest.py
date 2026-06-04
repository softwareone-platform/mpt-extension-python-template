import os

import pytest

# Set required env vars before any test module is imported. Event routers
# under `swo_playground.routers.events.*` interpolate
# `get_extension_settings().product_ids` inside the decorator's `condition`
# f-string, which Python evaluates at module import time. That call (cached
# afterwards by `@lru_cache`) reads `MPT_PRODUCTS_IDS` from the environment,
# so the variable must exist before collection — per-test fixtures run too
# late.
os.environ.setdefault("MPT_PRODUCTS_IDS", "PRD-1111-1111,PRD-1111-1112")


@pytest.fixture
def agreement_payload():
    return {
        "id": "AGR-1234-5678",
        "name": "Playground Agreement",
        "status": "Active",
        "product": {"id": "PRD-1111-1111", "name": "Playground Product"},
        "client": {"id": "ACC-1111-1111", "name": "Client"},
        "seller": {"id": "ACC-2222-2222", "name": "Seller"},
        "buyer": {"id": "ACC-3333-3333", "name": "Buyer"},
        "lines": [{"id": "ALI-1"}, {"id": "ALI-2"}],
        "subscriptions": [{"id": "SUB-1"}],
        "assets": [],
    }
