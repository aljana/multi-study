# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0004_auto_20150105_0127'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizsession',
            name='active',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2015, 1, 5, 2, 45, 42, 494103)),
            preserve_default=True,
        ),
    ]
