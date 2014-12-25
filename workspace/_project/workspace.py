import os
import yaml


"""
Common configuration.
"""


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
SECRET_KEY = 'itu)*#x1n)(bnnpk+6c@si&(+!791fd&%7_ts@q&1fii!@a2$^'

# Enable debug mode
DEBUG = True
TEMPLATE_DEBUG = True

"""
Caching configuration.
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
Logging configuration.
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
YAML environment aware
"""


def merge(a, b):
    if not b:
        return a
    for k in a.keys():
        if b.get(k) and isinstance(b[k], dict):
            a[k] = merge(a[k], b[k])
        elif b.get(k):
            a[k] = b[k]
    for k in b.keys():
        if not a.get(k):
            a[k] = b[k]
    return a


def parse(name, settings):
    try:
        path = os.path.join(ROOT_DIR, name)
        fp = open(path, 'r')
        settings = merge(settings, yaml.load(fp))
        fp.close()
    except FileNotFoundError:
        pass

    return settings


def convert(settings):
    n = {}
    for k, v in settings.items():
        if isinstance(v, dict):
            n[k.upper()] = convert(v)
        elif isinstance(v, list):
            n[k.upper()] = []
            for i in range(len(v)):
                if isinstance(v[i], dict):
                    n[k.upper()].append(convert(v[i]))
                else:
                    n[k.upper()].append(v[i])
        else:
            n[k.upper()] = v
    return n


DJANGO_ENV = os.environ.get('DJANGO_ENV', 'development')

PROJECT = {}
PROJECT = parse('settings/base.yml', PROJECT)
PROJECT = parse('settings/base.local.yml', PROJECT)
PROJECT = parse('settings/production.yml', PROJECT)
PROJECT = parse('settings/production.local.yml', PROJECT)

if DJANGO_ENV == 'staging' or DJANGO_ENV == 'development':
    PROJECT = parse('settings/staging.yml', PROJECT)
    PROJECT = parse('settings/staging.local.yml', PROJECT)

if DJANGO_ENV == 'development':
    PROJECT = parse('settings/development.yml', PROJECT)
    PROJECT = parse('settings/development.local.yml', PROJECT)

PROJECT = convert(PROJECT)

if DJANGO_ENV != 'development':
    STATIC_URL = PROJECT['HOSTS']['PUBLIC']['URL'] + '/static/'
    MEDIA_URL = PROJECT['HOSTS']['PUBLIC']['URL'] + '/media/'
    DEBUG = False
    TEMPLATE_DEBUG = False
    ALLOWED_HOSTS = []

    if PROJECT.get('DOMAINS'):
        for domain in PROJECT['DOMAINS']:
            ALLOWED_HOSTS.append('.' + domain)
            ALLOWED_HOSTS.append('.' + domain + '.')

SECRET_KEY = 'itu)*#x1n)(bnnpk+6c@si&(+!791fd&%7_ts@q&1fii!@a2$^'
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', SECRET_KEY)
