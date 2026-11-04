from logging import Logger

import pytest
from mpt_extension_sdk.models import OrderSimple
from mpt_extension_sdk.webhooks import OrderWebhookContext

from mpt_extension_python_template.routers.webhooks.order import (
    AGREEMENT_TYPE_PARAM,
    INVALID_AGREEMENT_TYPE_ERROR,
    INVALID_ORDER_ERROR,
    validate_purchase_order_draft,
)

ORDER_ID = "ORD-1111-1111-1111"


@pytest.fixture
def webhook_context_factory(mocker):
    def factory(agreement_type="New"):
        previous_error = {"id": "OLD001", "message": "Previous answer"}
        ordering = []
        if agreement_type is not None:
            ordering = [
                {
                    "externalId": AGREEMENT_TYPE_PARAM,
                    "value": agreement_type,
                    "error": previous_error,
                }
            ]
        ctx = mocker.create_autospec(OrderWebhookContext, instance=True)
        ctx.logger = mocker.create_autospec(Logger, instance=True)
        ctx.order = OrderSimple.model_validate({
            "id": ORDER_ID,
            "status": "Draft",
            "type": "Purchase",
            "error": previous_error,
            "agreement": {"id": "AGR-1111-1111-1111"},
            "authorization": {"id": "AUT-1111-1111", "name": "US", "currency": "USD"},
            "product": {"id": "PRD-1111-1111", "name": "Product"},
            "parameters": {"ordering": ordering},
        })
        return ctx

    return factory


def test_validation_clears_previous_errors(webhook_context_factory):
    ctx = webhook_context_factory()

    result = validate_purchase_order_draft(ctx)

    agreement_type = result.payload.parameters.get_ordering_parameter(AGREEMENT_TYPE_PARAM)
    assert (result.status_code, result.payload.error, agreement_type.error) == (200, None, None)


def test_validation_accepts_known_type(webhook_context_factory):
    ctx = webhook_context_factory("Migration")

    result = validate_purchase_order_draft(ctx)

    assert (result.status_code, result.payload) == (200, ctx.order.without_errors())


def test_validation_accepts_missing_parameter(webhook_context_factory):
    ctx = webhook_context_factory(None)

    result = validate_purchase_order_draft(ctx)

    assert (result.status_code, result.payload) == (200, ctx.order.without_errors())


def test_validation_rejects_unknown_type(webhook_context_factory):
    ctx = webhook_context_factory("Renewal")

    result = validate_purchase_order_draft(ctx)

    agreement_type = result.payload.parameters.get_ordering_parameter(AGREEMENT_TYPE_PARAM)
    assert (result.status_code, agreement_type.error) == (
        200,
        {"id": INVALID_AGREEMENT_TYPE_ERROR, "message": "Invalid agreement type: Renewal"},
    )


def test_validation_rejects_at_order_level_too(webhook_context_factory):
    ctx = webhook_context_factory("Renewal")

    result = validate_purchase_order_draft(ctx)

    assert result.payload.error == {
        "id": INVALID_ORDER_ERROR,
        "message": "The order has invalid parameters",
    }


def test_validation_marks_the_parameter_required(webhook_context_factory):
    ctx = webhook_context_factory("Renewal")

    result = validate_purchase_order_draft(ctx)

    agreement_type = result.payload.parameters.get_ordering_parameter(AGREEMENT_TYPE_PARAM)
    assert (agreement_type.constraints.hidden, agreement_type.constraints.required) == (False, True)


def test_validation_logs_the_order(webhook_context_factory):
    ctx = webhook_context_factory()

    validate_purchase_order_draft(ctx)  # act

    ctx.logger.info.assert_called_once_with("Validating draft order id=%s", ORDER_ID)
