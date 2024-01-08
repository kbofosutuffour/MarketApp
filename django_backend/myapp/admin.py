from django.contrib import admin
from .models import *

"""
    Here, models are registered into the sqlite database, or in other words, tables are formatted in the sqlite database
"""

admin.site.register(Post)
admin.site.register(Profile)
admin.site.register(Room)
admin.site.register(Message)
admin.site.register(Image)
admin.site.register(Category)
admin.site.register(UserSettings)
admin.site.register(Report)
admin.site.register(Feedback)
admin.site.register(FlaggedPost)
admin.site.register(Rating)