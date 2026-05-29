from typing import Self, override

from mpt_extension_sdk.context import ContextAdapter
from mpt_extension_sdk.pipeline import AgreementContext, EventBaseContext


class EventAgreementContext(AgreementContext, ContextAdapter):
    """Mock context as an example."""

    @property
    def mock_field(self) -> str:
        """Mock field as an example."""
        return "mock_field"

    @override
    @classmethod
    def from_context(cls, ctx: EventBaseContext) -> Self:
        """Example of how to override a context from an event context."""
        return cls(**ctx.__dict__)
