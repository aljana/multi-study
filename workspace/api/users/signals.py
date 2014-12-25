from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User


# noinspection PyUnusedLocal
# @receiver(post_save, sender=User)
# def user_post_save(sender, instance, created, *args, **kwargs):
#     """
#     Create password when user is saved.
#     """
#     if created and instance.password:
#         instance.set_password(instance.password)
#         instance.save()
