from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import NavigationPlug, Plug

from swo_playground.routers.plugs.common import add_plug

portal_router = PlugRouter()


@portal_router.register()
def portal_plugs() -> list[Plug | NavigationPlug]:
    """Declare top-level portal plugs: the learn group with its children and the add showcase."""
    learn_extensions = NavigationPlug(
        id="learn-extensions",
        name="Learn extensions",
        description="Guides and examples for extensions development.",
        socket="portal",
    )
    return [
        learn_extensions,
        Plug(
            id="examples",
            name="Extension examples",
            description="Learn more about the extensions UI SDK and its capabilities.",
            socket=learn_extensions.nested_socket,
            href="/static/examples/index.js",
        ),
        Plug(
            id="guide",
            name="Extension guide",
            description="Read about the essential basics of extensions development.",
            socket=learn_extensions.nested_socket,
            href="/static/guide/index.js",
        ),
        add_plug("portal"),
    ]
