# Generated by Django 4.1.7 on 2023-07-15 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_alter_photo_id_alter_post_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(default='N/A', upload_to='', verbose_name='images/'),
        ),
    ]
