from django.db import models
import datetime

# Create your models here.

class Post(models.Model):
    product = models.CharField(max_length=100)
    username = models.CharField(max_length=500, default=None)
    date = models.DateTimeField(auto_now=True)
    image = models.ImageField("images/", default=None)
    description = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=9)

class dP(models.Model):
    username = models.CharField(max_length=500, default=None)
    profile_picture = models.ImageField("images/", default=None)

