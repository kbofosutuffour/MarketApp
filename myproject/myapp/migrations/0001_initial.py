# Generated by Django 4.1.7 on 2023-07-14 17:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.CharField(default='empty_string', max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo_id', models.IntegerField()),
                ('product', models.CharField(max_length=100)),
                ('username', models.CharField(default='empty string', max_length=500)),
                ('description', models.CharField(max_length=100)),
                ('price', models.IntegerField()),
            ],
        ),
    ]
