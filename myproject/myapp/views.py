
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from .models import Post, dP
from django.template import Context, Template
from django.http import JsonResponse
from .forms import *

# Create your views here.

# Create your views here.
def main(request):
    posts = Post.objects.all()

    return render(request, 'main.html', {'posts': posts})

def login(request):

    #If the user has hit submit
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        #authenticates the login information
        user = auth.authenticate(username=username, password=password) 

        #if the user is authenitcated, move to the main screen
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
    return redirect('main')

def avatar(request):
    return render(request, 'avatar.html')

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
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
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
    #if request.method == "POST":


        # photo = Photo.objects.create(image=product)
        # n_post = Post.objects.create(product=product, description=description, price=price, username=username)

        # messages.info(request, 'Your post has been created!')
        # posts = Post.objects.all()
        # product = request.POST['product']
        # description = request.POST['description']
        # price = request.POST['price']
        # username = request.user.get_username()

    form = PostForm(request.POST, request.FILES)
    if form.is_valid():
        np = form.save(commit=False)
        user = request.user.get_username()
        np.username = user
        np.save()
    else:
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

    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES)

        if form.is_valid():
            user = User.objects.get( username=request.user.get_username() )
            first = request.POST['first_name']
            last = request.POST['last_name']
            user.first_name = first
            user.last_name = last
            form.save()
    else:
        form = ProfileForm()
        return render(request, 'avatar.html')

    return redirect('login')

