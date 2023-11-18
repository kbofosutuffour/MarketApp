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


class PostForm(forms.ModelForm):
    
	additional_images = MultipleFileField()

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date', 'draft', 'sold', 'selling', 'pending']
		widgets = {
			'product': forms.TextInput(attrs={
				'placeholder': 'Product',
				'class': 'form-input'
			}),
			'display_image': forms.FileInput(attrs={
				'class': 'form-input-label'
			}),
			'description': forms.Textarea(attrs={
				'placeholder': 'Description',
				'class': 'form-input'
			}),
			'price': forms.NumberInput(attrs={
				'plsceholder': 'Price',
				'class': 'form-input-label'
			}),
		}
                
	def __init__(self, *args, **kwargs):
		super(PostForm, self).__init__(*args, **kwargs)
		self.fields['additional_images'].required = False
		self.fields['status'].required = False
		

class ProfileForm(forms.ModelForm):

	class Meta:
		model = Profile
		fields = '__all__'
		exclude = ['username', 'saved_posts']



class EditPostForm(forms.ModelForm):

	class Meta:
		model = Post
		fields = '__all__'
		exclude = ['username', 'date', 'sold', 'selling', 'pending']
		widgets = {
			'product': forms.TextInput(attrs={
				'placeholder': 'Product',
				'class': 'form-input'
			}),
			'display_image': forms.FileInput(attrs={
				'class': 'form-input-label'
			}),
			'description': forms.Textarea(attrs={
				'placeholder': 'Description',
				'class': 'form-input'
			}),
			'price': forms.NumberInput(attrs={
				'plsceholder': 'Price',
				'class': 'form-input-label'
			}),
		}

	def __init__(self, *args, **kwargs):
		super(EditPostForm, self).__init__(*args, **kwargs)
		self.fields['additional_images'].required = False
		self.fields['status'].required = False
		


class MessageForm(forms.ModelForm):

	class Meta:
		model = Message
		fields = '__all__'
		exclude = ['date', 'username', 'room']
		widgets = {
			'value': forms.TextInput(attrs={
				'placeholder': 'Type your message here',
				'id': 'keyboard-text',
			}),
		}
	
	def __init__(self, *args, **kwargs):
		super(MessageForm, self).__init__(*args, **kwargs)
		self.fields['value'].required = False
		self.fields['image'].required = False

