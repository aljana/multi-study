# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_fsm
import recurrence.fields
import api.quizzes.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('order', models.PositiveIntegerField()),
                ('text', models.TextField(verbose_name='Text')),
                ('score', models.IntegerField(default=0, verbose_name='Score')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('title', models.CharField(max_length=120, verbose_name='Title')),
                ('order', models.PositiveIntegerField()),
                ('description', models.TextField(blank=True, null=True, verbose_name='Description')),
                ('type', models.CharField(max_length=50, choices=[('open', 'Open')], verbose_name='Question type')),
                ('time_limit', models.IntegerField(default=60, verbose_name='Time limit')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date created')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuizInstance',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('state', django_fsm.FSMField(max_length=50, choices=[('scheduled', 'Scheduled'), ('closed', 'Closed'), ('open', 'Open'), ('active', 'Active')], default='scheduled')),
                ('time_created', models.DateTimeField(auto_now_add=True)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('participants', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
                ('question', models.ForeignKey(to='quizzes.Question', null=True)),
            ],
            options={
                'verbose_name_plural': 'Instantiated Quizzes',
                'ordering': ('date_created',),
                'verbose_name': 'Instantiated Quiz',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuizSchedule',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('title', models.CharField(max_length=120, verbose_name='Title')),
                ('start', models.TimeField(default=api.quizzes.models.now_plus_1_hour)),
                ('recurrences', recurrence.fields.RecurrenceField()),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Scheduled Quizzes',
                'ordering': ('recurrences',),
                'verbose_name': 'Scheduled Quiz',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SubmittedAnswer',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('text', models.TextField(verbose_name='Text')),
                ('score', models.IntegerField(default=0, verbose_name='Score')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date submitted')),
                ('question', models.ForeignKey(to='quizzes.Question')),
                ('quiz', models.ForeignKey(to='quizzes.QuizInstance')),
                ('ref_answer', models.ForeignKey(blank=True, to='quizzes.Answer', null=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='quizinstance',
            name='schedule',
            field=models.ForeignKey(to='quizzes.QuizSchedule'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='schedule',
            field=models.ForeignKey(to='quizzes.QuizSchedule'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(related_name='answers', to='quizzes.Question'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='answer',
            name='schedule',
            field=models.ForeignKey(to='quizzes.QuizSchedule'),
            preserve_default=True,
        ),
    ]
