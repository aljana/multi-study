# -*- coding: utf-8 -*-

import base64
import urllib

from django.utils.translation import ugettext_lazy as _

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.renderers import TemplateHTMLRenderer

try:
    from djangorestframework_camel_case.render import CamelCaseJSONRenderer
except ImportError:
    from rest_framework.renderers import JSONRenderer as CamelCaseJSONRenderer

from ..users.authentication import calculate_ttl
from ..users.models import AccessToken, RefreshToken
from .serializers import UserSerializer


class SocialAuthSuccessView(APIView):
    """
    End point for social auth.
    """
    renderer_classes = (TemplateHTMLRenderer,)
    template_name = 'bustathief_auth/social_auth_success.html'

    @staticmethod
    def get(request):
        """
        Return user info and set user cookie.
        """
        user = request.user
        if not user or not user.is_authenticated():
            raise AuthenticationFailed(_('Bad credentials'))

        access_tokens = AccessToken.objects.filter(
            user=user
        ).order_by('created')

        # Remove oldest token
        if access_tokens.count() == 5:
            access_tokens[0].delete()

        # Create new access token
        access_token = AccessToken.objects.create(
            user=user
        )

        # Create new refresh token
        refresh_token = RefreshToken.objects.create(
            access_token_id=access_token
        )

        user_serializer = UserSerializer(user, context={'request': request})

        data = {
            'user': user_serializer.data,
            'access_token': access_token.key,
            'refresh_token': refresh_token.key,
            'ttl': calculate_ttl(access_token.expiration)
        }

        # Encode data for cookie
        encoded = urllib.quote_plus(base64.b64encode(
            CamelCaseJSONRenderer().render(data))
        )

        # Send response with cookie
        response = Response()
        response.set_cookie(key='user', value=encoded,
                            max_age=data['ttl'] - 60)

        request.session.flush()

        return response
