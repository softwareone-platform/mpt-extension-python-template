import os

import pytest

# The routers read these at import time, so a per-test fixture runs too late.
os.environ.setdefault("MPT_PRODUCTS_IDS", "PRD-1111-1111,PRD-1111-1112")
os.environ.setdefault("SDK_EXTENSION_ID", "EXT-1111-1111")


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
