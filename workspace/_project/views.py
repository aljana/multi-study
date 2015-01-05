from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.conf import settings


@api_view(('GET',))
def api(request, format=None):
    return Response({
        'users': {
            'login': reverse('api.users:session-login', request=request,
                             format=format),

            'me': reverse('api.users:me', request=request,
                          format=format),

            'url': reverse('api.users:user-list', request=request,
                           format=format)
        },
        'quizzes': {
            'list' : reverse('api.quizzes:quiz-list', request=request, format=format),
            'login' : reverse('api.quizzes:quiz-login', request=request, format=format, args=(1,)),
            'get_question': reverse('api.quizzes:question-current', request=request, format=format, args=(1,)),
            'next_question': reverse('api.quizzes:question-next', request=request, format=format, args=(1,)),
            'submit_answer': reverse('api.quizzes:question-answer', request=request, format=format, args=(1,1)),
        }
    })


@api_view(('GET',))
def sitemap(request, format=None):
    return Response(
        {
            'api': settings.SETTINGS['HOSTS']['DEVELOPMENT']['URL'] + '/api/',
            'cms': settings.SETTINGS['HOSTS']['DEVELOPMENT']['URL'] + '/cms/',
            'frontend': settings.SETTINGS['HOSTS']['DEVELOPMENT']['URL'] +
                        '/www/frontend/'
        }
    )
