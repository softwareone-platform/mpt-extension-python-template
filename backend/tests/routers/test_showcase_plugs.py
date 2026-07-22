from mpt_extension_python_template.app import ext_app
from mpt_extension_python_template.routers.plugs.common import add_plug

# Sockets served by the per-socket `add` showcase, registered across the
# per-entity plug routers (portal / orders / subscriptions / agreements /
# assets / accounts).
ADD_SOCKETS = (
    "portal",
    "portal.commerce.orders.actions",
    "portal.commerce.orders.line.actions",
    "portal.commerce.orders.order",
    "portal.commerce.orders.order.actions",
    "portal.commerce.subscriptions.actions",
    "portal.commerce.subscriptions.line.actions",
    "portal.commerce.subscriptions.subscription",
    "portal.commerce.subscriptions.subscription.actions",
    "portal.commerce.agreements.actions",
    "portal.commerce.agreements.line.actions",
    "portal.commerce.agreements.agreement.actions",
    "portal.commerce.assets.actions",
    "portal.commerce.assets.line.actions",
    "portal.commerce.assets.asset",
    "portal.commerce.assets.asset.actions",
    "portal.accounts.sellers.seller.actions",
)


def _socket_href(plug) -> tuple[str, str]:
    return plug.socket, plug.href


def test_learn_extensions_container_registered():
    result = {plug.id: plug.model_dump() for plug in ext_app.to_meta_config().plugs}

    assert result["learn-extensions"]["socket"] == "portal"
    assert result["learn-extensions"]["href"] is None


def test_portal_showcase_plugs_registered():
    result = {plug.id: plug.model_dump() for plug in ext_app.to_meta_config().plugs}

    assert result["examples"]["socket"] == "portal.learn-extensions"
    assert result["examples"]["href"] == "/static/examples/index.js"
    assert result["guide"]["socket"] == "portal.learn-extensions"
    assert result["guide"]["href"] == "/static/guide/index.js"


def test_add_showcase_plugs_registered():
    expected = {plug.id: _socket_href(plug) for plug in map(add_plug, ADD_SOCKETS)}
    registered = ext_app.to_meta_config().plugs
    add_plugs = [plug for plug in registered if plug.id.startswith("add-")]

    result = {plug.id: _socket_href(plug) for plug in add_plugs}

    assert result == expected
