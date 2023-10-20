# Generated by Django 4.2.4 on 2023-09-23 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0042_rename_hashtag_category_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='hashtags',
            new_name='category',
        ),
        migrations.AlterField(
            model_name='post',
            name='display_image',
            field=models.ImageField(upload_to='posts', verbose_name='Display Image:'),
        ),
        migrations.AlterField(
            model_name='post',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=9, verbose_name='Price:'),
        ),
    ]