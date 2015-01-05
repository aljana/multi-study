# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0002_auto_20150104_2131'),
    ]

    operations = [
        migrations.DeleteModel(
            name='QuizQuestionResults',
        ),
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2015, 1, 5, 1, 14, 44, 325522)),
            preserve_default=True,
        ),
    ]
