# -*- coding: utf-8 -*-

from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import login, logout

from rest_framework import status, viewsets
from rest_framework.mixins import CreateModelMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ParseError, AuthenticationFailed
from rest_framework.generics import CreateAPIView

try:
    from djangorestframework_camel_case.render import CamelCaseJSONRenderer
except ImportError:
    from rest_framework.renderers import JSONRenderer as CamelCaseJSONRenderer

from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from .models import *
from .serializers import *

class QuizCurrentQuestion(APIView):

    @staticmethod
    def get(request, quiz_session_id):
        """
        Get current question
        """

        quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
        question = quiz_session.current_question
        serialized_question = QuestionSerializer(question)

        return Response({
            'question': serialized_question.data
        })


class QuizNextQuestion(APIView):

    @staticmethod
    def get(request, quiz_session_id):
        """
        Get next question
        """
        quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
        question = quiz_session.current_question

        # TODO: needs a security to check, if new question can be displayed (someone answered, time-out..?)

        # Get next question based on previous question order
        try:
            next_question = Question.objects.get(quiz=quiz_session.quiz, order=question.order+1)
        except ObjectDoesNotExist:
            return Response({'msg': 'End of quiz. No more questions.'})

        quiz_session.current_question = next_question

        quiz_session.save()

        serialized_question = QuestionSerializer(next_question)

        return Response({
            'question': serialized_question.data
        })


class QuizAnswerQuestion(CreateAPIView):

    serializer_class = AnswerSerializer

    def create(self, request, *args, **kwargs):

        serialized_data = self.get_serializer(data=request.DATA)

        if not serialized_data.is_valid():
            raise ParseError(serialized_data.errors)

        quiz_session_id, quiz_question_id = args
        quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
        question = get_object_or_404(Question, id=quiz_question_id)

        answered_text = serialized_data.data['answer']

        matched_answers = list(filter(lambda a: a.matches(answered_text), question.answers.all()))

        answer = SubmittedAnswer()
        answer.quiz_session = quiz_session
        answer.question = question
        answer.text = answered_text
        answer.user = request.user

        if len(matched_answers) > 0:
            answer.ref_answer = matched_answers[0]
            answer.score = matched_answers[0].score

        answer.save()

        # TODO: send signal if the right answer is provided? depends on a question, time? how do we handle this?

        return Response({
            'score': answer.score
        })


class QuizQuestionResults(APIView):

    @staticmethod
    def get(request, quiz_session_id):
        """
        Return correct answer and results
        """
        quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
        question = quiz_session.current_question
        serialized_question = QuestionSerializer(question)

        # TODO: needs a security to check, if results can be displayed (someone answered, time-out..?)

        # TODO: display results ?

        return Response({
            'question': serialized_question.data,
            'results': {}
        })