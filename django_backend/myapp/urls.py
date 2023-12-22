from django.urls import path
from django.conf.urls import include
from . import views
from myapp.views import *
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

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('search', views.search, name='search'),
    path('profile/<str:user>', views.profile, name='profile'),
]
