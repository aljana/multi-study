# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0003_auto_20141224_2241'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='quiz',
            options={'verbose_name_plural': 'quizzes', 'ordering': ('recurrences',)},
        ),
        migrations.AlterField(
            model_name='quiz',
            name='start',
            field=models.TimeField(default=datetime.datetime(2014, 12, 25, 0, 28, 21, 71325)),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='quiz',
            name='state',
            field=django_fsm.FSMField(max_length=50, choices=[('CLOSED', 'Closed'), ('OPEN', 'Open'), ('PENDING', 'Pending')], default='CLOSED'),
            preserve_default=True,
        ),
    ]
