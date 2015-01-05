# -*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url

from .views import api

urlpatterns = patterns(
    '',
    url(r'^$', api),
    url('', include('api.users.urls', namespace='api.users')),
    url('', include('api.quizzes.urls', namespace='api.quizzes')),
)
