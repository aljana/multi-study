from rest_framework import serializers
from .models import *


class SubmittedAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmittedAnswer
        fields = ('text',)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('text', 'image')


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ('title', 'description', 'image', 'type', 'time_limit', 'answers')


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
    start = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()

    class Meta:
        model = QuizInstance
        fields = (
            'pk', 'title', 'state', 'total_participants', 'start', 'details',
            'participate', 'time_updated', 'submit_answer'
        )

    @staticmethod
    def get_title(obj):
        return obj.schedule.title

    @staticmethod
    def get_total_participants(obj):
        return obj.participants.count()

    @staticmethod
    def get_start(obj):
        return obj.schedule.start


class QuizDetailSerializer(QuizSerializer):
    question = QuestionSerializer()

    answered = serializers.SerializerMethodField()

    class Meta:
        model = QuizInstance
        fields = (
            'pk', 'title', 'state', 'start', 'total_participants', 'details',
            'question',
            'participate', 'time_updated', 'answered', 'submit_answer'
        )

    def get_answered(self, obj):
        return SubmittedAnswer.objects.filter(
            quiz=obj,
            question=obj.question,
            user=self.context['request'].user
        ).exists()


#
# class QuestionSerializer(serializers.ModelSerializer):
# class Meta:
# model = Question
# fields = ('title', 'description', 'type', 'time_limit')
#
#
# class AnswerSerializer(serializers.Serializer):
# answer = serializers.CharField()
#
# def validate(self, data):
# return data
#
#
# class QuizLoginSerializer(serializers.Serializer):
# def validate(self, data):
#         return data
