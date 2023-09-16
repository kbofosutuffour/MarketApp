# forms.py
from django import forms
from .models import *

"""
	Django forms provides a concise way to lay out forms for a webpage, then save the information in the form in 
	a corresponding model (table in the sqlite database).  Allows users to upload images
"""


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)
        
    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class PostForm(forms.ModelForm):
    
	additional_images = MultipleFileField()
	# additional_images = forms.ImageField(required=False, label="Additional Images", widget=MultipleFileInput())
	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date', 'draft']
                
	def __init__(self, *args, **kwargs):
		super(PostForm, self).__init__(*args, **kwargs)
		self.fields['additional_images'].required = False
		

class ProfileForm(forms.ModelForm):

	class Meta:
		model = Profile
		fields = '__all__'
		exclude = ['username', 'saved_posts']


class EditPostForm(forms.ModelForm):

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date']


