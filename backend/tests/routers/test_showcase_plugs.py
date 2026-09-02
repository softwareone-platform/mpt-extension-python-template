from mpt_extension_python_template.app import ext_app
from mpt_extension_python_template.routers.plugs.common import add_plug, plug_id, plug_name

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


def test_learn_extensions_container_registered():
    result = {plug.id: plug.model_dump() for plug in ext_app.to_meta_config().plugs}

    assert result["learn-extensions-ext-1111-1111"]["socket"] == "portal"
    assert result["learn-extensions-ext-1111-1111"]["href"] is None


def test_portal_showcase_plugs_registered():
    result = {plug.id: plug.model_dump() for plug in ext_app.to_meta_config().plugs}

    assert result["examples-ext-1111-1111"]["socket"] == "portal.learn-extensions-ext-1111-1111"
    assert result["examples-ext-1111-1111"]["href"] == "/static/examples/index.js"
    assert result["guide-ext-1111-1111"]["socket"] == "portal.learn-extensions-ext-1111-1111"
    assert result["guide-ext-1111-1111"]["href"] == "/static/guide/index.js"


def test_add_showcase_plugs_registered():
    declared = map(add_plug, ADD_SOCKETS)
    expected = {plug.id: (plug.socket, plug.href) for plug in declared}
    registered = ext_app.to_meta_config().plugs
    add_plugs = [plug for plug in registered if plug.id.startswith("add-")]

    result = {plug.id: (plug.socket, plug.href) for plug in add_plugs}

    assert result == expected


def test_plug_name_carries_the_extension_id():
    result = plug_name("Plug here")

    assert result == "Plug here (EXT-1111-1111)"


def test_plug_id_carries_the_extension_id():
    result = plug_id("agreements-agreement")

    assert result == "agreements-agreement-ext-1111-1111"


def test_all_plug_names_are_qualified():
    registered = ext_app.to_meta_config().plugs

    result = [plug.name for plug in registered if not plug.name.endswith("(EXT-1111-1111)")]

    assert result == []


def test_socket_plug_ids_are_qualified():
    # Modal plugs are resolved by id from this extension's own frontend, so they
    # are declared without the qualifier and stay out of this guard.
    socket_plugs = [plug for plug in ext_app.to_meta_config().plugs if plug.socket]

    result = [plug.id for plug in socket_plugs if not plug.id.endswith("-ext-1111-1111")]

    assert result == []
