import os
import binascii
import datetime
import hashlib

from django.core.exceptions import ValidationError
from django.template.defaultfilters import escape
from django.core.urlresolvers import reverse
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, \
    PermissionsMixin

from sorl.thumbnail import ImageField, get_thumbnail, delete

from django_gravatar.helpers import get_gravatar_url

"""
https://docs.djangoproject.com/en/1.7/topics/auth/customizing/#auth-custom-user
"""
AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


def validate_avatar(obj):
    file_size = obj.file.size
    megabyte_limit = 0.5
    if file_size > megabyte_limit * 1024 * 1024:
        raise ValidationError(
            "Max file size is %sMB" % str(megabyte_limit)
        )


def generate_avatar_filename(instance, filename):
    f, ext = os.path.splitext(filename)
    return 'avatars/%s%s' % (hashlib.md5(f).hexdigest(), ext)


class UserManager(BaseUserManager):
    """
    Handle user creation.
    """

    def _create_user(self, email, password,
                     is_staff, is_superuser, **extra_fields):
        now = timezone.now()

        if not email:
            raise ValueError(_('The given email must be set'))
        email = self.normalize_email(email)
        user = self.model(username=email, email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, last_login=now,
                          date_joined=now, **extra_fields)
        if password:
            user.set_password(password)

        user.save(using=self._db)

        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        user = self._create_user(email, password, False, False,
                                 **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    MALE = 'M'
    FEMALE = 'F'
    GENDERS = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    )

    USERNAME_FIELD = 'email'

    username = models.EmailField(
        _('Username'),
        max_length=254,
        unique=True,
        editable=False
    )
    email = models.EmailField(
        _('Email address'),
        help_text=_('Required. Email must be unique since it '
                    'identifies user.'),
        max_length=254,
        unique=True,
        db_index=True
    )
    avatar_width = models.PositiveIntegerField(blank=True, null=True)
    avatar_height = models.PositiveIntegerField(blank=True, null=True)

    avatar = ImageField(
        verbose_name=_('Avatar'),
        upload_to=generate_avatar_filename,
        validators=[validate_avatar],
        blank=True,
        null=True
    )

    first_name = models.CharField(_('First name'), max_length=30, blank=True,
                                  null=True)
    last_name = models.CharField(_('Last name'), max_length=30, blank=True,
                                 null=True)
    birthday = models.DateField(_('Birthday'), blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDERS, default=MALE)
    is_staff = models.BooleanField(
        _('Staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))
    is_active = models.BooleanField(
        _('Active'),
        default=True,
        help_text=_('Designates whether this user should be treated as '
                    'active. Deselect this instead of deleting accounts.'))
    date_joined = models.DateTimeField(
        _('Date joined'),
        default=timezone.now,
        editable=False
    )

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        swappable = 'AUTH_USER_MODEL'

    def get_full_name(self):
        if not self.first_name and not self.last_name:
            return None
        if self.first_name and not self.last_name:
            return self.first_name
        if not self.first_name and self.last_name:
            return self.last_name
        if self.first_name and self.last_name:
            full_name = '%s %s' % (self.first_name, self.last_name)
            return full_name.strip()

    def get_short_name(self):
        return self.first_name

    def get_avatar(self, size=None):
        sizes = {
            'xl': 200,
            'lg': 160,
            'md': 80,
            'sm': 40,
            'xs': 20
        }
        if size and type(size) is str:
            size = sizes.get(size, 80)
        if not size:
            size = sizes.get('sm')
        if self.avatar:
            url = get_thumbnail(self.avatar, '%dx%d' % (size, size),
                                crop='center',
                                quality=99).url
        else:
            url = get_gravatar_url(self.email, size=size)
        return url

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def get_admin_avatar(self):
        return '<img src="%s">' % self.get_avatar(40)

    get_admin_avatar.allow_tags = True
    get_admin_avatar.short_description = _('Avatar')

    def get_admin_link(self):
        return '<a href="%s">%s</a>' % (reverse('admin:users_user_change',
                                                args=(self.pk,)),
                                        escape(self.email))

    get_admin_link.allow_tags = True
    get_admin_link.short_description = _('User')

    def save(self, *args, **kwargs):
        """
        Override default save operation.

        Username will be swapped with email.
        """
        self.username = self.email

        if self.previous_avatar and self.avatar != self.previous_avatar:
            delete(self.previous_avatar)
            self.previous_avatar = None

        super(User, self).save(*args, **kwargs)

    def __init__(self, *args, **kwargs):
        super(User, self).__init__(*args, **kwargs)
        _last_login = self._meta.get_field_by_name('last_login')[0]
        _last_login.editable = False
        _password = self._meta.get_field_by_name('password')[0]
        _password.verbose_name = _('Password')
        self.previous_avatar = self.avatar

    def __unicode__(self):
        return self.email


class BaseToken(models.Model):
    """
    An abstract base class implementing a fully featured token model.
    """
    key = models.CharField(max_length=40, primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    expiration = models.DateTimeField()

    class Meta:
        abstract = True

    # noinspection PyMethodOverriding
    def save(self, delta, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        self.expiration = timezone.make_aware(
            datetime.datetime.now() + delta,
            timezone.get_default_timezone()
        )
        return super(BaseToken, self).save(*args, **kwargs)

    @staticmethod
    def generate_key():
        return binascii.hexlify(os.urandom(20)).decode()

    def __unicode__(self):
        return self.key


class AccessToken(BaseToken):
    """
    Access token model which is related to specific user
    used with token authentication.
    """
    user = models.ForeignKey(AUTH_USER_MODEL, related_name='access_token')

    class Meta:
        verbose_name = _('access_token')
        verbose_name_plural = _('access_tokens')

    def save(self, *args, **kwargs):
        return super(AccessToken, self).save(
            datetime.timedelta(hours=1),
            *args,
            **kwargs
        )


class RefreshToken(BaseToken):
    """
    Refresh token model which is bound to access token
    used with token authentication.
    """
    access_token = models.ForeignKey('AccessToken', related_name='refresh_token')

    class Meta:
        verbose_name = _('refresh_token')
        verbose_name_plural = _('refresh_tokens')

    def save(self, *args, **kwargs):
        return super(RefreshToken, self).save(
            datetime.timedelta(days=60),
            *args,
            **kwargs
        )


class RememberMeToken(BaseToken):
    """
    Remember me token used with session authentication.
    """
    user = models.ForeignKey(AUTH_USER_MODEL, related_name='remember_me_token')

    class Meta:
        verbose_name = _('remember_me_token')
        verbose_name_plural = _('remember_me_tokens')

    def save(self, *args, **kwargs):
        return super(RememberMeToken, self).save(
            datetime.timedelta(days=60),
            *args,
            **kwargs
        )

    def __unicode__(self):
        return self.key
