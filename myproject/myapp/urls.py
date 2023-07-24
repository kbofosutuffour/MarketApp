from django.urls import path
from . import views

"""
    This document contains all of the different webpages the app has.  
    Django uses this information to know which view aligns with which html webpage, and how
    different webpages interract with each other
"""
urlpatterns = [
    path('', views.home, name='home'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('register', views.register, name='register'),
    path('avatar', views.avatar, name='avatar'),
    path('new_post', views.new_post, name='new_post'),
    path('getImage', views.getImage, name='getImage'),
    path('returnHome', views.returnHome, name='returnHome'),
    path('profile', views.profile, name='profile'),
    path('productDescription', views.productDescription, name="productDescription"),
    path('edit_post', views.edit_post, name="edit_post"),
    path('forgot_screen', views.forgot_screen, name="forgot_screen"),
    path('reset_password', views.reset_password, name="reset_password")

    #path('logout', views.logout, name='logout'),
    #path('post/<str:pk>', views.post, name="post") #dynamic urls, where pk is a variable of string type.  This is important for database usage
]