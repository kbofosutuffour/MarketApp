
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from .models import *
from django.template import Context, Template
from django.http import JsonResponse
from .forms import *

# Create your views here.

# Create your views here.
def home(request):
    posts = Post.objects.all()

    return render(request, 'home.html', {'posts': posts})

def login(request):

    #If the user has hit submit
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
    else:
        return render(request, 'login.html')

def logout(request):
    auth.logout(request)
    return redirect('home')

def register(request):
    #If the user has submitted to create a new account, then create the users if all credential requirements are met
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        #if passwords match...
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
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']

        if User.objects.filter(email=email).exists():
            #TODO retrieve email
            user = User.objects.get(username=username)
            answer = 'Your username is' + user.username
            messages.info(request, answer)

        elif User.objects.filter(username=username).exists():
            #return redirect('new_password')
            pass

        return render(request, 'forgot_screen')

    else:
        return render(request, 'forgot_screen')
        

def new_post(request):
    if User.username is None:
        messages.info(request, 'Must have an account to create a new post')
        return redirect('/')
 
    form = PostForm(request.POST, request.FILES)
    if form.is_valid():
        print('passed')
        np = form.save(commit=False)
        user = request.user.get_username()
        np.username = user
        np.save()
    else:
        print('failed')
        form = PostForm()
    
    return render(request, 'new_post.html', {'form': form})

    # else:
    #     return render(request, 'new_post.html')

def getImage(request):
    posts = Post.objects.all()
    return JsonResponse({'posts': list(posts.values())})

def returnHome(request):
    return redirect('/')

def avatar(request):

    form = ProfileForm(request.POST, request.FILES)
    user = User.objects.filter(username=request.user.get_username())

    
    if form.is_valid():
        np = form.save(commit=False)
        np.username = request.user.get_username()
        np.save()

        # user.first_name = request.POST['first_name']
        # user.last_name = request.POST['last_name']
        # user.save()
    
    else:
        form = ProfileForm()
        print('failed', request.user.get_username(), type(request.user.get_username()))

    return render(request, 'avatar.html', {'form': form, 'user': user})
    



def profile(request):
    posts = Post.objects.filter(username=request.user.get_username())
    profiles = Profile.objects.filter(username=request.user.get_username())
    context = {
        'profiles': profiles,
        'posts': posts,
    }

    return render(request, 'profile.html', context)


def productDescription(request):
    product = request.GET['product']
    username = request.GET['username']
    posts = Post.objects.filter(username=username, product=product)
    profiles = Profile.objects.filter(username=username)
    context = {
        'profiles': profiles,
        'posts': posts,
    }


    return render(request, 'product_description.html', context)
