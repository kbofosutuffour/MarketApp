# Generated by Django 4.1.7 on 2023-07-14 20:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_delete_postcount_remove_post_id_alter_photo_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='photo_id',
            new_name='id',
        ),
    ]
