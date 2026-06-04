import asyncio

from mpt_extension_sdk.api.models.events import Event
from mpt_extension_sdk.models import Agreement, Order
from mpt_extension_sdk.pipeline import OrderContext

from swo_playground.context.agreement import EventAgreementContext
from swo_playground.routers.events.agreement import process_agreement_complete
from swo_playground.routers.events.order import process_order_purchase


def test_purchase_executes_pipeline(mocker):
    order = mocker.Mock(id="ORD-1", spec=Order)
    event = mocker.Mock(spec=Event, id="EVT-1", object=order)
    context = mocker.Mock(spec=OrderContext)
    pipeline = mocker.patch("swo_playground.routers.events.order.PurchasePipeline", autospec=True)

    asyncio.run(process_order_purchase(event, context))  # act

    pipeline.return_value.execute.assert_awaited_once_with(context)


def test_agreement_complete_executes_pipeline(mocker):
    agreement = mocker.Mock(id="AGR-1", spec=Agreement)
    event = mocker.Mock(spec=Event, id="EVT-1", object=agreement)
    ctx = mocker.Mock(spec=EventAgreementContext)
    pipeline = mocker.patch(
        "swo_playground.routers.events.agreement.CompleteAgreementPipeline", autospec=True
    )

    asyncio.run(process_agreement_complete(event, ctx))  # act

    pipeline.return_value.execute.assert_awaited_once_with(ctx)
