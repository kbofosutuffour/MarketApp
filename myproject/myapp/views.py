
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from .models import *
from django.template import Context, Template
from django.http import JsonResponse
from .forms import *

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

    return render(request, 'home.html', {'posts': posts})

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

        #if the user is authenitcated, move to the home screen
        if user is not None:
            auth.login(request, user)
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

        # if User.objects.filter(email=email).exists():
        #     #TODO retrieve email
        #     user = User.objects.get(username=username)
        #     answer = 'Your username is' + user.username
        #     messages.info(request, answer)

        #Option where user has forgotten password.  Retrieves username from the screen and redirects to reset_password page
        if User.objects.filter(username=username).exists():
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

        

def new_post(request):
    """
    View representing the functionality of the new_post screen (new_post.html)
    """

    #If the user is not logged in, redirect to the home page (guests should not be able to create new posts)
    if User.username is None:
        messages.info(request, 'Must have an account to create a new post')
        return redirect('/')
 
    
    form = PostForm(request.POST, request.FILES)        #form object stores all data the user inputs for a new post

    #if the user has submitted a post, validate the post and redirect user to the home page
    if form.is_valid():
        np = form.save(commit=False)
        user = request.user.get_username()
        np.username = user
        np.save()
        messages.success(request, "Your post has been successfully uploaded!")
        return redirect('/')
    
    #Creates an empty form if page has loaded for the first time
    else:
        form = PostForm()
    

    return render(request, 'new_post.html', {'form': form})



def edit_post(request):
    """
    View used for the functionality of the edit_post screem (edit_post.html)
    """

    #If the user is not logged in, redirect them to the home page (guests should not be able to edit posts)
    if User.username is None:
        messages.info(request, 'Must have an account to create a new post')
        return redirect('/')
    
    form = PostForm(request.POST, request.FILES)

    #If the user has submitted their edits for a post
    if form.is_valid():

        #retrieve the post from the database, make all changes to the post, then redirect user to the home screen
        #TODO: Create an implementation without using a for loop
        posts = Post.objects.filter(username=request.user.get_username(), product = request.session['old_product'])
        for post in posts:
            post.product = form.cleaned_data['product']
            post.price = form.cleaned_data['price']
            post.image = form.cleaned_data['image']
            post.description = form.cleaned_data['description']
            post.save()
            messages.success(request, 'You have successfully edited your post')

            return redirect('/')
    
    #Creates an empty form for the user to edit their post
    else:
        username = request.POST['username']
        product = request.POST['product']
        posts = Post.objects.filter(username=username, product=product)
        image = request.POST['image']

        #TODO: Create an implementation without using a for loop
        for post in posts:
            price = post.price
            description = post.description

        #form object that will store all data of edited post.  Loaded with the posts initial information
        form = PostForm(
                initial = {
                    "product": product,
                    "price": price,
                    "description": description,
                    "image": image
                }
            )
        
        request.session['old_product'] = product        #temporary dictionary that passes on the product name to different views

    return render(request, 'edit_post.html', {'form': form})



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
    profiles = Profile.objects.filter(username=request.user.get_username())
    context = {
        'profiles': profiles,
        'posts': posts,
    }

    return render(request, 'profile.html', context)


def productDescription(request):
    """
    View used for the functionality of the product description page (product_description)
    """
    product = request.GET['product']
    username = request.GET['username']
    posts = Post.objects.filter(username=username, product=product)
    profiles = Profile.objects.filter(username=username)
    context = {
        'profiles': profiles,
        'posts': posts,
    }


    return render(request, 'product_description.html', context)
