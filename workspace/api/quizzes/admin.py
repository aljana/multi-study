from django.contrib import admin
from suit.admin import SortableTabularInline, SortableStackedInline
from nested_inline.admin import NestedStackedInline, NestedModelAdmin
from .models import *


class AnswerInline(NestedStackedInline):
    model = Answer
    sortable = 'order'
    extra = 0


class QuestionInline(NestedStackedInline):
    model = Question
    list_display = ('title', 'quiz')
    sortable = 'order'
    extra = 0
    inlines = [AnswerInline]


@admin.register(QuizSchedule)
class QuizAdmin(NestedModelAdmin):
    list_display = ('title', 'owner')
    list_filter = ('owner',)
    inlines = [QuestionInline]


@admin.register(QuizInstance)
class QuizInstanceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'schedule', 'state', 'date_created',)
