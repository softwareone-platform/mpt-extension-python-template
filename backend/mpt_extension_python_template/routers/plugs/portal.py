from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import NavigationPlug, Plug

from mpt_extension_python_template.routers.plugs.common import add_plug, plug_id, plug_name

portal_router = PlugRouter()


@portal_router.register()
def portal_plugs() -> list[Plug | NavigationPlug]:
    """Declare top-level portal plugs: the learn group with its children and the add showcase."""
    learn_extensions = NavigationPlug(
        id=plug_id("learn-extensions"),
        name=plug_name("Learn extensions"),
        description="Guides and examples for extensions development.",
        socket="portal",
    )
    return [
        learn_extensions,
        Plug(
            id=plug_id("examples"),
            name=plug_name("Extension examples"),
            description="Learn more about the extensions UI SDK and its capabilities.",
            socket=learn_extensions.nested_socket,
            href="/static/examples/index.js",
        ),
        Plug(
            id=plug_id("guide"),
            name=plug_name("Extension guide"),
            description="Read about the essential basics of extensions development.",
            socket=learn_extensions.nested_socket,
            href="/static/guide/index.js",
        ),
        add_plug("portal"),
    ]
