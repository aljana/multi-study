from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class ApiConfig(AppConfig):
    name = 'api'
    verbose_name = _('Api')

    def ready(self):
        pass
