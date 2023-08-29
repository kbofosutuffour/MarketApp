
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

"""
    A view function is a Python function that takes a Web request and returns a Web response (geeksforgeeks.org).
    This page contains all of the views used throughout the project, or in other words, all functions used switch 
    webpage screens and pass information between screens.
    
"""

def home(request):
    """
    View representing the functionality of the home screen (home.html)
    """
    posts = Post.objects.all()
    number_of_posts = len(posts)

    return render(request, 'home.html', {'posts': posts, 'number_of_posts': number_of_posts})

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
    return JsonResponse(context)

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
    if request.method == "POST":
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
            
            return redirect('/')
        
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
            print('test')
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

class NewPostView(FormView):
    """
    View representing the functionality of the new_post screen (new_post.html)
    """
    form_class = PostForm
    template_name = "new_post.html"  # Replace with your template.
    success_url = '/returnHome'
    
    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)

        if form.is_valid():
            np = form.save(commit=False)
            np.username = request.user.get_username()
            np.save()

            return self.form_valid(form, request)

        else:
            return self.form_invalid(form)

    def form_valid(self, form, request):
        form.username = request.user.get_username()
        files = form.cleaned_data["additional_images"]
        additional_images_list = []

        for additions in files:
            additional_images_list.append(additions)

        length = len(additional_images_list)
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

        messages.success(request, "Your post has been successfully uploaded!")
        return super().form_valid(form)

class EditPostView(FormView):
    """
    View used for the functionality of the edit post screes (edit_post.html)
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
            post = Post.objects.get(username=request.user.get_username(), product = request.session['old_product'])
            post.product = form.cleaned_data['product']
            post.price = form.cleaned_data['price']
            post.display_image = form.cleaned_data['display_image']
            post.description = form.cleaned_data['description']
            post.save()


            return self.form_valid(form, request)

        else:
            self.set_initial(form, request)
            print(self.initial)
            return self.form_invalid(form)

    def form_valid(self, form, request):
        files = form.cleaned_data["additional_images"]
        additional_images_list = []
        for additions in files:
            additional_images_list.append(additions)

        length = len(additional_images_list)
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
    

def profile(request):
    """
    View used for the funcitonality of the profile page (profile.html)
    """

    posts = Post.objects.filter(username=request.user.get_username())
    try:
        profile = Profile.objects.get(username=request.user.get_username())
        saved_posts = profile.saved_posts.all()
        hasProfile = True
        context = {
            'profile': profile,
            'posts': posts,
            'saved_posts': saved_posts,
            'hasProfile': hasProfile,
            'username': request.user.get_username()
        }

    except: 
        hasProfile = False
        context = {
            'posts': posts,
            'hasProfile': hasProfile,
            'username': request.user.get_username()
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

    if len(request.GET.keys()) != 0:

        username1 = request.GET['username1']
        product = request.GET['product']

        profiles = Profile.objects.filter(username=username1)
        user_profiles = Profile.objects.filter(username=request.user.get_username())
        posts = Post.objects.filter(username=username1, product=product)

        for p in posts:
            post = p
        for pro in profiles:
            profile = pro
        for u in user_profiles:
            user_profile = u

        chatroom = Room(
            username1 = username1,
            profile_picture1 = profile.profile_picture,
            username2 = request.user.get_username(),
            profile_picture2 = user_profile.profile_picture,
            product = post.product,
            image = post.display_image
        )
        chatroom.save()

        chatrooms = Room.objects.filter(username1=username1, username2=request.user.get_username())
        return render(request, 'chat_room.html', {'chatrooms': chatrooms, 'current_user': request.user.get_username()})

    else:
        chatrooms = Room.objects.filter(username1 = request.user.get_username())
        chatrooms2 = Room.objects.filter(username2 = request.user.get_username())
        number_of_chats = len(chatrooms) + len(chatrooms2)

        context = {'chatrooms': chatrooms, 
                    'chatrooms2': chatrooms2, 
                    'current_user': request.user.get_username(),
                    'number_of_chats': number_of_chats}
        
        return render(request, 'chat_room.html', context)


def chat_messaging(request):
    """
    View used to render the chat messaging pate (chat_messaging.html)
    """
    if request.method == "POST":
        pass
    
    try:
        username1 = request.GET['username1']
    except:
        username1 = request.GET['username2']

    product = request.GET['product']

    profile = Profile.objects.get(username=username1)
    user_profile = Profile.objects.get(username=request.user.get_username())
    posts = Post.objects.filter(product=product)

    for p in posts:
        if p.username == request.user.get_username() or p.username == username1:
            post = p

    try:
        chatrooms = Room.objects.get(username1=username1, username2=request.user.get_username(), product=post.product)
    except:
        chatrooms = Room.objects.get(username2=username1, username1=request.user.get_username(), product=post.product)

    messages = Message.objects.filter(room=chatrooms)
    context = {
        'chatrooms': chatrooms,
        'messages': messages,
        'current_user': request.user.get_username(),
        'username1': username1,
        'username2': request.user.get_username(),
        'product': product,
    }
    return render(request, 'chat_messaging.html', context)


def new_message(request):
    """
    View/function used to store a new message into our database, specifically the Message model
    """
    username1 = request.POST['username1']
    username2 = request.POST['username2']
    product = request.POST['product']
    new_message = request.POST['new_message']


    try:
        chatroom = Room.objects.get(username1=username1, username2=username2, product=product)
    except:
        chatroom = Room.objects.get(username2=username1, username1=username2, product=product)


    m = Message(value=new_message, room=chatroom,username=request.user.get_username())
    m.save()
    return HttpResponse('Message sent successfully')

def load_messages(request, username1, username2, current_user):
    """
    function used to asynchronously load messages in any given chat room
    """

    try:
        flip = False
        chatroom = Room.objects.get(username1=username1, username2=username2)
    except:
        flip = True
        chatroom = Room.objects.get(username1=username2, username2=username1)

    
    messages = Message.objects.filter(room=chatroom)

    if not flip:
        context = {
            'messages': list(messages.values()),
            'profile_picture1': chatroom.profile_picture1.url,
            'profile_picture2': chatroom.profile_picture2.url,
            'username1': username1,
            'username2': username2,
            'current_user': current_user
        }
    else:
        context = {
            'messages': list(messages.values()),
        
            'profile_picture1': chatroom.profile_picture2.url,
            'profile_picture2': chatroom.profile_picture1.url,
            'username1': username1,
            'username2': username2,
            'current_user': current_user
        # 'product': product
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
    