# forms.py
from django import forms
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *

"""
	Django forms provides a concise way to lay out forms for a webpage, then save the information in the form in 
	a corresponding model (table in the sqlite database).  Allows users to upload images
"""


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):	
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput(attrs={
				'class': 'form-input-label',
			}))
        super().__init__(*args, **kwargs)
        
    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class PostSerializer(serializers.ModelSerializer):
    
	# additional_images = MultipleFileField()

	class Meta:
		model = Post
		fields = '__all__'
		# exclude = ['username', 'date', 'draft', 'sold', 'selling', 'pending']

                
	def __init__(self, *args, **kwargs):
		super(PostSerializer, self).__init__(*args, **kwargs)
		# self.fields['additional_images'].required = False
		# self.fields['status'].required = False
		

class ProfileSerializer(serializers.ModelSerializer):

	class Meta:
		model = Profile
		fields = '__all__'

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

class EditPostForm(serializers.ModelSerializer):

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date', 'sold', 'selling', 'pending']

	def __init__(self, *args, **kwargs):
		super(EditPostForm, self).__init__(*args, **kwargs)
		# self.fields['additional_images'].required = False
		self.fields['status'].required = False
		

class RoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):

	class Meta:
		model = Message
		fields = '__all__'


