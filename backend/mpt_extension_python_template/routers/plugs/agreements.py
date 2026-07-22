from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import Plug

from mpt_extension_python_template.routers.plugs.common import add_plug

agreements_router = PlugRouter()


@agreements_router.register()
def agreement_plugs() -> list[Plug]:
    """Declare agreement UI plugs served from the static asset bridge."""
    return [
        Plug(
            id="agreements-agreement",
            name="Extension example",
            description="Show an extension example tab with some actions.",
            socket="portal.commerce.agreements.agreement",
            href="/static/agreements-agreement/index.js",
        ),
        Plug(
            id="agreements-line-actions",
            name="Extension example line",
            description="Show the current agreement details in a modal.",
            socket="portal.commerce.agreements.line.actions",
            href="/static/agreements-line-actions/index.js",
        ),
        Plug(
            id="agreements-agreement-actions",
            name="Extension example wizard",
            description="Review the current agreement details in an extension example wizard.",
            socket="portal.commerce.agreements.agreement.actions",
            href="/static/agreements-agreement-actions/index.js",
        ),
        add_plug("portal.commerce.agreements.actions"),
    ]
