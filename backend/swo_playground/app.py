from mpt_extension_sdk import ExtensionApp

from swo_playground.routers.api.agreement import agreements_router as api_agreements_router
from swo_playground.routers.events.agreement import agreements_router as events_agreements_router
from swo_playground.routers.events.order import orders_router as events_orders_router
from swo_playground.routers.plugs.agreements import agreements_router as plug_agreements_router

ext_app = ExtensionApp(prefix="", version="6.0.0")
ext_app.include_router(events_orders_router)
ext_app.include_router(events_agreements_router)
ext_app.include_router(api_agreements_router)
ext_app.include_router(plug_agreements_router)
