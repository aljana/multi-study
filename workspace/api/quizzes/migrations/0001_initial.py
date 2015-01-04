# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import recurrence.fields
import datetime
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('title', models.CharField(max_length=254)),
                ('text', models.TextField()),
                ('order', models.PositiveIntegerField()),
                ('duration', models.PositiveIntegerField(default=5)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('title', models.CharField(max_length=120, verbose_name='Title')),
                ('state', django_fsm.FSMField(default='closed', choices=[('closed', 'Closed'), ('open', 'Open'), ('pending', 'Pending')], max_length=50)),
                ('start', models.TimeField(default=datetime.datetime(2014, 12, 25, 13, 0, 52, 146512))),
                ('recurrences', recurrence.fields.RecurrenceField()),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'quiz',
                'ordering': ('recurrences',),
                'verbose_name_plural': 'quizzes',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(to='quizzes.Quiz'),
            preserve_default=True,
        ),
    ]
