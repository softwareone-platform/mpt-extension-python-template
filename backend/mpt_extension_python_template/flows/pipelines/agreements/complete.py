from typing import override

from mpt_extension_sdk.pipeline import BasePipeline, BaseStep

from mpt_extension_python_template.flows.steps.log_agreement import LogAgreementStep


class CompleteAgreementPipeline(BasePipeline):
    """Complete agreement pipeline used by the example event route."""

    @override
    @property
    def steps(self) -> list[BaseStep]:
        return [LogAgreementStep()]
