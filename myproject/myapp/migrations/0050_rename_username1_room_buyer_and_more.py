# Generated by Django 4.2.4 on 2023-10-16 18:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0049_post_category'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='username1',
            new_name='buyer',
        ),
        migrations.RenameField(
            model_name='room',
            old_name='profile_picture1',
            new_name='buyer_profile_picture',
        ),
        migrations.RenameField(
            model_name='room',
            old_name='username2',
            new_name='seller',
        ),
        migrations.RenameField(
            model_name='room',
            old_name='profile_picture2',
            new_name='seller_profile_picture',
        ),
    ]
