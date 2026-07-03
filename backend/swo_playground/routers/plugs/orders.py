from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from swo_playground.routers.plugs.common import add_plug

orders_router = PlugRouter()


@orders_router.register()
def order_plugs() -> list[Plug]:
    """Declare the `add` showcase plugs for the order sockets."""
    return [
        add_plug("portal.commerce.orders.actions"),
        add_plug("portal.commerce.orders.line.actions"),
        add_plug("portal.commerce.orders.order"),
        add_plug("portal.commerce.orders.order.actions"),
    ]
