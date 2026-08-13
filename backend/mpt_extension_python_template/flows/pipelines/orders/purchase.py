from typing import override

from mpt_extension_contrib.order_status import CompleteOrder, StartOrderProcessing
from mpt_extension_sdk.pipeline import BasePipeline, BaseStep

from mpt_extension_python_template.flows.steps.log_order import LogOrderStep


class PurchasePipeline(BasePipeline):
    """Purchase pipeline used by the example event route."""

    @override
    @property
    def steps(self) -> list[BaseStep]:
        return [
            StartOrderProcessing(),
            LogOrderStep(),
            CompleteOrder(),
        ]
