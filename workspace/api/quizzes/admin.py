from django.contrib import admin
from suit.admin import *

from .models import *


class AnswerInline(SortableStackedInline):
    model = Answer
    sortable = 'order'
    extra = 0

@admin.register(SubmittedAnswer)
class SubmittedAnswer(admin.ModelAdmin):
    list_display = ('text', 'question')
    sortable = 'order'
    extra = 0

class QuestionInline(SortableStackedInline):
    model = Question
    list_display = ('title', 'quiz')
    sortable = 'order'
    extra = 0


@admin.register(QuizSchedule)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner')
    list_filter = ('owner',)
    inlines = [QuestionInline, AnswerInline]


@admin.register(QuizInstance)
class QuizInstanceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'schedule', 'state', 'date_created',)
