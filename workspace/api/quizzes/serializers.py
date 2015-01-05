from rest_framework import serializers
from .models import *


class SubmittedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmittedAnswer
        fields = ('text',)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer


class QuestionSerializer(serializers.ModelSerializer):
    # answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ('title', 'description', 'type', 'time_limit')


class QuizSerializer(serializers.HyperlinkedModelSerializer):
    details = serializers.HyperlinkedIdentityField(
        view_name='api.quizzes:quiz-detail',
    )

    participate = serializers.HyperlinkedIdentityField(
        view_name='api.quizzes:quiz-participate',
    )

    submit_answer = serializers.HyperlinkedIdentityField(
        view_name='api.quizzes:quiz-submit-answer',
    )

    total_participants = serializers.SerializerMethodField()

    class Meta:
        model = QuizInstance
        fields = (
            'pk', 'state', 'total_participants', 'details', 'participate', 'submit_answer'
        )

    @staticmethod
    def get_total_participants(obj):
        return obj.participants.count()


class QuizDetailSerializer(QuizSerializer):
    question = QuestionSerializer()

    class Meta:
        model = QuizInstance
        fields = (
            'pk', 'state', 'total_participants', 'details', 'question',
            'participate', 'submit_answer'
        )

#
# class QuestionSerializer(serializers.ModelSerializer):
# class Meta:
# model = Question
# fields = ('title', 'description', 'type', 'time_limit')
#
#
# class AnswerSerializer(serializers.Serializer):
#     answer = serializers.CharField()
#
#     def validate(self, data):
#         return data
#
#
# class QuizLoginSerializer(serializers.Serializer):
#     def validate(self, data):
#         return data
