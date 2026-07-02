from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from swo_playground.routers.plugs.common import add_plug

portal_router = PlugRouter()


@portal_router.register()
def portal_plugs() -> list[Plug]:
    """Declare top-level portal plugs: the examples app, the guide and the add showcase."""
    return [
        Plug(
            id="examples",
            name="Extension examples",
            description="Learn more about the extensions UI SDK and its capabilities.",
            socket="portal",
            href="/static/examples/index.js",
        ),
        Plug(
            id="guide",
            name="Extension guide",
            description="Read about the essential basics of extensions development.",
            socket="portal",
            href="/static/guide/index.js",
        ),
        add_plug("portal"),
    ]
