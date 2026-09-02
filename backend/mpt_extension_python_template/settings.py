import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Self, override

from mpt_extension_sdk.settings.extension import BaseExtensionSettings


@dataclass(frozen=True)
class ExtensionSettings(BaseExtensionSettings):
    """Extension settings."""

    product_ids: tuple[str, ...]
    extension_id: str

    @override
    @property
    def required_env_vars(self) -> list[tuple[Any, ...]]:
        return [
            (self.product_ids, "Product ids is required (MPT_PRODUCTS_IDS)"),
            (self.extension_id, "Extension id is required (SDK_EXTENSION_ID)"),
        ]

    @override
    @classmethod
    def load(cls) -> Self:
        return cls(
            product_ids=tuple(cls.list_env("MPT_PRODUCTS_IDS")),
            extension_id=os.getenv("SDK_EXTENSION_ID", ""),
        )


@lru_cache(maxsize=1)
def get_extension_settings() -> ExtensionSettings:
    """Return a cached `ExtensionSettings` instance."""
    return ExtensionSettings.load()
