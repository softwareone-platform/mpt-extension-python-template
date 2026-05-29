import logging

from mpt_extension_sdk.api.models.events import Event
from mpt_extension_sdk.routing import EventRouter

from swo_playground.context.agreement import EventAgreementContext
from swo_playground.flows.pipelines.agreements.complete import CompleteAgreementPipeline
from swo_playground.settings import get_extension_settings

logger = logging.getLogger(__name__)

agreements_router = EventRouter(prefix="/events/v2/agreements")


@agreements_router.event(
    path="/complete",
    name="agreement-complete",
    event="platform.commerce.agreement.status_changed",
    condition=f"in(product.id,{get_extension_settings().product_ids}),eq(status,Active)",
    context_adapter_type=EventAgreementContext,
)
async def process_agreement_complete(event: Event, ctx: EventAgreementContext) -> None:
    """Process agreement complete events."""
    logger.info("Processing agreement event id=%s object_id=%s", event.id, event.object.id)
    await CompleteAgreementPipeline().execute(ctx)
