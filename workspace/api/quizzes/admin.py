from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from .models import Quiz


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'state')
    list_filter = ('owner',)
