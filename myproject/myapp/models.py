from django.db import models
import datetime

"""
    Django models act as objects to represent a table of a database.  Creating a new model object creates a new instance in
    its corresponding table in the sqlite3 document.
"""

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
    """

    product = models.CharField(max_length=100)
    username = models.CharField(max_length=500, default=None)
    date = models.DateTimeField(auto_now=True)
    display_image = models.ImageField("Display Image", upload_to="posts", default=None)
    description = models.TextField(max_length=1000, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=9)

class Profile(models.Model):
    """
    Profile table is used to hold data on profile info

    Attributes: 
        username (charfield): Name created by the user
        profile_picture (charfield): A user's selected profile picture 
    """
    username = models.CharField(max_length=500, default=None, unique=True)
    profile_picture = models.ImageField("Profile Picture", upload_to="profile_pictures", default=None)
    # first_name = models.CharField(max_length=500, default=None, null=True, blank=True)
    # last_name = models.CharField(max_length=500, default=None, null=True, blank=True)

class Room(models.Model):

    """
    Room table is used to hold data on a conversation between two users
    """
    username1 = models.CharField(max_length=500, default=None)
    profile_picture1 = models.ImageField("images/", default=None)
    username2 = models.CharField(max_length=500, default=None)
    profile_picture2 = models.ImageField("images/", default=None)
    product = models.CharField(max_length=100)
    image = models.ImageField("images/", default=None)

class Message(models.Model):
    """
    Message object is used to hold the data of a singular message
    """
    value = models.CharField(max_length=1000000)
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



    



