from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if obj.owners:
            return request.user in obj.owners.all()
        return obj.owner == request.user


class IsStaffOrTargetUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return request.user.is_staff or obj == request.user
