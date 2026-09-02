from mpt_extension_sdk.routing.plugs import Plug

from mpt_extension_python_template.settings import get_extension_settings


def plug_name(name: str) -> str:
    """Suffix a plug name with the extension id, since the Portal renders it alone."""
    extension_id = get_extension_settings().extension_id
    return f"{name} ({extension_id})"


def plug_id(identifier: str) -> str:
    """Suffix a plug id with the extension id, since the Portal aggregates ids."""
    extension_id = get_extension_settings().extension_id
    return f"{identifier}-{extension_id.lower()}"


def add_plug(socket: str) -> Plug:
    """Build an `add` showcase plug for a single socket.

    The module directory and the bundle path both derive from the socket, so
    there is no separate socket manifest to keep in sync. The `href` keeps the
    bare slug, since it maps to a built directory.
    """
    slug = f"add-{socket.replace('.', '-')}"
    return Plug(
        id=plug_id(slug),
        name=plug_name("Plug here"),
        description="Showcase: add your extension plug on this socket.",
        socket=socket,
        href=f"/static/{slug}/index.js",
    )
