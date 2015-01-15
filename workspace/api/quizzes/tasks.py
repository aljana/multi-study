from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder
import datetime
import redis
import json

from .models import QuizSchedule, QuizInstance, Question, Answer

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
        instance.open()
        instance.save()
        logger.info('Quiz instance %s opened' % instance.schedule.title)

    now = datetime.datetime.now()
    instances = QuizInstance.objects.filter(
        date_created=today,
        state=QuizInstance.STATES.OPEN,
        schedule__start__lte=now
    )

    for instance in instances:
        instance.activate()
        # instance.question = \
        #    Question.objects.filter(schedule=instance.schedule)[0]
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
        questions = Question.objects.filter(
            schedule=instance.schedule
        ).order_by('order')
        total_questions = questions.count()
        current_question = 0
        next_question = None

        logger.info(now)
        logger.info(instance.time_activated)

        for question in questions:
            time_elapsed += question.time_limit
            logger.info(question)
            logger.info(instance.time_activated + datetime.timedelta(seconds=time_elapsed))
            if instance.time_activated + datetime.timedelta(seconds=time_elapsed) > now:
                next_question = question
                break
            current_question += 1

        ended = instance.time_activated + datetime.timedelta(seconds=time_elapsed) <= now

        logger.info(str(next_question.pk if next_question else '') + ' : ' + str(instance.question.pk if instance.question else ''))

        if total_questions == current_question and ended:
            instance.close()
            instance.save()

            message = {
                'pk': instance.pk,
                'action': 'close-quiz'
            }

            r = redis.StrictRedis(
                host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
                port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
                db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
            r.publish('quiz:%d' % instance.pk, json.dumps(message, cls=DjangoJSONEncoder))

            logger.info('Quiz instance %s closed' % instance.schedule.title)
        elif next_question and (not instance.question or next_question.pk != instance.question.pk):
            instance.question = next_question
            instance.save()

            answer_objects = Answer.objects.filter(
                question=instance.question
            )

            answers = []
            for answer in answer_objects:
                answers.append({'text': answer.text})

            message = {
                'pk': instance.pk,
                'action': 'change-question',
                'timeUpdated': instance.time_updated,
                'question': {
                    'pk': instance.question.pk,
                    'title': instance.question.title,
                    'type': instance.question.type,
                    'answers': answers,
                    'image': instance.question.image.url,
                    'description': instance.question.description,
                    'timeLimit': instance.question.time_limit
                }
            }
            r = redis.StrictRedis(
                host=settings.SETTINGS['DATABASES']['REDIS4']['HOST'],
                port=settings.SETTINGS['DATABASES']['REDIS4']['PORT'],
                db=settings.SETTINGS['DATABASES']['REDIS4']['DB'])
            r.publish('quiz:%d' % instance.pk, json.dumps(message, cls=DjangoJSONEncoder))

            logger.info('Quiz instance %s updated' % instance.schedule.title)
