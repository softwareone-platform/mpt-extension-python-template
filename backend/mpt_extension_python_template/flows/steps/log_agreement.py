from typing import override

from mpt_extension_sdk.pipeline import BaseStep

from mpt_extension_python_template.context.agreement import EventAgreementContext


class LogAgreementStep(BaseStep):
    """Log the agreement selected by the runtime context."""

    @override
    async def process(self, ctx: EventAgreementContext) -> None:
        """Log the agreement id from the runtime context."""
        ctx.logger.info("Custom agreement context mock_field: %s", ctx.mock_field)
        ctx.logger.info("%s - Example agreement pipeline executed.", ctx.agreement_id)
