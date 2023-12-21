
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.core.mail import send_mail
from .models import *
from django.template import Context, Template
from django.http import JsonResponse
from .forms import *
from django.views.generic.edit import FormView
from django.conf import settings
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import *
import random
import datetime

"""
    A view function is a Python function that takes a Web request and returns a Web response (geeksforgeeks.org).
    This page contains all of the views used throughout the project, or in other words, all functions used switch 
    webpage screens and pass information between screens.
    
"""

class Posts(viewsets.ModelViewSet):
    """
    View to lists all of the posts in the system
    """

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @action(methods=['get'], detail=False, url_path=r'get_posts/(?P<username>\w+)')
    def get_posts(self, request, username, *args, **kwargs):

        posts = Post.objects.filter(username=username)
        posts = self.filter_queryset(posts)
        # page = self.paginate_queryset(posts)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = PostSerializer(data=request.data)
        print(request.data, 'request')
        if serializer.is_valid():
            #create the post, then save it as a draft for the user
            # serializer.username = 'admin'
            serializer.save()
            return Response({'message': 'You have successfully edited your post'})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})
    
    def partial_update(self, request, pk=None):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'You have successfully edited your post'})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})
    
    def destroy(self, request, pk=None):
        post = Post.objects.get(pk=pk)
        print('test delete')
        post.delete()
        return Response({'message': 'You have successfully deleted your post'})

class EditProfileViewSet(viewsets.ViewSet):
    
    @action(methods=['patch'], detail=False, url_path=r'like_post/(?P<username>\w+)')
    def like_post(self, request, username=None):
        """
        Likes or removes a like from a post
        """
        try:
            profile = Profile.objects.get(username=username)

            try:
                profile.liked_posts.get(pk=request.data['liked_posts'])
                profile.liked_posts.remove(request.data['liked_posts'])
            except:
                profile.liked_posts.add(request.data['liked_posts'])

            profile.save()
            return Response({'message': 'You have successfully edited your profile'})
        except:
            print('error')
            return Response({'error': 'There was an error liking the post.  Pleas try again.'})
        
    def partial_update(self, request, pk=None):
        profile = Profile.objects.get(username=pk)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # profile.profile_picture = request.data.profile_picture
            # profile.save()
            # print(profile.profile_picture, 'profile.profile_picture')
            # print(serializer.data.get('profile_picture'), 'serializer')
            return Response({'message': 'You have successfully edited your profile'})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})
        
    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance
    
class EditPostViewSet(viewsets.ViewSet):
    
    @action(methods=['patch'], detail=False, url_path=r'status/(?P<username>\w+)')
    def status(self, request, username=None):
        """
        Changing the status of a post
        """
        try:
            post = Post.objects.get(pk=request.data['post'])
            post.status = request.data['status']
            post.save()
            return Response({'message': 'You have successfully edited your post status'})
        except:
            print('error')
            return Response({'error': 'There was an error editing your post status.  Please try again.'})
        
    def partial_update(self, request, pk=None):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})
        
    def update(self, instance, validated_data):
        # instance.display_image = validated_data.get('display_image', instance.display_image)
        instance.price = validated_data.get('price', instance.price)
        instance.status = validated_data.get('status', instance.status)
        instance.category = validated_data.get('category', instance.category)
        instance.draft = validated_data.get('draft', instance.draft)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance
    
class Profiles(viewsets.ModelViewSet):
    """
    View to list all of the profiles in the system
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    @action(methods=['get'], detail=False, url_path=r'get_id/(?P<username>\w+)')
    def get_id(self, request, username, *args, **kwargs):

        profile = Profile.objects.get(username=username)
        return Response({'id': profile.id})
    
    @action(methods=['get'], detail=False, url_path=r'get_liked_posts/(?P<username>\w+)')
    def get_liked_posts(self, request, username, *args, **kwargs):

        profile = Profile.objects.get(username=username)
        posts = profile.liked_posts.all()
        post_ids = []
        for post in posts:
            post_ids.append(post.id)

        return Response({'liked_posts': post_ids})


    def create(self, request):
        serializer = ProfileSerializer(data=request.data)
        try:
            exists = Profile.objects.get(username=request.data['username'])
        except:
            exists = False
        if serializer.is_valid() and not exists:
            #create the profile
            serializer.save()
            return Response({'message': 'You have successfully created a profile'})
        elif exists:
            return Response({'error': 'Profile for this username already exists'})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})
    
# Taken from: https://www.django-rest-framework.org/api-guide/viewsets/
class UserViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @action(methods=['post'], detail=False)
    def login(self, request, *args, **kwargs):
        print(request.data)

        #authenticates the login information
        user = auth.authenticate(username=request.data['username'], password=request.data['password']) 

        #authenticates the user and checks if user has a profile
        if user is not None:
            #auth.login(request, user)
            try:
                Profile.objects.get(username=request.data['username'])
            except:
                return Response({'login': 1, 'register': 1, 'message': 'login successful'})
            
            return Response({'login': 1, 'register': 0, 'message': 'login successful, redirect to registration page'})
        
        #else, reload the login screen and display error message
        else:
            return Response({'login': 0, 'message': 'credentials invalid' })
        
    @action(methods=['post'], detail=False)
    def verify(self, request, *args, **kwargs):
        print(request.data)

        code = random.randint(0,99999)
        code = str(code)
        send_code(request, code, request.data['email'])
        return Response({'code': code})
    
    @action(methods=['post'], detail=False)
    def change_password(self, request, *args, **kwargs):
        print(request.data)
        if (request.data['username'] and request.data['password']):
            try:
                user = User.objects.get(username=request.data['username'], email=request.data['email'])
                print('success')
                user.set_password(request.data['password'])
                user.save()
                return Response({'success': 1})
            except:
                print('failed')
                return Response({'success': 0})
        else:
            print('failed')
            return Response({'success': 0})
    
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        try:
            exists = User.objects.get(username=request.data['username'])
        except:
            exists = False
        if serializer.is_valid() and not exists:
            user = User.objects.create()
            user.username = request.data['username']
            user.set_password(request.data['password'])
            user.email = request.data['email']
            user.first_name = request.data['first_name']
            user.last_name = request.data['last_name']
            user.save()
            return Response({'message': 'You have successfully registered for H2H'})
        elif exists:
            return Response({'message': 'User already registered.  Be sure to create a profile.'})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})
    
         

class Rooms(viewsets.ModelViewSet):
    """
    View to list all of the profiles in the system
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    @action(methods=['get'], detail=False, url_path=r'get_rooms/(?P<username>\w+)')
    def get_rooms(self, request, username, *args, **kwargs):

        buyer_rooms = Room.objects.filter(buyer=username)
        buyer_rooms = self.filter_queryset(buyer_rooms)
        seller_rooms = Room.objects.filter(seller=username)
        seller_rooms = self.filter_queryset(seller_rooms)

        # page = self.paginate_queryset(posts)
        buyer_serializer = self.get_serializer(buyer_rooms, many=True)
        seller_serializer = self.get_serializer(seller_rooms, many=True)
        return Response({
            'buyers': buyer_serializer.data,
            'sellers': seller_serializer.data
        })
    
    def create(self, request):
        print(request.data['buyer'], request.data['seller'], request.data['product'])
        serializer = RoomSerializer(data=request.data)
        try:
            exists = Room.objects.get(seller=request.data['seller'], buyer=request.data['buyer'], product=request.data['product'])
        except:
            exists = False

        if exists:
            return Response({'exists': 1})
        elif serializer.is_valid():
            serializer.save()
            return Response({'created': 1})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors})

    
class Messages(viewsets.ModelViewSet):
    """
    View to list all of the profiles in the system
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @action(methods=['get'], detail=False, url_path=r'get_messages/(?P<room_id>\w+)')
    def get_messages(self, request, room_id, *args, **kwargs):

        messages = Message.objects.filter(room=room_id)
        messages = self.filter_queryset(messages)
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

#----------------------------

def home(request):
    """
    View representing the functionality of the home screen (home.html)
    """
    posts = Post.objects.all()
    number_of_posts = len(posts)

    return Response({'posts': posts, 'number_of_posts': number_of_posts})

@api_view()
def search(request):
    """
    View used for the functionality of the search bar of the home screen (home.html)
    """
    posts = Post.objects.all()
    number_of_posts = len(posts)
    context = {
        'posts': list(posts.values()),
        'number_of_posts': number_of_posts
    }
    return Response(context)

def edit_button(request):
    username = request.POST['username']
    product = request.POST['product']
    """
    View used to open the edit options for a singular post on the home screen (home.html)
    """
    return JsonResponse({'username': username, 'product': product})


def send_code(request, code, email):
    """
    Function used to send the user their verification code via email
    """

    date = datetime.datetime.now()
    date = date.strftime("%B %d, %Y")
    message = f"""
    H2H
    W&M Market App
    marketappwm@gmail.com\n
    {date}

    Dear user,
        Your verification code is {code}.  Please do not share this code with anyone.  Please do not reply to this email.  
        Thank you for using our services.

    Sincerely,
    H2H MarketApp Team
    """

    #send user an email
    print(code)
    # send_mail(
    #         subject="H2H Account Verification Code",
    #         message=message,
    #         from_email=settings.EMAIL_HOST_USER,
    #         recipient_list=[email]
    #     )

class EditPostView(FormView):
    """
    View used for the functionality of the edit post screes (edit_post.html)
    Format used based on django documentation (version 4.2): 
    https://docs.djangoproject.com/en/4.2/topics/http/file-uploads/#uploading-multiple-files
    """

    form_class = PostForm
    template_name = "edit_post.html"  # Replace with your template.
    success_url = '/returnHome'
    initial = {}

    def set_initial(self, form, request):
        username = request.user.get_username()
        product = request.POST['product']
        post = Post.objects.get(username=username, product=product)
        price = post.price
        description = post.description

        #form object that will store all data of edited post.  Loaded with the posts initial information
        self.initial = {
            "product": product,
            "price": price,
            "description": description,
            "display_image": post.display_image
        }
    
        request.session['old_product'] = product

    def get_initial(self):
        return self.initial
    
    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():

            #save the user info
            post = Post.objects.get(username=request.user.get_username(), product = request.session['old_product'])
            post.product = form.cleaned_data['product']
            post.price = form.cleaned_data['price']
            post.display_image = form.cleaned_data['display_image']
            post.description = form.cleaned_data['description']

            #save as draft or post
            user = Profile.objects.get(username = request.user.get_username())
            if 'save_as_draft' in request.POST:
                user.drafts.add(post)
                post.draft = True
            elif 'upload' in request.POST:
                user.drafts.remove(post)
                post.draft = False

            # whether a post is SELLING, PENDING, or SOLD
            post.status = request.POST["status"]
            print(post.status, request.POST["status"])

            post.save()
            return self.form_valid(form, request)
        else:
            self.set_initial(form, request)
            return self.form_invalid(form)

    def form_valid(self, form, request):
        # holds any additional images
        files = form.cleaned_data["additional_images"]

        # adding all images to a list, then creating an Image object containing each image
        additional_images_list = []
        for additions in files:
            additional_images_list.append(additions)

        length = len(additional_images_list)

        #Filling empty spaces since an Image object must contain 4 items
        while length < 4:
            additional_images_list.append(None)
            length += 1

        post = Post.objects.get(
            product=form.cleaned_data['product'], 
            username = request.user.get_username()
        )

        img = Image(
            post = post,
            image1 = additional_images_list[0],
            image2 = additional_images_list[1],
            image3 = additional_images_list[2],
            image4 = additional_images_list[3],
        )
        img.save()

        messages.success(request, "Your post has been successfully edited!")
        return super().form_valid(form)
    
    def form_invalid(self, form):
        response = super().form_invalid(form)
        return response


def getImage(request):
    """
    DO NOT DELETE, MAY BE USED FOR CHAT FEATURE
    """
    posts = Post.objects.all()
    return JsonResponse({'posts': list(posts.values())})


@api_view()
def profile(request, user):
    """
    View used for the funcitonality of the profile page (profile.html)
    """
    print(user)
    posts = Post.objects.filter(username=user)
    try:
        profile = Profile.objects.get(username=user)
        saved_posts = list(profile.saved_posts.all())
        drafts = list(profile.drafts.all())
        hasProfile = True
        context = {
            'hasProfile': hasProfile,
            'username': user,
            'profile_picture': profile.profile_picture.url,
            'first_name': profile.first_name,
            'last_name': profile.last_name,
            # 'saved_posts': saved_posts,
            # 'drafts': drafts,
        }

    except: 
        hasProfile = False
        context = {
            'hasProfile': hasProfile,
            'username': user
        }

    return Response(context)
