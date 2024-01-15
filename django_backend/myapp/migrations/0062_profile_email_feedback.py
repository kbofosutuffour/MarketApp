# Generated by Django 5.0 on 2024-01-04 01:55

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0061_remove_image_id_usersettings_show_joined_date_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="email",
            field=models.EmailField(default="none@gmail.com", max_length=254),
        ),
        migrations.CreateModel(
            name="Feedback",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "datetime",
                    models.DateTimeField(blank=True, default=datetime.datetime.now),
                ),
                ("content", models.TextField(blank=True, max_length=1000)),
                (
                    "username",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="feedback_username",
                        to="myapp.profile",
                    ),
                ),
            ],
        ),
    ]
