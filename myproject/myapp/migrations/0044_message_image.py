# Generated by Django 4.2.4 on 2023-09-23 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0043_rename_hashtags_post_category_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='image',
            field=models.ImageField(default=None, null=True, upload_to='message_images'),
        ),
    ]
