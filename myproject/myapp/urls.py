from django.urls import path
from . import views
from myapp.views import NewPostView, EditPostView

"""
    This document contains all of the different webpages the app has.  
    Django uses this information to know which view aligns with which html webpage, and how
    different webpages interract with each other
"""
urlpatterns = [
    path('', views.loader, name='loader'),
    path('home', views.home, name='home'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('register', views.register, name='register'),
    path('avatar', views.avatar, name='avatar'),
    path('getImage', views.getImage, name='getImage'),
    path('returnHome', views.returnHome, name='returnHome'),
    path('profile', views.profile, name='profile'),
    path('productDescription', views.productDescription, name="productDescription"),
    path('save_post', views.save_post, name='save_post'),
    path('edit_profile', views.edit_profile, name="edit_profile"),
    path('forgot_screen', views.forgot_screen, name="forgot_screen"),
    path('reset_password', views.reset_password, name="reset_password"),
    path('chat_room', views.chat_room, name='chat_room'),
    path('chat_messaging', views.chat_messaging, name="chat_messaging"),
    path('new_message', views.new_message, name='new_message'),
    path('load_messages/<str:username1>/<str:username2>/<str:current_user>', views.load_messages, name='load_messages'),
    path('search', views.search, name='search'),
    path('edit_button', views.edit_button, name='edit_button'),
    path('delete_post', views.delete_post, name='delete_post'),
    path('new_post', NewPostView.as_view()),
    path('edit_post', EditPostView.as_view())

    #path('logout', views.logout, name='logout'),
    #path('post/<str:pk>', views.post, name="post") #dynamic urls, where pk is a variable of string type.  This is important for database usage
]