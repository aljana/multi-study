import os
import json
from datetime import timedelta
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP

# Get environment
# os.environ.setdefault('DJANGO_ENV', 'development')
DJANGO_ENV = os.environ.get('DJANGO_ENV', 'development')

# Root project dir
ROOT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..')
BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)))

# Set default site id for site framework
SITE_ID = 1

# Timezone
TIME_ZONE = 'Europe/Paris'
USE_TZ = True

ALLOWED_HOSTS = ['*']

# Internationalization
LANGUAGE_CODE = 'en-us'
USE_I18N = False
USE_L10N = False

# Cross origin configuration
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_HEADERS = (
    'x-requested-with',
    'content-type',
    'accept',
    'origin',
    'authorization',
    'x-csrftoken',
    'x-token'
)

# Static and media
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(ROOT_DIR, 'public/static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(ROOT_DIR, 'public/media')

# Unique secret key for cryptographic signing
SECRET_KEY = os.environ.get('SECRET_KEY',
                            'itu)*#x1n)(bnnpk+6c@si&(+!791'
                            'fd&%7_ts@q&1fii!@a2$^')

# Enable debug mode
DEBUG = True
TEMPLATE_DEBUG = True

"""
Caching settings.
"""
CACHES = {
    'default': {
        'BACKEND': 'redis_cache.cache.RedisCache',
        'LOCATION': '127.0.0.1:6379:1',
        'OPTIONS': {
            'CLIENT_CLASS': 'redis_cache.client.DefaultClient',
        }
    },
}

"""
Logging settings.
"""
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d '
                      '%(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'project': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['console', 'mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

"""
Load workspace settings.
"""
SETTINGS = {}
if DJANGO_ENV == 'production':
    SETTINGS = json.load(open(os.path.join(BASE_DIR, '_settings',
                                           'production.upper.json'), 'r'))
elif DJANGO_ENV == 'staging':
    SETTINGS = json.load(open(os.path.join(BASE_DIR, '_settings',
                                           'staging.upper.json'), 'r'))
else:
    SETTINGS = json.load(open(os.path.join(BASE_DIR, '_settings',
                                           'development.upper.json'), 'r'))

"""
Staging & production specific settings.
"""
if DJANGO_ENV != 'development':
    STATIC_URL = SETTINGS['HOSTS']['PUBLIC']['URL'] + '/static/'
    MEDIA_URL = SETTINGS['HOSTS']['PUBLIC']['URL'] + '/media/'
    DEBUG = False
    TEMPLATE_DEBUG = False
    ALLOWED_HOSTS = []

    if SETTINGS.get('DOMAINS'):
        for domain in SETTINGS['DOMAINS']:
            ALLOWED_HOSTS.append('.' + domain)
            ALLOWED_HOSTS.append('.' + domain + '.')

# Managers & admins
ADMINS = (('Jure Zvelc', 'jzvelc@gmail.com'),)
MANAGERS = ADMINS

"""
Host specific settings.
"""
ROOT_URLCONF = '_project.urls'
WSGI_APPLICATION = '_project.wsgi.application'
SITE_URL = SETTINGS['HOSTS']['DEVELOPMENT']['URL']
CORS_URLS_REGEX = r'^/api/.*$'
AUTH_USER_MODEL = 'users.User'
# SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'api/static'),
)

TEMPLATE_DIRS = [
    os.path.join(BASE_DIR, 'api/templates')
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': SETTINGS['DATABASES']['POSTGRESQL']['NAME'],
        'USER': SETTINGS['DATABASES']['POSTGRESQL']['USER'],
        'PASSWORD': SETTINGS['DATABASES']['POSTGRESQL']['PASSWORD'],
        'HOST': SETTINGS['DATABASES']['POSTGRESQL']['HOST'],
        'PORT': SETTINGS['DATABASES']['POSTGRESQL']['PORT']
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
