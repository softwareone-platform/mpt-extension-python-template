from mpt_extension_sdk import ExtensionApp

from swo_playground.routers.events.order import orders_router

ext_app = ExtensionApp(prefix="", version="6.0.0")
ext_app.include_router(orders_router)
