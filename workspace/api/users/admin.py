from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, Group as \
    BaseGroup
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail.admin import AdminImageMixin

from .models import User
from .forms import UserChangeForm, UserCreationForm


@admin.register(User)
class UserAdmin(AdminImageMixin, BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    fieldsets = (
        (None, {'fields': ('email', 'password', 'avatar',)}),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'gender', 'birthday')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    readonly_fields = ('last_login', 'date_joined',)
    list_display = ('email', 'get_admin_avatar', 'first_name', 'last_name',
                    'gender',
                    'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


class GroupAdmin(BaseGroup):
    class Meta:
        verbose_name = _('Group')
        verbose_name_plural = _('Groups')
        proxy = True


admin.site.unregister(BaseGroup)
admin.site.register(GroupAdmin)

