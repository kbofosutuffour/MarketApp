from django.db import models
from django.utils.translation import gettext_lazy as _
import datetime

"""
    Django models act as objects to represent a table of a database.  Creating a new model object creates a new instance in
    its corresponding table in the sqlite3 document.
"""


class Category(models.Model):
    category = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.category

class Post(models.Model):
    """
    Post table is used to hold data on post info

    Attributes:
        product (charfield): The name of the product
        username (charfield): The user who has created the post
        date (datetimefield): The date the post was initially created
        image (imagefield): An image the user has selected to represent the product
        description (textfield): A brief description of the product created by the user
        price (decimalfield): The selling price of the product
        draft (booleanfield): Whether or not a post is a draft
    """
    
    class Status(models.TextChoices):
        SELLING = "SELLING", _("SELLING")
        PENDING = "PENDING", _("PENDING")
        SOLD = "SOLD", _("SOLD")

    class Category(models.TextChoices):
        CLOTHING = "CLOTHING", _("CLOTHING")
        FURNITURE = "FURNITURE", _("FURNITURE")
        FREE_STUFF = "FREE STUFF", _("FREE STUFF")
        VEHICLES = "VEHICLES", _("VEHICLES")
        TECHNOLOGY = "TECHNOLOGY", _("TECHNOLOGY")
        HOBBIES = "HOBBIES", _("HOBBIES")
        OFFICE_SUPPLIES = "OFFICE SUPPLIES", _("OFFICE SUPPLIES")
        DORM_GOODS = "DORM_GOODS", _("DORM_GOODS")
        FOOD = "FOOD", _("FOOD")
        ENTERTAINMENT = "ENTERTAINMENT", _("ENTERTAINMENT")
        BOOKS = "BOOKS", _("BOOKS")
        MISC = "MISC.", _("MISC.")

        
    product = models.CharField(max_length=100)
    username = models.CharField(max_length=500, default=None)
    date = models.DateTimeField(auto_now=True)
    display_image = models.ImageField("Display Image:", upload_to="posts")
    description = models.TextField(max_length=1000, blank=True)
    price = models.DecimalField("Price:", decimal_places=2, max_digits=9)
    draft = models.BooleanField(blank=False, default=False)
    category = models.CharField(
        choices = Category.choices,
        default= Category.MISC,
        max_length=15
    )
    status = models.CharField(
        choices = Status.choices,
        default = Status.SELLING,
        max_length=8,
    )
    purchased_by = models.CharField(max_length=500, blank=True, null=True, default=None)

    def __str__(self) -> str:
        return self.product


class Profile(models.Model):
    """
    Profile table is used to hold data on profile info

    Attributes: 
        username (charfield): Name created by the user
        profile_picture (charfield): A user's selected profile picture
        first_name (charfield): A user's defined first name
        last_name (charfield): A user's defined last name
        email (charfield): A user's defined email
        saved_posts (manytomanyfield): A users list of saved posts
        drafts (manytomanyfield): A users list of drafted posts
    """
    username = models.CharField(max_length=500, default=None, unique=True)
    profile_picture = models.ImageField("Profile Picture", upload_to="profile_pictures", default=None)
    date = models.DateField(default=datetime.date.today)
    first_name = models.CharField(max_length=500, default=None, null=True, blank=True)
    last_name = models.CharField(max_length=500, default=None, null=True, blank=True)
    saved_posts = models.ManyToManyField(Post, blank=True, related_name="saved_posts")
    liked_posts = models.ManyToManyField(Post, blank=True, related_name="liked_posts")
    buy_history = models.ManyToManyField(Post, blank=True, related_name="buy_history")
    drafts = models.ManyToManyField(Post, blank=True, related_name="drafts")

    def __str__(self) -> str:
        return self.username

class Room(models.Model):

    """
    Room table is used to hold data on a conversation between two users
    """
    seller = models.CharField(max_length=500, default=None)
    seller_profile_picture = models.ImageField(verbose_name="seller_picture",upload_to="images/", blank=False)
    buyer = models.CharField(max_length=500, default=None)
    buyer_profile_picture = models.ImageField(verbose_name="buyer_picture",upload_to="images/", blank=False)
    product = models.CharField(max_length=100)
    image = models.ImageField("images/", default=None)

class Message(models.Model):
    """
    Message object is used to hold the data of a singular message
    """
    value = models.CharField(max_length=1000000)
    image = models.ImageField(upload_to="message_images", default=None, null=True)
    date = models.DateTimeField(default=datetime.datetime.now, blank=True)
    username = models.CharField(max_length=1000000)
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        default=None,
        null=True
    )


class Image(models.Model):
    """
    Image object is used to hold multiple images for a unique post object
    """
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        default=None,
        null=True
    )

    image1 = models.ImageField("images/", upload_to="posts", default=None)
    image2 = models.ImageField("images/", upload_to="posts", default=None)
    image3 = models.ImageField("images/", upload_to="posts", default=None)
    image4 = models.ImageField("images/", upload_to="posts", default=None)


class UserSettings(models.Model):
    """
    Table to store a users settings and notifications
    """
    username = models.OneToOneField(
        Profile,
        on_delete=models.CASCADE,
        primary_key=True
    )
    new_messages = models.BooleanField(blank=True, default=False)
    liked_posts_updates = models.BooleanField(blank=True, default=False)
    blocked_users = models.ManyToManyField(Profile, blank=True, related_name="blocked_users")

    # Violations
    scamming = models.BooleanField(blank=True, default=False)
    harassment = models.BooleanField(blank=True, default=False),
    illegal_goods = models.BooleanField(blank=True, default=False)


    
