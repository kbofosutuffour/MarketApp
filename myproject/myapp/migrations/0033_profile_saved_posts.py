# Generated by Django 4.1.7 on 2023-08-14 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0032_profile_first_name_profile_last_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='saved_posts',
            field=models.ManyToManyField(default=None, null=True, to='myapp.post'),
        ),
    ]
