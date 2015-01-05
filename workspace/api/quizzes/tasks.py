from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone
import datetime

from .models import QuizSchedule, QuizInstance, Question

logger = get_task_logger(__name__)


@shared_task
def schedule_quiz():
    today = datetime.datetime.today().date()
    now = datetime.datetime.now()
    start = datetime.datetime(today.year, today.month, today.day, 0, 0, 0)
    end = datetime.datetime(today.year, today.month, today.day, 23, 59, 59)
    quizzes = QuizSchedule.objects.filter(start__gte=now.time())

    for quiz in quizzes:
        recurrences = quiz.recurrences.between(
            start,
            end,
            dtstart=start,
            inc=True
        )

        if recurrences and recurrences[0].date() == today:
            # Allow only one quiz instance per day
            total = QuizInstance.objects.filter(
                schedule__pk=quiz.pk,
                date_created=today
            ).count()

            if total == 0:
                instance = QuizInstance()
                instance.schedule = quiz
                instance.save()
                logger.info('Instantiating quiz %s' % quiz.title)


@shared_task
def change_quiz_state():
    today = datetime.datetime.today().date()
    now = datetime.datetime.now()

    instances = QuizInstance.objects.filter(
        date_created=today,
        state=QuizInstance.STATES.SCHEDULED,
        schedule__start__range=(now, now + datetime.timedelta(minutes=5))
    )

    for instance in instances:
        instance.state = QuizInstance.STATES.OPEN
        instance.save()
        logger.info('Quiz instance %s opened' % instance.schedule.title)

    instances = QuizInstance.objects.filter(
        date_created=today,
        state=QuizInstance.STATES.OPEN,
        schedule__start__lte=now
    )

    for instance in instances:
        instance.state = QuizInstance.STATES.ACTIVE
        instance.question = Question.objects.filter(schedule=instance.schedule)[0]
        instance.save()
        logger.info('Quiz instance %s activated' % instance.schedule.title)


@shared_task
def change_quiz_question():
    today = datetime.datetime.today().date()
    now = timezone.now()

    instances = QuizInstance.objects.filter(
        date_created=today,
        state=QuizInstance.STATES.ACTIVE
    )

    for instance in instances:
        time_elapsed = 0
        questions = Question.objects.filter(schedule=instance.schedule).order_by('order')
        total_questions = questions.count()
        current_question = 0
        next_question = False

        for question in questions:
            time_elapsed += question.time_limit
            if instance.time_created + datetime.timedelta(seconds=time_elapsed) > now:
                instance.question = question
                next_question = True
                break
            current_question += 1

        if total_questions == current_question:
            instance.state = QuizInstance.STATES.CLOSED
        if next_question or total_questions == current_question:
            instance.save()
            logger.info('Quiz instance %s updated' % instance.schedule.title)
