import datetime
import json

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_fsm import FSMField, transition
from recurrence.fields import RecurrenceField
from ordered_model.models import OrderedModel

import redis


class Quiz(models.Model):
    class STATES:
        OPEN = 'open'
        CLOSED = 'closed'
        PENDING = 'pending'

    STATE_CHOICES = (
        (STATES.CLOSED, 'Closed'),
        (STATES.OPEN, 'Open'),
        (STATES.PENDING, 'Pending'),
    )

    owner = models.ForeignKey(settings.AUTH_USER_MODEL)
    title = models.CharField(_('Title'), max_length=120)
    state = FSMField(default=STATES.CLOSED, choices=STATE_CHOICES)
    start = models.TimeField(
        default=datetime.datetime.now() + datetime.timedelta(hours=1))
    recurrences = RecurrenceField()

    class Meta:
        verbose_name = _('quiz')
        verbose_name_plural = _('quizzes')
        ordering = ('recurrences',)

    @transition(field=state, source=STATES.CLOSED, target=STATES.OPEN)
    def open(self):
        message = {
            'id': self.pk,
            'model': 'Quiz',
            'action': 'change-state',
            'previous': Quiz.STATES.CLOSED,
            'current': Quiz.STATES.OPEN
        }
        r = redis.StrictRedis(host='localhost', port=6379, db=4)
        r.publish('quiz:0', json.dumps(message))

    def __str__(self):
        return self.title


class Question(OrderedModel):
    DEFAULT_TIME_LIMIT = 60

    class QuestionType:
        OPEN = "open"

    TYPE_CHOICES = (
        (QuestionType.OPEN, "Open"),
    )

    quiz = models.ForeignKey(Quiz)
    title = models.CharField(_('Title'), max_length=120)
    description = models.TextField(_('Description'), null=True, blank=True)
    type = models.CharField(_('Question type'), choices=TYPE_CHOICES, max_length=50)
    time_limit = models.IntegerField(_('Time limit'), default=DEFAULT_TIME_LIMIT)
    created = models.DateTimeField(_('Date created'), auto_now_add=True, blank=True)

    class Meta(OrderedModel.Meta):
        pass


class Answer(models.Model):
    question = models.ForeignKey(Question, related_name="answers")
    text = models.TextField(_('Text'))
    score = models.IntegerField(_('Score'), default=0)

    def matches(self, answer):
        return answer.lower().strip() == self.text.lower().strip()


class QuizSession(models.Model):
    quiz = models.ForeignKey(Quiz)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    created = models.DateTimeField(auto_now_add=True, blank=True)
    current_question = models.ForeignKey(Question, null=True)
    active = models.BooleanField(default=True)


class SubmittedAnswer(models.Model):
    text = models.TextField(_('Text'))
    question = models.ForeignKey(Question)
    quiz_session = models.ForeignKey(QuizSession)
    score = models.IntegerField(_('Score'), default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    created = models.DateTimeField(_('Date submitted'), auto_now_add=True, blank=True)
    ref_answer = models.ForeignKey(Answer, null=True, blank=True)