from rest_framework import filters


class IsOwnerFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(owner=request.user)


class IsStaffOrTargetUserFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_staff:
            return queryset.order_by('pk')

        return queryset.filter(pk=request.user.pk)
