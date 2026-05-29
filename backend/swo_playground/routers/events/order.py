import logging

from mpt_extension_sdk.api.models.events import Event
from mpt_extension_sdk.pipeline import OrderContext
from mpt_extension_sdk.routing import EventRouter

from swo_playground.flows.pipelines.orders.purchase import PurchasePipeline
from swo_playground.settings import get_extension_settings

logger = logging.getLogger(__name__)

orders_router = EventRouter(prefix="/events/v2/orders")


@orders_router.task(
    path="/purchase",
    name="orders-purchase",
    event="platform.commerce.order.status_changed",
    condition=f"in(product.id,{get_extension_settings().product_ids})",
)
async def process_order_purchase(event: Event, context: OrderContext) -> None:
    """Process order purchase events."""
    logger.info("Processing purchase event id=%s object_id=%s", event.id, event.object.id)
    await PurchasePipeline().execute(context)
