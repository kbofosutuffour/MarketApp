
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
        print(serializer.data)
        return Response(serializer.data)
    
    def create(self, request):
        print('testing')
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            new_post = serializer.save()
            print(new_post.id, 'post_id')
            return Response({'message': 'You have successfully created your post', 'post_id': new_post.id})
        else:
            print(serializer.errors, 'error')
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
        print(request.data)
        if serializer.is_valid():
            profile = serializer.save()
            self.updateChats(profile, request.data)
            return Response({'message': 'You have successfully edited your profile', 'status': 200})
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors, 'status': 400})
        
    
    def updateChats(self, profile, request):
        """
        Method used to replace all profile pictures in chat rooms to most up-to-date
        profile picture for a user
        """
        buyerRooms = Room.objects.filter(buyer=profile.username)
        for room in buyerRooms:
            room.buyer_profile_picture = profile.profile_picture
            room.save()

        sellerRooms = Room.objects.filter(seller=profile.username)
        for room in sellerRooms:
            room.seller_profile_picture = profile.profile_picture
            room.save()


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
            new_post = serializer.save()
            return Response({'message': 'You have successfully created your post', 'post_id': new_post.id})
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

    # profiles = Profile.objects.all()
    # response = []
    # for profile in profiles:
    #     data = {}
    #     data.id = profile.id
    #     data.username = profile.username
    #     data.profile_picture = profile.profile_picture
    #     data.email = 'test'
    #     data.first_name = profile.first_name
    #     data.last_name = profile.last_name
    #     data.date = str(profile.date)

    #     posts = profile.liked_posts.all()
    #     post_ids = []
    #     for post in posts:
    #         post_ids.append(post.id)
    #     data.liked_posts = post_ids
    #     response.append(data)
    # print('different profile get')
    # return Response({"data": response})

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        print(instance)
        return Response(serializer.data)
    

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

    @action(methods=['get'], detail=False, url_path=r'get_date_created/(?P<username>\w+)')
    def get_date_created(self, request, username, *args, **kwargs):

        profile = Profile.objects.get(username=username)
        return Response({'date': profile.date})
    
    def create(self, request):
        serializer = ProfileSerializer(data=request.data)
        try:
            exists = Profile.objects.get(username=request.data['username'])
        except:
            exists = False
        if serializer.is_valid() and not exists:
            #create the profile
            profile = serializer.save()
            return Response({'message': 'You have successfully created a profile', 'id': profile.id})
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

        #authenticates the login information
        user = auth.authenticate(username=request.data['username'], password=request.data['password']) 

        #authenticates the user and checks if user has a profile
        if user is not None:
            #auth.login(request, user)
            user = User.objects.get(username=request.data['username'])
            print(user.is_staff, 'isadmin')
            try:
                Profile.objects.get(username=request.data['username'])
            except:
                return Response({'login': 1, 'register': 1, 'message': 'login successful'})
            
            return Response({
                'login': 1,
                'register': 0,
                'message': 'login successful, redirect to registration page',
                'admin': user.is_staff
            })
        
        #else, reload the login screen and display error message
        else:
            return Response({'login': 0, 'message': 'credentials invalid'})
        
    @action(methods=['post'], detail=False)
    def verify(self, request, *args, **kwargs):

        code = random.randint(0,99999)
        code = str(code)
        send_code(request, code, request.data['email'])
        return Response({'code': code})
    
    @action(methods=['post'], detail=False)
    def change_password(self, request, *args, **kwargs):
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

class UserSettingsViewSet(viewsets.ModelViewSet):

    queryset = UserSettings.objects.all()
    serializer_class = UserSettingsSerializer

    @action(methods=['patch'], detail=False, url_path=r'new_messages/(?P<username>\w+)')
    def new_messages(self, request, username=None):
        """
        Changing the liked post settings of a post
        """
        try:
            settings = UserSettings.objects.get(pk=username)
            settings.new_messages = request.data['new_messages']
            settings.save()
            return Response({'message': 'You have successfully edited your profile settings'})
        except:
            print('error')
            return Response({'error': 'There was an error editing your profile settings.  Please try again.'})

    @action(methods=['patch'], detail=False, url_path=r'liked_posts/(?P<username>\w+)')
    def liked_posts(self, request, username=None):
        """
        Changing the liked post settings of a post
        """
        try:
            settings = UserSettings.objects.get(pk=username)
            settings.liked_posts_updates = request.data['liked_post_updates']
            settings.save()
            return Response({'message': 'You have successfully edited your profile settings'})
        except:
            print('error')
            return Response({'error': 'There was an error editing your profile settings.  Please try again.'})


    @action(methods=['patch'], detail=False, url_path=r'show_joined_date/(?P<username>\w+)')
    def show_joined_date(self, request, username=None):
        """
        Changing the liked post settings of a post
        """
        try:
            settings = UserSettings.objects.get(pk=username)
            settings.show_joined_date = request.data['show_joined_date']
            settings.save()
            return Response({'message': 'You have successfully edited your profile settings'})
        except:
            print('error')
            return Response({'error': 'There was an error editing your profile settings.  Please try again.'})

class ReportViewSet(viewsets.ModelViewSet):

    queryset = Report.objects.all()
    serializer_class = ReportSerializer

class ImageViewSet(viewsets.ModelViewSet):

    queryset = Image.objects.all()
    serializer_class = ImageSerializer

class FeedbackViewSet(viewsets.ModelViewSet):

    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        send_feedback_email(request.data)
        return Response(serializer.data)

class RatingViewSet(viewsets.ModelViewSet):

    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Only save the rating if the user hasn't already rated the user
        rating = Rating.objects.get(
            username=request.data['username'],
            rated_by = request.data["rated_by"]
        )
        if rating:
            rating.rating = request.data["score"]
            rating.save()
        else:
            self.perform_create(serializer)

        return Response(serializer.data)
    
    @action(methods=['get'], detail=False, url_path=r'get_rating/(?P<username>\w+)')
    def get_rating(self, request, username):
        ratings = Rating.objects.filter(username=username)
        total_number = len(ratings)
        total_score = 0
        for rating in ratings:
            total_score = total_score + rating.rating
        if total_number == 0:
            return Response({"error": "no rating"})
        
        return Response({
            "rating": total_score / total_number,
            "total_score": total_score,
            "total_number": total_number
        })

class FlaggedPostViewSet(viewsets.ModelViewSet):

    queryset = FlaggedPost.objects.all()
    serializer_class = FlaggedPostSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Only save the flag if the user hasn't already flagged the post
        exists = FlaggedPost.objects.get(
            post=request.data['post'],
            flagged_by = request.data["flagged_by"]
        )
        if not exists:
            self.perform_create(serializer)

        flags = FlaggedPost.objects.filter(post=request.data['post'])
        print(len(flags), "number of flags")
        return Response({"number_of_flags": len(flags)})
    
class ViolationViewSet(viewsets.ModelViewSet):

    queryset = Violation.objects.all()
    serializer_class = ViolationSerializer

    @action(methods=['get'], detail=False, url_path=r'get_violations/(?P<username>\w+)')
    def get_violations(self, request, username):
        violations = []
        try:
            violation_list = Violation.objects.filter(username=username)
            for val in violation_list:
                data = {}
                data['id'] = val.id
                data['username'] = val.username.id
                data['type'] = val.type
                data['appeal'] = val.appeal
                violations.append(data)
        finally:
            return Response({'violations': violations})
    
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        self.update(request, *args, **kwargs)
        send_appeal(request.data)
        return Response({'message': 'Appeal sent'})
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

def send_feedback_email(feedback):
    """
    Function used to send the user their verification code via email
    """
    number = len(Feedback.objects.all())

    date = datetime.datetime.now()
    date = date.strftime("%B %d, %Y")
    message = f"""
    Title: User Feedback #{number}

    Date: {datetime.datetime.now()}
    From: {feedback['first_name']} {feedback['last_name']}
    Username: {feedback['username']}
    Email: {feedback['email']}

    Content: {feedback['content']}
    """

    #send user an email
    send_mail(
        subject="User Feedback #" + str(number),
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['marketappwm@gmail.com']
    )

def send_appeal(appeal):
    """
    Function used whenever a user appeals a violation.
    Sends the appeal information to the marketapp email
    """
    violation = Violation.objects.get(id=appeal['id'])
    profile = Profile.objects.get(username=violation.username)
    number = len(Violation.objects.all())
    date = datetime.datetime.now()
    date = date.strftime("%B %d, %Y")

    # Getting all reports from the user relating
    # to the given violation
    reports = Report.objects.filter(
        profile=violation.username,
        violation=violation.type
    )

    # creating a list of reports to make printable 
    # in the outgoing email
    list_of_reports = []
    for report in reports:
        data = {}
        data['Profile'] = report.profile.username
        data['Post'] = str(Post.objects.get(id=report.post.id))
        data['Date'] = str(report.datetime)
        data['Reported By'] = report.reported_by.username
        list_of_reports.append(data)

    # An attempt at formatting
    reports = ''
    for item in list_of_reports:
        reports = reports + str(item) + '\n'

    message = f"""
    Title: Violation Appeal #{number}

    Date: {datetime.datetime.now()}
    From: {profile.first_name} {profile.last_name}
    Username: {profile.username}
    Email: {profile.email}

    The user {profile.username} has appealed the following violation: 
        {violation.type}

    Here is a list of reports relating to this violation:
    {reports}
    """

    send_mail(
        subject="Violation Appeal #" + str(number),
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['marketappwm@gmail.com']
    )

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
    View used for the functionality of the profile page (profile.html)
    """
    try:
        profile = Profile.objects.get(username=user)
        posts = profile.liked_posts.all()
        liked_posts = []
        for post in posts:
            liked_posts.append(post.id)
        drafts = list(profile.drafts.all())
        hasProfile = True
        context = {
            'id': profile.id,
            'hasProfile': hasProfile,
            'username': user,
            'profile_picture': profile.profile_picture.url,
            'first_name': profile.first_name,
            'last_name': profile.last_name,
            'date': profile.date,
            'email': profile.email,
            'liked_posts': liked_posts,
            'drafts': drafts,
        }
    except: 
        hasProfile = False
        context = {
            'error': 'Error retrieving the profile'
        }

    return Response(context)
