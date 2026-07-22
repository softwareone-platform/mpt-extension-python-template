from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from mpt_extension_python_template.routers.plugs.common import add_plug

accounts_router = PlugRouter()


@accounts_router.register()
def account_plugs() -> list[Plug]:
    """Declare the `add` showcase plugs for the accounts sockets."""
    return [
        add_plug("portal.accounts.sellers.seller.actions"),
    ]
