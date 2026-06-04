from swo_playground.flows.pipelines.orders.purchase import PurchasePipeline
from swo_playground.flows.steps.log_order import LogOrderStep


def test_purchase():
    result = PurchasePipeline().steps

    assert len(result) == 1
    assert isinstance(result[0], LogOrderStep) is True
