# Generated by Django 4.1.7 on 2023-08-01 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0030_alter_image_image1_alter_image_image2_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image1',
            field=models.ImageField(default=None, upload_to='posts', verbose_name='images/'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image2',
            field=models.ImageField(default=None, upload_to='posts', verbose_name='images/'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image3',
            field=models.ImageField(default=None, upload_to='posts', verbose_name='images/'),
        ),
        migrations.AlterField(
            model_name='image',
            name='image4',
            field=models.ImageField(default=None, upload_to='posts', verbose_name='images/'),
        ),
        migrations.AlterField(
            model_name='post',
            name='display_image',
            field=models.ImageField(default=None, upload_to='posts', verbose_name='Display Image'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='profile_picture',
            field=models.ImageField(default=None, upload_to='profile_pictures', verbose_name='Profile Picture'),
        ),
    ]