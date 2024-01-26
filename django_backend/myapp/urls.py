from django.urls import path, re_path
from django.conf.urls import include
from . import consumers
from myapp.views import Posts, Profiles, UserViewSet, Rooms, Messages, EditProfileViewSet, EditPostViewSet, UserSettingsViewSet, ReportViewSet, ImageViewSet, FeedbackViewSet, RatingViewSet, FlaggedPostViewSet, ViolationViewSet, search, profile
from rest_framework.routers import DefaultRouter

"""
    This document contains all of the different webpages the app has.  
    Django uses this information to know which view aligns with which html webpage, and how
    different webpages interract with each other
"""

# routers are used to route Django ViewSets to an HTTP Request through the named URL

router = DefaultRouter()
router.register(r'posts', Posts, basename='post')
router.register(r'profiles', Profiles, basename='profile')
router.register(r'users', UserViewSet)
router.register(r'rooms', Rooms, basename='rooms')
router.register(r'messages', Messages, basename='messages')
router.register(r'edit_profile', EditProfileViewSet, basename='edit_profile')
router.register(r'edit_post', EditPostViewSet, basename='edit-post')
router.register(r'user_settings', UserSettingsViewSet, basename='user_settings')
router.register(r'report', ReportViewSet, basename="report")
router.register(r'images', ImageViewSet, basename="images")
router.register(r'feedback', FeedbackViewSet, basename="feedback")
router.register(r'ratings', RatingViewSet, basename="ratings")
router.register(r'flag', FlaggedPostViewSet, basename="flag")
router.register(r'violation', ViolationViewSet, basename="violation")

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('search', search, name='search'),
    path('profile/<str:user>', profile, name='profile'),
]

# Information and code taken from Django Channel documentation:
# https://channels.readthedocs.io/en/latest/tutorial/index.html

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
]