from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


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
            'get_question': reverse('api.quizzes:question-current', request=request, format=format, args={1}),
            'next_question': reverse('api.quizzes:question-next', request=request, format=format, args={1}),
            'submit_answer': reverse('api.quizzes:question-answer', request=request, format=format, args=(1,1)),
        }
    })
