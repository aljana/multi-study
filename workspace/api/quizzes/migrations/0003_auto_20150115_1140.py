# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0002_quizinstance_time_activated'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quizinstance',
            name='time_activated',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
