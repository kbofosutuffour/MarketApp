# Generated by Django 5.0 on 2023-12-23 18:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0056_profile_date_usersettings"),
    ]

    operations = [
        migrations.AddField(
            model_name="usersettings",
            name="already_sold",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="damaged_product",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="harassment",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="language",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="nickname",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="noShow",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="postName",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.CreateModel(
            name="Report",
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
                ("datetime", models.DateTimeField(auto_now=True)),
                (
                    "violation",
                    models.CharField(
                        choices=[
                            ("SCAMMING", "SCAMMING"),
                            ("HARASSMENT", "HARASSMENT"),
                            ("ILLEGAL GOODS", "ILLEGAL GOODS"),
                            ("NICKNAME", "NICKNAME"),
                            ("LANGUAGE", "LANGUAGE"),
                            ("NO SHOW", "NO SHOW"),
                            ("POST NAME", "POST NAME"),
                            ("DAMAGED PRODUCT", "DAMAGED PRODUCT"),
                            ("ALREADY SOLD", "ALREADY SOLD"),
                        ],
                        max_length=100,
                    ),
                ),
                (
                    "profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to="myapp.profile",
                    ),
                ),
                (
                    "reported_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reported_by",
                        to="myapp.profile",
                    ),
                ),
            ],
        ),
    ]
