# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0005_auto_20141224_2330'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='quiz',
            options={'verbose_name': 'quiz', 'verbose_name_plural': 'quizzes', 'ordering': ('recurrences',)},
        ),
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2014, 12, 25, 0, 34, 25, 405812)),
            preserve_default=True,
        ),
    ]
