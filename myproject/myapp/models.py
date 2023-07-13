from django.db import models

# Create your models here.

class Post(models.Model):
    photo_id = models.IntegerField()
    product = models.CharField(max_length=100)
    username = models.CharField(max_length=500, default="empty string")
    description = models.CharField(max_length=100)
    price = models.IntegerField()

class Photo(models.Model):
    url = models.CharField(max_length=1000, default="empty_string")