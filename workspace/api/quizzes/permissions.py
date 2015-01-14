from rest_framework import permissions


class UserParticipatesInQuiz(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        raise Exception("why is this not invoked?!")
        return request.user not in obj.users