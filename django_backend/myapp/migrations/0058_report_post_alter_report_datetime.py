# Generated by Django 5.0 on 2023-12-23 18:40

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0057_usersettings_already_sold_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="report",
            name="post",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="post",
                to="myapp.post",
            ),
        ),
        migrations.AlterField(
            model_name="report",
            name="datetime",
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]