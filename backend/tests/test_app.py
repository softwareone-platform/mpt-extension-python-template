from swo_playground.app import ext_app


def test_app_has_no_routes():
    result = ext_app.routes

    assert result == []
