# Generated by Django 4.1.7 on 2023-07-14 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_postcount_remove_photo_url_remove_post_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postcount',
            name='id',
            field=models.IntegerField(default=0, primary_key=True, serialize=False),
        ),
    ]