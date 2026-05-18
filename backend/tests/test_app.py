from mpt_extension_sdk.routing import APIRouteDefinition, EventRouteDefinition

from swo_playground.app import ext_app


def test_app_registers_event_routes():
    result = ext_app.routes  # act

    assert any(isinstance(route, EventRouteDefinition) for route in result)


def test_app_registers_sync_route():
    result = {route.path: route for route in ext_app.routes}  # act

    assert isinstance(result["/api/v2/agreements/{agreement_id}/sync"], APIRouteDefinition)
