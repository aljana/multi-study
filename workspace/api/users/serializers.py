from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from .models import User, RefreshToken


class AvatarSerializer(serializers.Serializer):
    xl = serializers.URLField()
    lg = serializers.URLField()
    md = serializers.URLField()
    sm = serializers.URLField()
    xs = serializers.URLField()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='api.users:user-detail',
    )

    full_name = serializers.CharField(source='get_full_name', read_only=True)
    avatars = serializers.SerializerMethodField()
    password = serializers.CharField(style={'input_type': 'password'},
                                     write_only=True)

    class Meta:
        model = User
        fields = ('id', 'url', 'email', 'password', 'first_name',
                  'last_name', 'full_name',
                  'birthday', 'avatar', 'avatars')
        extra_kwargs = {
            'password': {'write_only': True},
            'avatar': {'write_only': True}
        }

    def get_avatars(self, obj):
        request = self.context.get('request')
        avatars = {
            'xl': request.build_absolute_uri(obj.get_avatar('xl')),
            'lg': request.build_absolute_uri(obj.get_avatar('lg')),
            'md': request.build_absolute_uri(obj.get_avatar('md')),
            'sm': request.build_absolute_uri(obj.get_avatar('sm')),
            'xs': request.build_absolute_uri(obj.get_avatar('xs'))
        }
        return avatars

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'},
                                     write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError(
                        _('User account is disabled')
                    )
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError(
                    _('Unable to login with provided credentials')
                )
        else:
            raise serializers.ValidationError(
                _('Must include "email" and "password"')
            )


class SessionLoginSerializer(LoginSerializer):
    remember_me = serializers.BooleanField()


class RefreshTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(max_length=40)

    def validate(self, data):
        try:
            refresh_token = RefreshToken.objects.get(
                pk=data['refresh_token'],
                expiration__gte=timezone.now()
            )
        except RefreshToken.DoesNotExist:
            raise serializers.ValidationError(_('Invalid refresh token'))
        data['refresh_token'] = refresh_token
        return data

