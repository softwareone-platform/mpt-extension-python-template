from mpt_extension_sdk.routing import EventRouteDefinition

from swo_playground.app import ext_app


def test_app_registers_event_routes():
    result = ext_app.routes

    assert any(isinstance(route, EventRouteDefinition) for route in result)
