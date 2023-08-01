# forms.py
from django import forms
from .models import *

"""
	Django forms provides a concise way to lay out forms for a webpage, then save the information in the form in 
	a corresponding model (table in the sqlite database).  Allows users to upload images
"""

class PostForm(forms.ModelForm):
	additional_images = forms.ImageField(required=False, label="Additional Images", widget=forms.ClearableFileInput(attrs={'multiple': True}))

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date']
	
	# def save(self, commit=True):
	# 	return super(PostForm, self).save(commit=commit)


class ProfileForm(forms.ModelForm):

	class Meta:
		model = Profile
		fields = '__all__'
		exclude = ['username']

class EditPostForm(forms.ModelForm):

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date']


