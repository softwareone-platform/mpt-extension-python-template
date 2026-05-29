from mpt_extension_sdk.routing import (
    APIRouteDefinition,
    EventRouteDefinition,
    PlugRouteDefinition,
)

from swo_playground.app import ext_app


def test_app_registers_event_routes():
    result = {route.path: route for route in ext_app.routes}

    assert isinstance(result["/events/v2/orders/purchase"], EventRouteDefinition)
    assert any(isinstance(route, PlugRouteDefinition) for route in result.values())


def test_app_registers_agreement_event_route():
    result = {route.path: route for route in ext_app.routes}

    assert isinstance(result["/events/v2/agreements/complete"], EventRouteDefinition)


def test_app_registers_sync_route():
    result = {route.path: route for route in ext_app.routes}

    assert isinstance(result["/api/v2/agreements/{agreement_id}/sync"], APIRouteDefinition)


def test_app_registers_get_route():
    result = {route.path: route for route in ext_app.routes}

    assert isinstance(result["/api/v2/agreements/{agreement_id}"], APIRouteDefinition)


def test_app_registers_list_route():
    result = {route.path: route for route in ext_app.routes}

    assert isinstance(result["/api/v2/agreements"], APIRouteDefinition)


def test_app_generates_agreement_plug_metadata():
    result = ext_app.to_meta_config()

    assert result.plugs is not None
    plugs_by_id = {plug.id: plug.model_dump() for plug in result.plugs}
    assert plugs_by_id["agreements-agreement"] == {
        "id": "agreements-agreement",
        "name": "Extension playground",
        "description": "Show an extension playground tab with some actions.",
        "icon": None,
        "socket": "portal.commerce.agreements.agreement",
        "condition": None,
        "href": "/static/agreements-agreement/index.js",
    }
    assert plugs_by_id["agreements-line-actions"] == {
        "id": "agreements-line-actions",
        "name": "Extension playground line",
        "description": "Show the current agreement details in a modal.",
        "icon": None,
        "socket": "portal.commerce.agreements.line.actions",
        "condition": None,
        "href": "/static/agreements-line-actions/index.js",
    }
    assert plugs_by_id["agreements-agreement-actions"] == {
        "id": "agreements-agreement-actions",
        "name": "Extension playground wizard",
        "description": "Review the current agreement details in an extension playground wizard.",
        "icon": None,
        "socket": "portal.commerce.agreements.agreement.actions",
        "condition": None,
        "href": "/static/agreements-agreement-actions/index.js",
    }
