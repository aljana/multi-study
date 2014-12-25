# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0004_auto_20141224_2328'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2014, 12, 25, 0, 30, 31, 832251)),
            preserve_default=True,
        ),
    ]
