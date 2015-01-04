# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django_fsm
import datetime
from django.conf import settings
import recurrence.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name='Text')),
                ('score', models.IntegerField(verbose_name='Score', default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(verbose_name='Title', max_length=120)),
                ('description', models.TextField(verbose_name='Description', null=True, blank=True)),
                ('type', models.CharField(verbose_name='Question type', choices=[('open', 'Open')], max_length=50)),
                ('time_limit', models.IntegerField(verbose_name='Time limit', default=60)),
                ('created', models.DateTimeField(verbose_name='Date created', auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(verbose_name='Title', max_length=120)),
                ('state', django_fsm.FSMField(choices=[('closed', 'Closed'), ('open', 'Open'), ('pending', 'Pending')], default='closed', max_length=50)),
                ('start', models.TimeField(default=datetime.datetime(2015, 1, 4, 22, 26, 52, 216047))),
                ('recurrences', recurrence.fields.RecurrenceField()),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'quiz',
                'verbose_name_plural': 'quizzes',
                'ordering': ('recurrences',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuizQuestionResults',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuizSession',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('current_question', models.ForeignKey(null=True, to='quizzes.Question')),
                ('quiz', models.ForeignKey(to='quizzes.Quiz')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SubmittedAnswer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name='Text')),
                ('score', models.IntegerField(verbose_name='Score', default=0)),
                ('created', models.DateTimeField(verbose_name='Date submitted', auto_now_add=True)),
                ('question', models.ForeignKey(to='quizzes.Question')),
                ('quiz_session', models.ForeignKey(to='quizzes.QuizSession')),
                ('ref_answer', models.ForeignKey(null=True, blank=True, to='quizzes.Answer')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(to='quizzes.Quiz'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(related_name='answers', to='quizzes.Question'),
            preserve_default=True,
        ),
    ]
