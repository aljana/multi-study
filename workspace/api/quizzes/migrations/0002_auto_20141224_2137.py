# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_fsm
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.time(21, 37, 54, 10572)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='quiz',
            name='state',
            field=django_fsm.FSMField(default='pending', editable=False, max_length=50),
            preserve_default=True,
        ),
    ]
