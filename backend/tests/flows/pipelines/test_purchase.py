from mpt_extension_python_template.flows.pipelines.orders.purchase import PurchasePipeline
from mpt_extension_python_template.flows.steps.log_order import LogOrderStep


def test_purchase():
    result = PurchasePipeline().steps

    assert len(result) == 1
    assert isinstance(result[0], LogOrderStep) is True
