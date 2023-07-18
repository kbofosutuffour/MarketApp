from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('register', views.register, name='register'),
    path('avatar', views.avatar, name='avatar'),
    path('new_post', views.new_post, name='new_post'),
    path('getImage', views.getImage, name='getImage'),
    path('returnHome', views.returnHome, name='returnHome'),
    path('profile', views.profile, name='profile')

    #path('logout', views.logout, name='logout'),
    #path('post/<str:pk>', views.post, name="post") #dynamic urls, where pk is a variable of string type.  This is important for database usage
]