# Generated by Django 4.1.7 on 2023-07-30 02:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0028_image_image3_image_image4'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='display_image',
            field=models.ImageField(default=None, upload_to='', verbose_name='Display Image'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='profile_picture',
            field=models.ImageField(default=None, upload_to='', verbose_name='Profile Picture'),
        ),
    ]