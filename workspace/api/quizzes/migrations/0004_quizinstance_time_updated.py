# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.utils.timezone import utc
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0003_auto_20150115_1140'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizinstance',
            name='time_updated',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2015, 1, 15, 11, 6, 26, 873616, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
