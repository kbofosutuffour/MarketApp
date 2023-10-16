# Generated by Django 4.2.4 on 2023-10-16 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0050_rename_username1_room_buyer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='buyer_profile_picture',
            field=models.ImageField(default=None, upload_to='images/', verbose_name='buyer_picture'),
        ),
        migrations.AlterField(
            model_name='room',
            name='seller_profile_picture',
            field=models.ImageField(default=None, upload_to='images/', verbose_name='seller_picture'),
        ),
    ]
