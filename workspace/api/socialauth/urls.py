from django.conf.urls import patterns, include, url

from .views import SocialAuthSuccessView

urlpatterns = patterns(
    'api.socialauth',
    url(r'success/$', SocialAuthSuccessView.as_view(), name='success'),
    url('', include('social.apps.django_app.urls', namespace='social')),
)
