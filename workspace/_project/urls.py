from django.conf import settings
from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from django.conf.urls.static import static
from django.contrib import admin

from .views import api

urlpatterns = patterns(
    '',

    url(r'^$', RedirectView.as_view(url='/api/')),

    url(r'^cms/', include(admin.site.urls)),

    url(r'^local-auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'^social-auth/', include('api.socialauth.urls')),

    url(r'^api/$', api),

    url(r'^api/', include('api.users.urls', namespace='api.users')),
    url(r'^api/quiz/', include('api.quizzes.urls', namespace='api.quizzes')),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
