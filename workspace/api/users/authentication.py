from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from rest_framework import exceptions
from rest_framework.authentication import get_authorization_header
from rest_framework.authentication import BaseAuthentication

from .models import AccessToken


def get_bearer_token(request):
    """
    Extract bearer token from request.

    Bearer token will be extracted from 'Authorization:' header.
    """

    auth_header = get_authorization_header(request).split()

    if not auth_header or auth_header[0].lower() != b'bearer':
        return None

    if len(auth_header) == 1 or len(auth_header) > 2:
        return None

    return auth_header[1]


def calculate_ttl(time):
    """
    Calculate token TTL.
    """
    ttl = (time - timezone.now())
    return int(ttl.total_seconds())


class TokenAuthentication(BaseAuthentication):
    """
    Refresh token based authentication.

    Clients should authenticate by passing the token key in the 'Authorization'
    HTTP header, prepended with the string 'Bearer '.

    Example header:
    Authorization: Bearer 401f7ac837da42b97f613d789819ff93537bee6a
    """

    model = AccessToken

    def authenticate(self, request):
        key = get_bearer_token(request)

        if not key:
            return None

        try:
            token = self.model.objects.get(key=key)
        except self.model.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token'))

        # Calculate TTL
        ttl = calculate_ttl(token.expiration)

        # Check token expiration
        if ttl <= 0:
            raise exceptions.AuthenticationFailed(_('Token expired'))

        # Check user status
        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(
                _('User inactive or doesn\'t exist')
            )

        return token.user, token

    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response, or `None` if the
        authentication scheme should return `403 Permission Denied` responses.
        """

        return 'Bearer'

