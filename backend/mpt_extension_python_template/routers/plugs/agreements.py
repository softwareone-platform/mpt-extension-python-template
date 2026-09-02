from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from mpt_extension_python_template.routers.plugs.common import add_plug, plug_id, plug_name

agreements_router = PlugRouter()


@agreements_router.register()
def agreement_plugs() -> list[Plug]:
    """Declare agreement UI plugs served from the static asset bridge."""
    return [
        Plug(
            id=plug_id("agreements-agreement"),
            name=plug_name("Extension example"),
            description="Show an extension example tab with some actions.",
            socket="portal.commerce.agreements.agreement",
            href="/static/agreements-agreement/index.js",
        ),
        add_plug("portal.commerce.agreements.actions"),
        add_plug("portal.commerce.agreements.line.actions"),
        add_plug("portal.commerce.agreements.agreement.actions"),
    ]
