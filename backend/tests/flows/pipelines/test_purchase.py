from mpt_extension_contrib.order_status import CompleteOrder, StartOrderProcessing

from mpt_extension_python_template.flows.pipelines.orders.purchase import PurchasePipeline
from mpt_extension_python_template.flows.steps.log_order import LogOrderStep


def test_purchase():
    result = PurchasePipeline().steps

    assert len(result) == 3
    assert isinstance(result[0], StartOrderProcessing) is True
    assert isinstance(result[1], LogOrderStep) is True
    assert isinstance(result[2], CompleteOrder) is True
