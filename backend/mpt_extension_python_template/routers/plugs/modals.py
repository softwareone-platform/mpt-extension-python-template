from mpt_extension_sdk.routing import PlugRouter
from mpt_extension_sdk.routing.plugs import ModalPlug

modals_router = PlugRouter()


@modals_router.register()
def modal_plugs() -> list[ModalPlug]:
    """Declare socketless modal plugs opened by id from the examples Modals view."""
    return [
        ModalPlug(
            id="dialog",
            name="Extension example dialog",
            description="A dialog opened by id that returns a result to the opener.",
            href="/static/dialog/index.js",
        ),
        ModalPlug(
            id="wizard",
            name="Extension example wizard",
            description="A multi-step wizard opened by id that returns a result to the opener.",
            href="/static/wizard/index.js",
        ),
    ]
