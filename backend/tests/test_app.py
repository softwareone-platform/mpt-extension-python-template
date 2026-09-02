from mpt_extension_sdk.routing import (
    APIRouteDefinition,
    EventRouteDefinition,
    PlugRouteDefinition,
    ScheduleRouteDefinition,
)

from mpt_extension_python_template.app import ext_app


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


def test_app_registers_agreement_schedule_route():
    result = {route.path: route for route in ext_app.routes}

    assert isinstance(result["/schedules/v1/agreements/sync"], ScheduleRouteDefinition)


def test_app_generates_schedule_metadata():
    result = ext_app.to_meta_config()

    assert result.schedules is not None
    schedules_by_id = {schedule.id: schedule.model_dump() for schedule in result.schedules}
    assert schedules_by_id["agreements.sync"] == {
        "id": "agreements.sync",
        "name": "agreements-sync-schedule",
        "description": "Read the agreements owned by the extension vendor and report progress.",
        "cron": "*/15 * * * *",
        "path": "/schedules/v1/agreements/sync",
    }


def test_app_generates_agreement_plug_metadata():
    result = ext_app.to_meta_config()

    assert result.plugs is not None
    plugs_by_id = {plug.id: plug.model_dump() for plug in result.plugs}
    assert plugs_by_id["agreements-agreement-ext-1111-1111"] == {
        "id": "agreements-agreement-ext-1111-1111",
        "name": "Extension example (EXT-1111-1111)",
        "description": "Show an extension example tab with some actions.",
        "icon": None,
        "socket": "portal.commerce.agreements.agreement",
        "condition": None,
        "href": "/static/agreements-agreement/index.js",
    }


def test_app_generates_modal_plug_metadata():
    result = ext_app.to_meta_config()

    assert result.plugs is not None
    plugs_by_id = {plug.id: plug.model_dump() for plug in result.plugs}
    assert plugs_by_id["dialog"] == {
        "id": "dialog",
        "name": "Extension example dialog (EXT-1111-1111)",
        "description": "A dialog opened by id that returns a result to the opener.",
        "icon": None,
        "socket": None,
        "condition": None,
        "href": "/static/dialog/index.js",
    }
    assert plugs_by_id["wizard"] == {
        "id": "wizard",
        "name": "Extension example wizard (EXT-1111-1111)",
        "description": "A multi-step wizard opened by id that returns a result to the opener.",
        "icon": None,
        "socket": None,
        "condition": None,
        "href": "/static/wizard/index.js",
    }
