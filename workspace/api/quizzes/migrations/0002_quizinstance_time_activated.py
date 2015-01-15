# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.utils.timezone import utc
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizinstance',
            name='time_activated',
            field=models.DateTimeField(default=datetime.datetime(2015, 1, 15, 10, 39, 23, 597361, tzinfo=utc), blank=True),
            preserve_default=False,
        ),
    ]
