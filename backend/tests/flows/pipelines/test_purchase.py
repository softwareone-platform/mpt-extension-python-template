from mpt_extension_contrib.order_status import CompleteOrder, StartOrderProcessing
from mpt_extension_sdk.pipeline import OrderContext

from mpt_extension_python_template.flows.pipelines.orders.purchase import PurchasePipeline
from mpt_extension_python_template.flows.steps.log_order import LogOrderStep


def test_purchase():
    result = PurchasePipeline().steps

    assert len(result) == 3
    assert isinstance(result[0], StartOrderProcessing) is True
    assert isinstance(result[1], LogOrderStep) is True
    assert isinstance(result[2], CompleteOrder) is True


async def test_purchase_execute_runs_steps_in_order(mocker):
    manager = mocker.Mock()
    manager.attach_mock(mocker.patch.object(StartOrderProcessing, "run"), "start_processing")
    manager.attach_mock(mocker.patch.object(LogOrderStep, "run"), "log_order")
    manager.attach_mock(mocker.patch.object(CompleteOrder, "run"), "complete_order")
    ctx = mocker.Mock(
        spec=OrderContext,
        logger=mocker.Mock(),
        meta=mocker.Mock(event_id="EVT-1", task_id="TSK-1"),
    )

    await PurchasePipeline().execute(ctx)  # act

    assert [name for name, _, _ in manager.mock_calls] == [
        "start_processing",
        "log_order",
        "complete_order",
    ]
    manager.start_processing.assert_awaited_once_with(ctx)
    manager.log_order.assert_awaited_once_with(ctx)
    manager.complete_order.assert_awaited_once_with(ctx)
