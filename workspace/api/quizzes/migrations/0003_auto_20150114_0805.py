# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0002_auto_20150113_1759'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='type',
            field=models.CharField(verbose_name='Question type', choices=[('open', 'Open'), ('closed', 'Closed')], max_length=50),
            preserve_default=True,
        ),
    ]
