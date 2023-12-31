# Generated by Django 4.2.4 on 2023-09-23 02:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0040_post_draft_profile_drafts'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hashtag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hashtag', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='post',
            name='pending',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='post',
            name='selling',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='post',
            name='sold',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='post',
            name='hashtags',
            field=models.ManyToManyField(to='myapp.hashtag'),
        ),
    ]
