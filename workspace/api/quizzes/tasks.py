from celery import shared_task
from celery.utils.log import get_task_logger
import datetime

from .models import Quiz

logger = get_task_logger(__name__)


@shared_task
def update_quiz_state():
    quizzes = Quiz.objects.filter(state=Quiz.STATES.CLOSED)
    today = datetime.datetime.today().date()
    now = datetime.datetime.now().time()

    for quiz in quizzes:
        reccurence = quiz.recurrences.after(
            datetime.datetime.now(),
            dtstart=datetime.datetime.now(),
            inc=True
        )
        if reccurence and reccurence.date() == today:
            if quiz.start < now:
                logger.info('Opening quiz %s' % quiz.title)
                quiz.open()
                quiz.save()

