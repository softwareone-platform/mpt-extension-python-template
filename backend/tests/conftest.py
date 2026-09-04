import os

import pytest

# The event routers read the product ids at import time, so a fixture runs
# too late. Assigned, not setdefault, so a local .env cannot change these.
os.environ["MPT_PRODUCTS_IDS"] = "PRD-1111-1111,PRD-1111-1112"
os.environ["SDK_EXTENSION_ID"] = "EXT-1111-1111"


@pytest.fixture
def agreement_payload():
    return {
        "id": "AGR-1234-5678",
        "name": "Sample Agreement",
        "status": "Active",
        "product": {"id": "PRD-1111-1111", "name": "Sample Product"},
        "client": {"id": "ACC-1111-1111", "name": "Client"},
        "seller": {"id": "ACC-2222-2222", "name": "Seller"},
        "buyer": {"id": "ACC-3333-3333", "name": "Buyer"},
        "lines": [{"id": "ALI-1"}, {"id": "ALI-2"}],
        "subscriptions": [{"id": "SUB-1"}],
        "assets": [],
    }
