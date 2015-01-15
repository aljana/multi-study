# -*- coding: utf-8 -*-

from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import login, logout

from rest_framework import status, viewsets
from rest_framework.mixins import CreateModelMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ParseError, AuthenticationFailed
from rest_framework.generics import CreateAPIView, DestroyAPIView, \
    GenericAPIView

try:
    from djangorestframework_camel_case.render import CamelCaseJSONRenderer
except ImportError:
    from rest_framework.renderers import JSONRenderer as CamelCaseJSONRenderer

from .authentication import get_bearer_token, calculate_ttl
from .models import User, AccessToken, RefreshToken, RememberMeToken
from .permissions import IsStaffOrTargetUser
from .filters import IsStaffOrTargetUserFilterBackend
from .serializers import UserSerializer, \
    LoginSerializer, RefreshTokenSerializer, SessionLoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    User CRUD operations.
    """
    serializer_class = UserSerializer
    permission_classes = (IsStaffOrTargetUser,)
    filter_backends = (IsStaffOrTargetUserFilterBackend,)
    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == 'POST':
            return AllowAny(),
        return IsAuthenticated(), IsStaffOrTargetUser(),


class CurrentUserView(APIView):
    """
    Get current user info.
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):
        """
        Show current user info.
        """
        if request.user.is_authenticated():
            user_serializer = UserSerializer(request.user,
                                             context={'request': request})

            return Response({
                'user': user_serializer.data
            })

        key = get_bearer_token(request)
        if not key:
            raise ParseError(_('No access token provided'))

        try:
            access_token = AccessToken.objects.select_related('user').get(
                key=key
            )
        except Exception:
            raise ParseError(_('Invalid access token provided'))

        user_serializer = UserSerializer(access_token.user,
                                         context={'request': request})

        return Response({
            'user': user_serializer.data,
            'access_token': access_token.key,
            'ttl': calculate_ttl(access_token.expiration)
        })


class SessionLoginView(CreateAPIView, DestroyAPIView):
    """
    Handle user authentication.
    """
    serializer_class = SessionLoginSerializer

    def destroy(self, request, *args, **kwargs):
        logout(request)
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie('remember_me_token')
        return response

    def create(self, request, *args, **kwargs):
        """
        Perform user login operation.
        """
        serializer = self.get_serializer(data=request.DATA)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            if not user:
                raise AuthenticationFailed(_('Bad credentials'))

            login(request, user)

            user_serializer = UserSerializer(user,
                                             context={'request': request})

            response = Response(user_serializer.data,
                                status=status.HTTP_201_CREATED)

            if serializer.validated_data['remember_me']:
                # Find user's access tokens
                tokens = RememberMeToken.objects.filter(
                    user=user
                ).order_by('created')

                # Remove oldest token
                if tokens.count() == 5:
                    tokens[0].delete()

                # Create new remember me token
                token = RememberMeToken.objects.create(
                    user=user
                )

                response.set_cookie('remember_me_token',
                                    value=token.key,
                                    httponly=True,
                                    expires=token.expiration)

            return response

        raise ParseError(serializer.errors)


class TokenLoginView(CreateAPIView):
    """
    Handle user authentication.
    """
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        """
        Perform user login operation.
        """
        serializer = self.get_serializer(data=request.DATA)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            if not user:
                raise AuthenticationFailed(_('Bad credentials'))

            # Find user's access tokens
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
                access_token=access_token
            )

            user_serializer = UserSerializer(user,
                                             context={'request': request})
            return Response(
                {
                    'user': user_serializer.data,
                    'access_token': access_token.key,
                    'refresh_token': refresh_token.key,
                    'ttl': calculate_ttl(access_token.expiration)
                },
                status=status.HTTP_201_CREATED
            )

        raise ParseError(serializer.errors)


class TokenRefreshView(CreateAPIView):
    """
    Generate new access token with provided refresh token.
    """
    serializer_class = RefreshTokenSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.DATA)
        if serializer.is_valid():
            refresh_token = serializer.validated_data['refresh_token']

            user = refresh_token.access_token.user
            refresh_token.access_token.delete()

            access_token = AccessToken.objects.create(user=user)
            refresh_token = RefreshToken.objects.create(
                access_token=access_token
            )

            user_serializer = UserSerializer(user,
                                             context={'request': request})

            ttl = calculate_ttl(access_token.expiration)

            data = {
                'user': user_serializer.data,
                'access_token': access_token.key,
                'refresh_token': refresh_token.key,
                'ttl': ttl
            }

            return Response(data, status=status.HTTP_201_CREATED)
        raise ParseError(serializer.errors)
