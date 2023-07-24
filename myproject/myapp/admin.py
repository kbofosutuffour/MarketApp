from django.contrib import admin
from .models import *

"""
    Here, models are registered into the sqlite database, or in other words, tables are formatted in the sqlite database
"""

admin.site.register(Post)
admin.site.register(Profile)