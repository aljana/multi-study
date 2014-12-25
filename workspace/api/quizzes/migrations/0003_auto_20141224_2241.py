# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0002_auto_20141224_2137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2014, 12, 24, 23, 41, 28, 455607)),
            preserve_default=True,
        ),
    ]
