from mpt_extension_python_template.flows.pipelines.agreements.complete import (
    CompleteAgreementPipeline,
)
from mpt_extension_python_template.flows.steps.log_agreement import LogAgreementStep


def test_complete_agreement_pipeline_steps():
    result = CompleteAgreementPipeline().steps

    assert len(result) == 1
    assert isinstance(result[0], LogAgreementStep) is True
