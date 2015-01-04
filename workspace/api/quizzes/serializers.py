from rest_framework import serializers
from .models import *

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('title', 'description', 'type', 'time_limit')


class AnswerSerializer(serializers.Serializer):
    answer = serializers.CharField()

    def validate(self, data):
        return data

