from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from .models import *

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'state')
    list_filter = ('owner',)

class AnswerInline(admin.StackedInline):
    model = Answer

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title',)
    inlines = [AnswerInline,]

