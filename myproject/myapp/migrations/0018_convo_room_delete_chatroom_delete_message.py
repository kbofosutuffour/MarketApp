# Generated by Django 4.1.7 on 2023-07-25 03:04

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0017_message_chatroom'),
    ]

    operations = [
        migrations.CreateModel(
            name='Convo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=1000000)),
                ('date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('username', models.CharField(max_length=1000000)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username1', models.CharField(default=None, max_length=500)),
                ('profile_picture1', models.ImageField(default=None, upload_to='', verbose_name='images/')),
                ('username2', models.CharField(default=None, max_length=500)),
                ('profile_picture2', models.ImageField(default=None, upload_to='', verbose_name='images/')),
                ('product', models.CharField(max_length=100)),
                ('image', models.ImageField(default=None, upload_to='', verbose_name='images/')),
                ('messages', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, to='myapp.convo')),
            ],
        ),

    ]
