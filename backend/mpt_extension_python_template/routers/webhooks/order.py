from mpt_extension_sdk.routing import WebhookRouter
from mpt_extension_sdk.webhooks import OrderWebhookContext, WebhookResponse, WebhookType

from mpt_extension_python_template.settings import get_extension_settings

AGREEMENT_TYPE_PARAM = "agreementType"
INVALID_AGREEMENT_TYPE_ERROR = "TPL001"
INVALID_ORDER_ERROR = "TPL002"
VALID_AGREEMENT_TYPES = ("New", "Migration")

orders_router = WebhookRouter(prefix="/webhooks/v1/orders")


@orders_router.webhook(
    "/validate-purchase-draft",
    type=WebhookType.VALIDATE_PURCHASE_ORDER_DRAFT,
    description="Validate purchase orders in Draft status.",
    criteria=[{"product.id": product_id} for product_id in get_extension_settings().product_ids],
)
def validate_purchase_order_draft(ctx: OrderWebhookContext) -> WebhookResponse:
    """Validate the `agreementType` ordering parameter of a draft purchase order.

    The platform waits for this answer while the user is in the order wizard,
    so a real validation must stay fast. The errors of the previous answer are
    cleared first, otherwise the wizard keeps showing them after the user fixes
    the value. A rejection is still a `200`: the order comes back carrying the
    error, and the wizard shows it on the offending parameter.

    A rejection reports at both levels, as the SDK webhooks guide shows:
    `with_ordering_error(...)` puts the error on the parameter the user has to
    fix, and `with_error(...)` puts a summary on the order itself. Use the
    parameter level for a bad value and the order level for a problem with the
    order as a whole; this example chains both so the template shows each one.
    """
    ctx.logger.info("Validating draft order id=%s", ctx.order.id)
    order = ctx.order.without_errors()
    agreement_type = order.parameters.get_ordering_value(AGREEMENT_TYPE_PARAM)
    if agreement_type is None or agreement_type in VALID_AGREEMENT_TYPES:
        return WebhookResponse.ok(order)

    order_with_errors = order.with_error({
        "id": INVALID_ORDER_ERROR,
        "message": "The order has invalid parameters",
    }).with_ordering_error(
        AGREEMENT_TYPE_PARAM,
        {
            "id": INVALID_AGREEMENT_TYPE_ERROR,
            "message": f"Invalid agreement type: {agreement_type}",
        },
    )
    return WebhookResponse.ok(order_with_errors)
