from logging import Logger

from swo_playground.context.agreement import EventAgreementContext
from swo_playground.flows.steps.log_agreement import LogAgreementStep


async def test_log_agreement_step(mocker):
    logger = mocker.Mock(spec=Logger)
    ctx = mocker.Mock(spec=EventAgreementContext, agreement_id="AGR-1", logger=logger)
    ctx.mock_field = "mock_field"
    step = LogAgreementStep()

    await step.process(ctx)  # act

    logger.info.assert_any_call("Custom agreement context mock_field: %s", "mock_field")
    logger.info.assert_any_call("%s - Playground agreement pipeline executed.", "AGR-1")
    assert logger.info.call_count == 2
