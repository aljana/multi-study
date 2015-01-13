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
    date_created = models.DateField(auto_now_add=True, blank=True)
    image = models.ImageField("Image", upload_to="quiz/", blank=True, null=True)

    @transition(field=state, source=STATES.SCHEDULED, target=STATES.OPEN)
    def open(self):
        message = {
            'id': self.pk,
            'model': 'QuizInstance',
            'action': 'change-state',
            'previous': QuizInstance.STATES.SCHEDULED,
            'current': QuizInstance.STATES.OPEN
        }
        r = redis.StrictRedis(host='localhost', port=6379, db=4)
        r.publish('quiz:0', json.dumps(message))

    @transition(field=state, source=STATES.OPEN, target=STATES.ACTIVE)
    def open(self):
        message = {
            'id': self.pk,
            'model': 'QuizInstance',
            'action': 'change-state',
            'previous': QuizInstance.STATES.OPEN,
            'current': QuizInstance.STATES.ACTIVE
        }
        r = redis.StrictRedis(host='localhost', port=6379, db=4)
        r.publish('quiz:0', json.dumps(message))

    class Meta:
        verbose_name = _('Instantiated Quiz')
        verbose_name_plural = _('Instantiated Quizzes')
        ordering = ('date_created',)

    def __str__(self):
        return self.schedule.title


class Question(models.Model):
    DEFAULT_TIME_LIMIT = 60

    class QuestionType:
        OPEN = "open"

    TYPE_CHOICES = (
        (QuestionType.OPEN, "Open"),
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

    image = models.ImageField("Image", upload_to="quiz/", blank=True, null=True)

    def __str__(self):
        return self.title


class Answer(models.Model):
    schedule = models.ForeignKey(QuizSchedule)
    question = models.ForeignKey(Question, related_name="answers")
    order = models.PositiveIntegerField()
    text = models.TextField(_('Text'))
    score = models.IntegerField(_('Score'), default=0)
    image = models.ImageField("Image", upload_to="quiz/", blank=True, null=True)

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
