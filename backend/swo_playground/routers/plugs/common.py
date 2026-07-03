from mpt_extension_sdk.routing.plugs import Plug


def add_plug(socket: str) -> Plug:
    """Build an `add` showcase plug for a single socket.

    Each socket has its own thin frontend module (``src/modules/add-<socket
    dashed>``) built to ``/static/add-<socket dashed>/index.js``. The plug id,
    the module directory and the bundle path all derive from the socket the
    same way, so there is no separate socket manifest to keep in sync.
    """
    slug = f"add-{socket.replace('.', '-')}"
    return Plug(
        id=slug,
        name="Plug here",
        description="Showcase: add your extension plug on this socket.",
        socket=socket,
        href=f"/static/{slug}/index.js",
    )
