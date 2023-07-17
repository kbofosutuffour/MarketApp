# forms.py
from django import forms
from .models import *


class PostForm(forms.ModelForm):

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date']

class ProfileForm(forms.ModelForm):

	class Meta:
		model = dP
		fields = '__all__'
