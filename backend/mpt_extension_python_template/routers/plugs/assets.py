from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from mpt_extension_python_template.routers.plugs.common import add_plug

assets_router = PlugRouter()


@assets_router.register()
def asset_plugs() -> list[Plug]:
    """Declare the `add` showcase plugs for the asset sockets."""
    return [
        add_plug("portal.commerce.assets.actions"),
        add_plug("portal.commerce.assets.line.actions"),
        add_plug("portal.commerce.assets.asset"),
        add_plug("portal.commerce.assets.asset.actions"),
    ]
