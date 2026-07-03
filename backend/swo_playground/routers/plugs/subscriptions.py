from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from swo_playground.routers.plugs.common import add_plug

subscriptions_router = PlugRouter()


@subscriptions_router.register()
def subscription_plugs() -> list[Plug]:
    """Declare the `add` showcase plugs for the subscription sockets."""
    return [
        add_plug("portal.commerce.subscriptions.actions"),
        add_plug("portal.commerce.subscriptions.line.actions"),
        add_plug("portal.commerce.subscriptions.subscription"),
        add_plug("portal.commerce.subscriptions.subscription.actions"),
    ]
