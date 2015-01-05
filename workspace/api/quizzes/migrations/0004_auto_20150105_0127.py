# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import datetime


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('quizzes', '0003_auto_20150105_0014'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizsession',
            name='users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2015, 1, 5, 2, 27, 7, 767046)),
            preserve_default=True,
        ),
    ]
