# Generated by Django 4.1.7 on 2023-07-25 03:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0019_alter_convo_id_delete_chatroom_delete_message'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='messages',
        ),

    ]
