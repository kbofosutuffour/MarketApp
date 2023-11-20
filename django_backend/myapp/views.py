
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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
import random
import datetime

"""
    A view function is a Python function that takes a Web request and returns a Web response (geeksforgeeks.org).
    This page contains all of the views used throughout the project, or in other words, all functions used switch 
    webpage screens and pass information between screens.
    
"""

def loader(request):
    """
    View representing the functionality of the loader screen (loader.html)
    """
    return render(request, 'loader.html')

class Posts(viewsets.ModelViewSet):
    """
    View to lists all of the posts in the system
    """

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # def list(self, request):
    #     queryset = Post.objects.all()
    #     serializer = PostSerializer(queryset, many=True)
    #     return Response(serializer.data)

    # def retrieve(self, request, pk=None):
    #     queryset = Post.objects.all()
    #     user = get_object_or_404(queryset, pk=pk)
    #     serializer = PostSerializer(user)
    #     return Response(serializer.data)
    
    # def create(self, request):
    #     serializer = PostSerializer(data=request.data)
    #     if serializer.is_valid():
    #         #create the post, then save it as a draft for the user
    #         serializer.username = request.get_username()
    #         serializer.save()

    #         user = Profile.objects.get(username = request.user.get_username())
    #         post = Post.objects.get(username = request.user.get_username(), product = np.product)

    #         # making the post a draft if the user has choosen so
    #         if 'save_as_draft' in request.data:
    #             user.drafts.add(post)
    #             post.draft = True
    #         elif 'upload' in request.data:
    #             post.draft = False

    #         # setting the status of a post (default selling)
    #         post.status = "SELLING"

    #         post.save()
    
    # def update(self, request, pk=None):
    #     serializer = PostSerializer(data=request.data)
    #     if serializer.is_valid():

    #         #save the user info
    #         post = Post.objects.get(username=request.user.get_username(), product = request.session['old_product'])
    #         post.product = serializer.cleaned_data['product']
    #         post.price = serializer.cleaned_data['price']
    #         post.display_image = serializer.cleaned_data['display_image']
    #         post.description = serializer.cleaned_data['description']

    #         #save as draft or post
    #         user = Profile.objects.get(username = request.user.get_username())
    #         if 'save_as_draft' in request.data:
    #             user.drafts.add(post)
    #             post.draft = True
    #         elif 'upload' in request.data:
    #             user.drafts.remove(post)
    #             post.draft = False

    #         # whether a post is SELLING, PENDING, or SOLD
    #         post.status = request.data["status"]

    #         post.save()

    # def destroy(self, request, pk=None):
    #     post = Post.objects.get(pk=pk)
    #     post.delete()
        
class Profiles(viewsets.ModelViewSet):
    """
    View to list all of the profiles in the system
    """

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    # def list(self, request):
    #     queryset = Profile.objects.all()
    #     serializer = ProfileSerializer(queryset, many=True)
    #     return Response(serializer.data)
    
    # def retrieve(self, request, pk=None):
    #     queryset = Profile.objects.all()
    #     user = get_object_or_404(queryset, pk=pk)
    #     serializer = ProfileSerializer(user)
    #     return Response(serializer.data)
    
    # def update(self, request, pk=None):
    #     queryset = Profile.objects.all()

    #     #If the user is not logged in, redirect them to the home page (guests should not be able to edit profile)
    #     try:
    #         user = User.objects.get(username=request.user.get_username())
    #     except:
    #         return Response({'error': 'Must have an account to edit your profile'})
        
    #     try:
    #         profile = Profile.objects.get(username=request.user.get_username())
    #         hasProfile = True
    #     except:
    #         profile = Profile(username=request.user.get_username())
    #         hasProfile = False

    #     serializer = ProfileSerializer(queryset)

    #     #If the user has submitted their edits for their profile
    #     if serializer.is_valid():

    #         #retrieve the profile from the database, make all changes to the post, then redirect user to the home screen
    #         profile.profile_picture = form.cleaned_data['profile_picture']
    #         profile.save()
    #         # user.first_name = profile.first_name
    #         # user.last_name = profile.last_name
    #         # user.save()

    #         return Response({'message': 'You have successfully edited your post'})


# Taken from: https://www.django-rest-framework.org/api-guide/viewsets/
class UserViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    

class Rooms(viewsets.ModelViewSet):
    """
    View to list all of the profiles in the system
    """

    queryset = Room.objects.all()
    serializer_class = RoomSerializer


    # def list(self, request):
    #     queryset = Room.objects.all()
    #     serializer = RoomSerializer(queryset, many=True)
    #     return Response(serializer.data)
    
    # def retrieve(self, request, pk=None):
    #     queryset = Room.objects.all()
    #     user = get_object_or_404(queryset, pk=pk)
    #     serializer = RoomSerializer(user)
    #     return Response(serializer.data)
    
class Messages(viewsets.ModelViewSet):
    """
    View to list all of the profiles in the system
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    # def list(self, request):
    #     queryset = Message.objects.all()
    #     serializer = MessageSerializer(queryset, many=True)
    #     return Response(serializer.data)
    
    # def retrieve(self, request, pk=None):
    #     queryset = Message.objects.all()
    #     user = get_object_or_404(queryset, pk=pk)
    #     serializer = MessageSerializer(user)
    #     return Response(serializer.data)
    



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


def login(request):
    """
    View representing the functionality of the login screen (login.html)
    """

    #If the user has hit the submit button
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']

        #authenticates the login information
        user = auth.authenticate(username=username, password=password) 

        #Authenticates the user and checks if user has a profile
        if user is not None:
            auth.login(request, user)
            try:
                Profile.objects.get(username=request.user.get_username())
            except:
                return redirect('avatar')
            
            return redirect('loader')
        
        #else, reload the login screen and display error message
        else:
            messages.info(request, 'credentials invalid')
            return redirect('login')
        
    #default: simply load the login page
    else:
        return render(request, 'login.html')

def logout(request):
    """
    View called to log off
    """
    auth.logout(request)
    return redirect('home')

def email(request):
    """
    View used to generate a random code and render the email page (email.html)
    """
    code = random.randint(10000,99999)
    code = str(code)
    return render(request, 'email.html', {'code': code})

def verify(request):
    """
    View used for the verification screen (verify.html)
    """
    code = request.POST['code']
    email = request.POST['email']

    if 'input' in request.POST:
        input = request.POST['input']
        if input == code:
            return render(request, 'register.html', {'email': email})
        else:
            messages.info(request, 'credentials invalid')
            return render(request, 'verify.html', {'email': email, 'code': code})
    else:
        send_code(request, code, email)

    
    return render(request, 'verify.html', {'email': email, 'code': code})

def init_verify(request):
    email = request.POST['email']
    code = random.randint(10000,99999)
    # return redirect('verify')
    return render(request, 'verify.html', {'email': email, 'code': code})


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
    send_mail(
            subject="H2H Account Verification Code",
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email]
        )

def register(request):
    """
    View representing the functionality of the register page (register.html)
    """

    #If the user has hit the submit button
    if request.method == "POST":

        #Retrieves information from the page
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        if password == password2:

            #If the email the user used already exists, reload the page and display error message
            if User.objects.filter(email=email).exists():
                messages.info(request, 'Email already Used')
                return redirect('register')
            
            #If the username the user created already exists, reload the page and display error message
            elif User.objects.filter(username=username).exists():
                messages.info(request, 'Username already in use')
                return redirect('register')
            
            else:

            #create and save the user into the backend database
                auth.logout(request)
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                auth.login(request, user)
                return redirect('avatar')
        
        #If the passwords do not match, reload the page and display error message
        else:
            messages.info(request, 'Passwords do not match')
            return redirect('register')
        
    #default load of register view
    else:
        return render(request, 'register.html')
    

def forgot_screen(request):
    """
    View respresenting the functionality of the forgot_screen page (forgot_screen.html), used if user has forgotten username or password
    """

    #If user has hit the submit button on screen
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']


        if User.objects.filter(email=email).exists():
            #TODO retrieve email
            user = User.objects.get(email=email)
            answer = 'Your username is ' + user.username
            messages.info(request, answer)
            return redirect('login')

        #Option where user has forgotten password.  Retrieves username from the screen and redirects to reset_password page
        elif User.objects.filter(username=username).exists():
            request.session['username'] = username
            return redirect('reset_password')
        else:
            messages.error(request, "User with this username does not exist")
            return render(request, 'forgot_screen.html')

    #default: simply load the forgot_screen page
    else:
        return render(request, 'forgot_screen.html')
    
def reset_password(request):
    """
    View representing the functionality of the reset_password screen (reset_password.html)
    """

    #If user has hit the submit button on screen
    if request.method == 'POST':

        #retrieve input data
        username = request.POST['username']
        password = request.POST['password']
        password1 = request.POST['password1']
        user = User.objects.get(username=username)

        #If the password and confirmation password do not match, reload the page and display an error message
        if password != password1:
            messages.error(request, 'Passwords did not match')
            return redirect('reset_password')
        
        #If passwords do match, update the users password and redirect to login page
        elif password == password1:
            user.set_password(password)
            user.save()
            messages.info(request, 'Your password has been created')
            return redirect('login')

    #default, simply load the page
    return render(request, 'reset_password.html')


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


def delete_post(request):
    """
    function used to delete a post on the edit post screen (edit_post.html)
    """
    post = Post.objects.get(username=request.user.get_username(), product = request.session['old_product'])
    post.delete()
    messages.success(request, 'Your post has been deleted')
    return redirect('/')


def edit_profile(request):
    """
    View used for the functionality of the edit profile screes (edit_post.html)
    """

    #If the user is not logged in, redirect them to the home page (guests should not be able to edit profile)
    try:
        user = User.objects.get(username=request.user.get_username())
    except:
        messages.info(request, 'Must have an account to edit your profile')
        return redirect('/')
    
    try:
        profile = Profile.objects.get(username=request.user.get_username())
        hasProfile = True
    except:
        profile = Profile(username=request.user.get_username())
        hasProfile = False

    form = ProfileForm(request.POST, request.FILES)

    #If the user has submitted their edits for their profile
    if form.is_valid():

        #retrieve the profile from the database, make all changes to the post, then redirect user to the home screen
        #TODO: Create an implementation without using a for loop
        profile.profile_picture = form.cleaned_data['profile_picture']
        profile.save()
        # user.first_name = profile.first_name
        # user.last_name = profile.last_name
        # user.save()
        messages.success(request, 'You have successfully edited your post')

        return redirect('profile')
    
    #Creates an empty form for the user to edit their profile
    else:

        #form object that will store all data of edited post.  Loaded with the profile initial information
        form = ProfileForm(
            initial = {
                "username": request.user.get_username(),
                # "first_name": profile.first_name,
                # "last_name": profile.last_name,
                "profile_picture": profile.profile_picture
            }
        )

    context = {'form': form,
               'profile': profile,
               'user': user,
               'username': request.user.get_username(),
               'hasProfile': hasProfile
               }

    return render(request, 'edit_profile.html', context)


def getImage(request):
    """
    DO NOT DELETE, MAY BE USED FOR CHAT FEATURE
    """
    posts = Post.objects.all()
    return JsonResponse({'posts': list(posts.values())})


def returnHome(request):
    """
    View used to redirect user to the home screen
    """
    return redirect('/')


def avatar(request):
    """
    View used for the functionality of the avatar screen (avatar.html) used to create a user profile
    """

    form = ProfileForm(request.POST, request.FILES)
    user = User.objects.filter(username=request.user.get_username())

    #If the user has submitted data, verify all information is provided then save the profile
    if form.is_valid():
        np = form.save(commit=False)
        np.username = request.user.get_username()
        np.save()
        return redirect('/')

        #TODO: Add first-name, last name to profile

        # user.first_name = request.POST['first_name']
        # user.last_name = request.POST['last_name']
        # user.save()
    
    #default, create an empty profile form
    else:
        form = ProfileForm()

    return render(request, 'avatar.html', {'form': form, 'user': user})
    

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
        print(context)

    except: 
        hasProfile = False
        context = {
            'hasProfile': hasProfile,
            'username': user
        }

    return Response(context)

def other_profile(request):
    """
    View used for the funcitonality of the profile page (profile.html)
    """

    username = request.POST['username']

    posts = Post.objects.filter(username=username)
    profile = Profile.objects.get(username=username)

    context = {
        'profile': profile,
        'posts': posts,
        'username': username,
        'other_profile': True
    }

    return render(request, 'profile.html', context)



def productDescription(request):
    """
    View used for the functionality of the product description page (product_description)
    """
    product = request.GET['product']
    username = request.GET['username']
    post = Post.objects.get(username=username, product=product)
    profile = Profile.objects.get(username=username)

    try:
        additional_images = Image.objects.get(post=post)
    except:
        additional_images = None

    context = {
        'profile': profile,
        'post': post,
        'additional_images': additional_images
    }

    return render(request, 'product_description.html', context)


def chat_room(request):
    """
    View used for the functionality of the chat room (chat_room.html).  
    """

    #If the user is not logged in, redirect them to the home page (guests should not be able to enter a chat room)
    try:
        User.objects.get(username=request.user.get_username())
    except:
        messages.info(request, 'Must have an account to chat with others')
        return redirect('/')
    
    #If information has been sent form a productDescription page...
    if len(request.GET.keys()) != 0:

        product = request.GET['product']

        seller = Profile.objects.get(username=request.GET['seller'])
        buyer = Profile.objects.get(username=request.user.get_username())
        post = Post.objects.get(username=seller.username, product=product)

        try:
            chatroom = Room.objects.get(product=product, buyer=request.user.get_username(), seller=seller.username)
        except:
            chatroom = Room(
                buyer=request.user.get_username(),
                buyer_profile_picture = buyer.profile_picture,
                seller = seller.username,
                seller_profile_picture = seller.profile_picture,
                product = post.product,
                image = post.display_image
            )
            chatroom.save()


    buyer_chatrooms = Room.objects.filter(buyer = request.user.get_username())
    seller_chatrooms = Room.objects.filter(seller = request.user.get_username())

    number_of_chats = len(buyer_chatrooms) + len(seller_chatrooms)

    context = {'buyer_chatrooms': buyer_chatrooms, 
                'seller_chatrooms': seller_chatrooms, 
                'current_user': request.user.get_username(),
                'number_of_chats': number_of_chats}
    
    return render(request, 'chat_room.html', context)


def chat_messaging(request):
    """
    View used to render the chat messaging pate (chat_messaging.html)
    """
    print(request)
    product = request.GET['product']
    buyer = request.GET['buyer']
    seller = request.GET['seller']

    post = Post.objects.get(product=product)
    print(buyer, seller, 'buyer-seller')

    try:
        chatroom = Room.objects.get(buyer=buyer, seller=seller, product=post.product)
        print(chatroom, buyer, seller, 'testing')
    except:
        messages.error(request, "There was an error with loading the chat room.  Please try again")
        redirect('/')

    user_messages = Message.objects.filter(room=chatroom)    

    #send a new form to the chat_messaging screen for the Message model
    form = MessageForm()    
    
    context = {
        'chatrooms': chatroom,
        'messages': user_messages,
        'current_user': request.user.get_username(),
        'buyer': buyer,
        'seller': seller,
        'product': product,
        'form': form
    }

    return render(request, 'chat_messaging.html', context)


def new_message(request):
    """
    View/function used to store a new message into our database, specifically the Message model
    """

    chatroom = Room.objects.get(seller=request.POST['seller'], buyer=request.POST['buyer'], product=request.POST['product'])
    form = MessageForm(data=request.POST, files=request.FILES)

    #If the user has submitted data, verify all information is provided then save the profile
    if form.is_valid():
        np = form.save(commit=False)
        np.username = request.user.get_username()
        np.room = chatroom
        np.save()

        return JsonResponse({'error': False, 'message': 'Uploaded Successfully'})
    else:
        print(form.errors)
        return JsonResponse({'error': True, 'errors': form.errors})

def load_messages(request, seller, buyer, current_user, product):
    """
    function used to asynchronously load messages in any given chat room
    """

    chatroom = Room.objects.get(buyer=buyer, seller=seller, product=product)
    messages = Message.objects.filter(room=chatroom)

    context = {
        'messages': list(messages.values()),
        'seller_profile_picture': chatroom.seller_profile_picture.url,
        'buyer_profile_picture': chatroom.buyer_profile_picture.url,
        'seller': seller,
        'buyer': buyer,
        'current_user': current_user
    }

    return JsonResponse(context)


def save_post(request):
    """
    function used to save/unsave a post for the user
    """
    
    username = request.POST['username']
    product = request.POST['product']
    post = Post.objects.get(username=username, product=product)
    profile = Profile.objects.get(username=request.user.get_username())
    if len(profile.saved_posts.filter(username=username, product=product)) != 0:
        profile.saved_posts.remove(post)
        profile.save()
        post_string = "You have unsaved '" + post.product + "' from user " + post.username
    else:
        profile.saved_posts.add(post)
        profile.save()
        post_string = "You have saved '" + post.product + "' from user " + post.username

    messages.success(request, post_string)
    return redirect('/')
    
def user_settings(request):
    """
    view used for the settings screen (settings.html)
    """

    profile = Profile.objects.get(username=request.user.get_username())
    context = {
        'profile': profile
    }

    return render(request, 'settings.html', context)


def change_password(request):
    """
    view used to change a users password (settings.html)
    """
    user = User.objects.get(username = request.user.get_username())

    password = request.POST['password']
    confirm_password = request.POST['password']
    if password == confirm_password:
        try:
            user.set_password(password)
            user.save()
            messages.success(request, "Your password has been successfully changed")
        except:
            messages.error(request, "There was an error while changing your password.  Please try again")
    else:
        messages.error(request, "Passwords do not match.  Please try again")
    
    redirect('settings.html')
    
