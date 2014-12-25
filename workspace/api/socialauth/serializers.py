from rest_framework import serializers

from ..users.models import User


class UserSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(source='get_full_name')
    avatars = serializers.SerializerMethodField('get_avatars')

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name',
                  'last_name', 'full_name',
                  'birthday', 'avatar', 'avatars')
        write_only_fields = ('password', 'avatar',)

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
