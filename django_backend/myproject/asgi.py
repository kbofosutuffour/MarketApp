"""
ASGI config for myproject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os


from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from myapp.ws_urls import websocket_urlpatterns
from myapp import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

get_application = get_asgi_application()

# Information and code taken from Django Channel documentation:
# https://channels.readthedocs.io/en/latest/tutorial/index.html

application = ProtocolTypeRouter({
    "http": get_application,
    "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
})
