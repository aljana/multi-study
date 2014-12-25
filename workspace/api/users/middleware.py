from django.contrib.auth import authenticate, login


class RememberMeSessionAuthenticationMiddleware(object):
    @staticmethod
    def process_request(request):
        if hasattr(request, 'user') and request.user.is_authenticated():
            return
        key = request.COOKIES.get('remember_me_token')
        if key:
            user = authenticate(key=key)
            if user and user.is_active:
                login(request, user)

    @staticmethod
    def process_response(request, response):
        if hasattr(request, 'user') and not request.user.is_authenticated():
            response.delete_cookie('remember_me_token')
        return response
