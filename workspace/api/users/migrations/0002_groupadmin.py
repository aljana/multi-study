# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupAdmin',
            fields=[
            ],
            options={
                'verbose_name_plural': 'Groups',
                'proxy': True,
                'verbose_name': 'Group',
            },
            bases=('auth.group',),
        ),
    ]
