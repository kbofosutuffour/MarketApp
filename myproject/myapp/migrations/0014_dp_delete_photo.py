# Generated by Django 4.1.7 on 2023-07-15 20:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0013_post_date_alter_post_description_alter_post_price_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='dP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(default=None, max_length=500)),
                ('profile_picture', models.ImageField(default=None, upload_to='', verbose_name='images/')),
            ],
        ),
        migrations.DeleteModel(
            name='Photo',
        ),
    ]