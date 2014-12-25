from django.contrib.auth.backends import ModelBackend

from .models import RememberMeToken


class RememberMeSessionBackend(ModelBackend):
    def authenticate(self, key=None):
        if not key:
            return None
        token = RememberMeToken.objects.select_related('user').get(key=key)
        if not token:
            return None
        return token.user
