import datetime
import json

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_fsm import FSMField, transition
from recurrence.fields import RecurrenceField

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
    start = models.TimeField(default=datetime.datetime.now() + datetime.timedelta(hours=1))
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
