# Generated by Django 4.1.7 on 2023-08-14 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0033_profile_saved_posts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='saved_posts',
            field=models.ManyToManyField(default=None, to='myapp.post'),
        ),
    ]
