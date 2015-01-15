import datetime
import json

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_fsm import FSMField, transition
from recurrence.fields import RecurrenceField

import redis


def now_plus_1_hour():
    return datetime.datetime.now() + datetime.timedelta(hours=1)


class QuizSchedule(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    title = models.CharField(_('Title'), max_length=120)
    start = models.TimeField(default=now_plus_1_hour)
    recurrences = RecurrenceField()

    class Meta:
        verbose_name = _('Scheduled Quiz')
        verbose_name_plural = _('Scheduled Quizzes')
        ordering = ('recurrences',)

    def __str__(self):
        return self.title


class QuizInstance(models.Model):
    class STATES:
        CREATED = 'created'
        DELETED = 'deleted'
        OPEN = 'open'
        CLOSED = 'closed'
        ACTIVE = 'active'
        SCHEDULED = 'scheduled'

    STATE_CHOICES = (
        (STATES.SCHEDULED, 'Scheduled'),
        (STATES.CLOSED, 'Closed'),
        (STATES.OPEN, 'Open'),
        (STATES.ACTIVE, 'Active'),
    )

    schedule = models.ForeignKey(QuizSchedule)
    state = FSMField(default=STATES.SCHEDULED, choices=STATE_CHOICES)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL)
    question = models.ForeignKey('Question', null=True)
    time_created = models.DateTimeField(auto_now_add=True, blank=True)
    time_activated = models.DateTimeField(blank=True, null=True)
    time_updated = models.DateTimeField(auto_now=True)
    date_created = models.DateField(auto_now_add=True, blank=True)

    class Meta:
        verbose_name = _('Instantiated Quiz')
        verbose_name_plural = _('Instantiated Quizzes')
        ordering = ('date_created',)

    @transition(field=state, source=STATES.SCHEDULED, target=STATES.OPEN)
    def open(self):
        message = {
            'pk': self.pk,
            'model': 'QuizInstance',
            'action': 'change-state',
            'state': QuizInstance.STATES.OPEN
        }
        r = redis.StrictRedis(
            host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
            port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
            db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
        r.publish('quiz:public', json.dumps(message))

    @transition(field=state, source=STATES.OPEN, target=STATES.ACTIVE)
    def activate(self):
        self.time_activated = datetime.datetime.now()
        message = {
            'pk': self.pk,
            'model': 'QuizInstance',
            'action': 'change-state',
            'state': QuizInstance.STATES.ACTIVE
        }
        r = redis.StrictRedis(
            host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
            port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
            db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
        r.publish('quiz:public', json.dumps(message))


    @transition(field=state, source=STATES.ACTIVE, target=STATES.CLOSED)
    def close(self):
        message = {
            'pk': self.pk,
            'model': 'QuizInstance',
            'action': 'change-state',
            'state': QuizInstance.STATES.CLOSED
        }
        r = redis.StrictRedis(
            host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
            port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
            db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
        r.publish('quiz:public', json.dumps(message))

    def save(self, *args, **kwargs):
        new_instance = not self.pk
        super(QuizInstance, self).save(*args, **kwargs)
        if new_instance:
            message = {
                'pk': self.pk,
                'model': 'QuizInstance',
                'action': 'change-state',
                'state': QuizInstance.STATES.CREATED
            }
            r = redis.StrictRedis(
                host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
                port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
                db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
            r.publish('quiz:public', json.dumps(message))

    def __str__(self):
        return self.schedule.title


class Question(models.Model):
    DEFAULT_TIME_LIMIT = 60

    class QuestionType:
        OPEN = 'open'

    TYPE_CHOICES = (
        (QuestionType.OPEN, 'Open'),
    )

    schedule = models.ForeignKey(QuizSchedule)
    title = models.CharField(_('Title'), max_length=120)
    order = models.PositiveIntegerField()
    description = models.TextField(_('Description'), null=True, blank=True)
    type = models.CharField(_('Question type'), choices=TYPE_CHOICES,
                            max_length=50)
    time_limit = models.IntegerField(_('Time limit'),
                                     default=DEFAULT_TIME_LIMIT)
    date_created = models.DateTimeField(_('Date created'), auto_now_add=True,
                                        blank=True)

    def __str__(self):
        return self.title


class Answer(models.Model):
    schedule = models.ForeignKey(QuizSchedule)
    question = models.ForeignKey(Question, related_name="answers")
    order = models.PositiveIntegerField()
    text = models.TextField(_('Text'))
    score = models.IntegerField(_('Score'), default=0)

    def matches(self, answer):
        return answer.lower().strip() == self.text.lower().strip()


class SubmittedAnswer(models.Model):
    text = models.TextField(_('Text'))
    question = models.ForeignKey(Question)
    quiz = models.ForeignKey(QuizInstance)
    score = models.IntegerField(_('Score'), default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    date_created = models.DateTimeField(_('Date submitted'), auto_now_add=True,
                                        blank=True)
    ref_answer = models.ForeignKey(Answer, null=True, blank=True)


from django.dispatch import receiver
from django.db.models.signals import post_delete
@receiver(post_delete, sender=QuizInstance)
def delete_quiz_instance(sender, instance, **kwargs):
    message = {
        'pk': instance.pk,
        'model': 'QuizInstance',
        'action': 'change-state',
        'state': QuizInstance.STATES.DELETED
    }
    r = redis.StrictRedis(
        host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
        port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
        db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
    r.publish('quiz:public', json.dumps(message))
