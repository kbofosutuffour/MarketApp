# Generated by Django 4.1.7 on 2023-07-28 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0025_alter_message_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='username',
            field=models.CharField(default=None, max_length=500, unique=True),
        ),
    ]
