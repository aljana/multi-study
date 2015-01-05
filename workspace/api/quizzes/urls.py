from django.conf.urls import patterns, url, include

from rest_framework import routers

from .views import *

urlpatterns = patterns(
    'api.quizzes',
    url(r'(\d+)/login/$', QuizSessionLogin.as_view(), name='quiz-login'),
    url(r'list/$', QuizList.as_view(), name='quiz-list'),
    url(r'(\d+)/question/$', QuizCurrentQuestion.as_view(), name='question-current'),
    url(r'(\d+)/question/next', QuizNextQuestion.as_view(), name='question-next'),
    url(r'(\d+)/question/(\d+)/answer$', QuizAnswerQuestion.as_view(), name='question-answer'),
 #  url(r'(\d+)/question/(\d+)/results$', QuizQuestionResults.as_view(), name='question.results'),
)
