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
    image = models.ImageField("images/", default=None)
    description = models.TextField(max_length=1000, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=9)

class Profile(models.Model):
    """
    Profile table is used to hold data on profile info

    Attributes: 
        username (charfield): Name created by the user
        profile_picture (charfield): A user's selected profile picture 
    """
    username = models.CharField(max_length=500, default=None)
    profile_picture = models.ImageField("images/", default=None)

