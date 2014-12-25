import os
from datetime import timedelta

os.environ.setdefault('DJANGO_ENV', 'development')

from .workspace import *

from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP


ADMINS = (('Jure Zvelc', 'jzvelc@gmail.com'),)
MANAGERS = ADMINS

ROOT_URLCONF = '_project.urls'
WSGI_APPLICATION = '_project.wsgi.application'
SITE_URL = PROJECT['HOSTS']['DEV']['URL']
CORS_URLS_REGEX = r'^/api/.*$'
AUTH_USER_MODEL = 'users.User'
#SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'api/static'),
)

TEMPLATE_DIRS = [
    os.path.join(BASE_DIR, 'api/templates')
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': PROJECT['DATABASES']['POSTGRESQL']['NAME'],
        'USER': PROJECT['DATABASES']['POSTGRESQL']['USER'],
        'PASSWORD': PROJECT['DATABASES']['POSTGRESQL']['PASSWORD'],
        'HOST': PROJECT['DATABASES']['POSTGRESQL']['HOST'],
        'PORT': PROJECT['DATABASES']['POSTGRESQL']['PORT']
    }
}

INSTALLED_APPS = (
    'suit',
    'suit_ckeditor',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'django_gravatar',
    'debug_toolbar',
    'rest_framework',
    'recurrence',
    'mptt',
    'corsheaders',
    'sorl.thumbnail',
    'social.apps.django_app.default',
    'api',
    'api.users',
    'api.quizzes'
)

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_AGE = 86400
SESSION_COOKIE_DOMAIN = None
SESSION_COOKIE_NAME = 'sessionid'
SESSION_COOKIE_SECURE = False

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'api.users.middleware.RememberMeSessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'api.users.backends.RememberMeSessionBackend',
    'social.backends.google.GoogleOAuth2',
    'social.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

TEMPLATE_CONTEXT_PROCESSORS = TCP + (
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
)

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_COLLAPSED': True
}

DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
]

INTERNAL_IPS = ('10.1.1.1',)

REST_FRAMEWORK = {
    'DEFAULT_MODEL_SERIALIZER_CLASS': 'rest_framework.serializers.' +
                                      'ModelSerializer',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'api.users.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
    )
}


# Social auth
LOGIN_REDIRECT_URL = '/success/'

# Celery
BROKER_URL = 'redis://localhost:6379/3'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERYBEAT_SCHEDULE = {
    'update_quiz_state': {
        'task': 'api.quizzes.tasks.update_quiz_state',
        'schedule': timedelta(seconds=2)
    },
}
