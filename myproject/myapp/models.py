from django.db import models

# Create your models here.

class Post(models.Model):
    id = models.IntegerField(primary_key=True)
    product = models.CharField(max_length=100)
    username = models.CharField(max_length=500, default="empty string")
    description = models.CharField(max_length=100)
    price = models.IntegerField()

class Photo(models.Model):
    id = models.IntegerField(primary_key=True)
    image = models.CharField(max_length=100, default="N/A")

# class PostCount(models.Model):
#     id = models.IntegerField(default=0, primary_key=True)
#     count = models.IntegerField(default=-1)