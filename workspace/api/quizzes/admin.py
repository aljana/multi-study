from django.contrib import admin
from suit.admin import SortableTabularInline

from .models import *


class AnswerInline(SortableTabularInline):
    model = Answer
    sortable = 'order'
    extra = 0


class QuestionInline(SortableTabularInline):
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
