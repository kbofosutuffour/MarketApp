# Generated by Django 4.1.7 on 2023-07-14 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='photo_id',
        ),
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.CharField(default='N/A', max_length=100),
        ),
    ]
