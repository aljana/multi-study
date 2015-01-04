from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from suit.admin import SortableTabularInline

from .models import Quiz, Question


class QuestionInline(SortableTabularInline):
    model = Question
    list_display = ('title', 'quiz')
    sortable = 'order'
    extra = 0

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'state')
    list_filter = ('owner',)
    inlines = (
        QuestionInline,
    )

