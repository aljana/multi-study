# -*- coding: utf-8 -*-

from rest_framework import status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.mixins import RetrieveModelMixin, \
    ListModelMixin
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from ..users.models import User

try:
    from djangorestframework_camel_case.render import CamelCaseJSONRenderer
except ImportError:
    from rest_framework.renderers import JSONRenderer as CamelCaseJSONRenderer

from django.shortcuts import get_object_or_404

from .serializers import *
from .permissions import *
import redis


class QuizViewSet(viewsets.GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = QuizInstance.objects.order_by('schedule__start')
    serializer_class = QuizSerializer
    paginate_by = 100

    def retrieve(self, request, pk=None, *args, **kwargs):
        queryset = QuizInstance.objects.all()
        quiz = get_object_or_404(queryset, pk=pk)
        serializer = QuizDetailSerializer(quiz, context={'request': request})
        return Response(serializer.data)

    @detail_route(methods=['patch'],
                  permission_classes=[IsAuthenticated],
                  serializer_class=serializers.BaseSerializer)
    def participate(self, request, pk=None):
        instance = QuizInstance.objects.get(pk=pk)
        instance.participants.add(request.user)
        return Response(status=status.HTTP_201_CREATED)

    @detail_route(methods=['get'],
                  permission_classes=[IsAuthenticated],
                  serializer_class=serializers.BaseSerializer)
    def stats(self, request, pk=None):
        instance = QuizInstance.objects.get(pk=pk)
        answers = SubmittedAnswer.objects.filter(
            quiz=instance
        ).values('user', 'quiz').annotate(total_score=Sum('score')).order_by('total_score')

        for answer in answers:
            answer['user'] = User.objects.get(pk=answer['user'])

        serializer = StatSerializer(answers, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)


    # TODO: Adjust permission class to handle only users who participate
    @detail_route(methods=['post'],
                  permission_classes=[IsAuthenticated],
                  serializer_class=SubmittedAnswerSerializer)
    def submit_answer(self, request, pk=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            instance = QuizInstance.objects.get(pk=pk)

            answer_exists = SubmittedAnswer.objects.filter(
                quiz=instance,
                question=instance.question,
                user=request.user
            ).exists()

            if answer_exists:
                return Response('Answer exists', status=status.HTTP_400_BAD_REQUEST)

            answer = SubmittedAnswer()
            answer.text = serializer.validated_data['text']
            answer.question = instance.question
            answer.quiz = instance
            answer.user = request.user

            try:
                ref_answer = Answer.objects.get(
                    schedule=instance.schedule,
                    question=instance.question,
                    text=serializer.validated_data['text']
                )
                answer.ref_answer = ref_answer
                answer.score = ref_answer.score
            except Answer.DoesNotExist:
                answer.ref_answer = None
                answer.score = 0

            answer.save()

            message = {
                'quiz': instance.id,
                'question': instance.question.id,
                'user': answer.user.get_full_name(),
                'model': 'Answer',
                'action': 'new-answer',
            }

            r = redis.StrictRedis(host='localhost', port=6379, db=4)

            r.publish('quiz:0', json.dumps(message))

            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


# class QuizList(ListCreateAPIView, RetrieveModelMixin):
# queryset = Quiz.objects.all()
# serializer_class = QuizSerializer
# paginate_by = 100
#
#
# class QuizSessionLogin(UpdateAPIView):
# serializer_class = QuizLoginSerializer
#
# def put(self, request, *args, **kwargs):
#         quiz_session_id, = args
#         quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
#
#          # TODO: should not be anonymous user
#
#         quiz_session.users.add(request.user)
#         quiz_session.save()
#
#         return Response(status=status.HTTP_200_OK)
#
#
# class QuizCurrentQuestion(APIView):
#
#     @staticmethod
#     def get(request, quiz_session_id):
#         """
#         Get current question
#         """
#
#         quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
#         question = quiz_session.current_question
#         serialized_question = QuestionSerializer(question)
#
#         return Response({
#             'question': serialized_question.data
#         })
#
#
# class QuizNextQuestion(APIView):
#
#     @staticmethod
#     def get(request, quiz_session_id):
#         """
#         Get next question
#         """
#         quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
#         question = quiz_session.current_question
#
#         # TODO: needs a security to check, if new question can be displayed (someone answered, time-out..?)
#
#         # Get next question based on previous question order
#         try:
#             next_question = Question.objects.get(quiz=quiz_session.quiz, order=question.order+1)
#         except ObjectDoesNotExist:
#             return Response({'msg': 'End of quiz. No more questions.'})
#
#         quiz_session.current_question = next_question
#
#         quiz_session.save()
#
#         serialized_question = QuestionSerializer(next_question)
#
#         return Response({
#             'question': serialized_question.data
#         })
#
#
# class QuizAnswerQuestion(CreateAPIView):
#
#     serializer_class = AnswerSerializer
#
#     def create(self, request, *args, **kwargs):
#
#         serialized_data = self.get_serializer(data=request.DATA)
#
#         if not serialized_data.is_valid():
#             raise ParseError(serialized_data.errors)
#
#         quiz_session_id, quiz_question_id = args
#         quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
#         question = get_object_or_404(Question, id=quiz_question_id)
#
#         answered_text = serialized_data.data['answer']
#
#         matched_answers = list(filter(lambda a: a.matches(answered_text), question.answers.all()))
#
#         answer = SubmittedAnswer()
#         answer.quiz_session = quiz_session
#         answer.question = question
#         answer.text = answered_text
#         answer.user = request.user
#
#         if len(matched_answers) > 0:
#             answer.ref_answer = matched_answers[0]
#             answer.score = matched_answers[0].score
#
#         answer.save()
#
#         # TODO: send signal if the right answer is provided? depends on a question, time? how do we handle this?
#
#         return Response({
#             'score': answer.score
#         })
#
#
# class QuizQuestionResults(APIView):
#
#     @staticmethod
#     def get(request, quiz_session_id):
#         """
#         Return correct answer and results
#         """
#         quiz_session = get_object_or_404(QuizSession, id=quiz_session_id)
#         question = quiz_session.current_question
#         serialized_question = QuestionSerializer(question)
#
#         # TODO: needs a security to check, if results can be displayed (someone answered, time-out..?)
#
#         # TODO: display results ?
#
#         return Response({
#             'question': serialized_question.data,
#             'results': {}
#         })
