# -*- coding: utf-8 -*-

import logging

from django.utils import timezone

logger = logging.getLogger('project')


# noinspection PyUnusedLocal
def update_user(backend, user, response, *args, **kwargs):
    if user:
        changed = False
        if backend.name == 'google-oauth2':
            if kwargs['is_new']:
                if response['gender']:
                    user.gender = 'M' if response['gender'] == 'male' else 'F'
                    changed = True

            if not user.birthday and response['birthday']:
                try:
                    birthday = timezone.datetime.strptime(response['birthday'],
                                                          '%Y-%m-%d')
                    user.birthday = birthday.date()
                    changed = True
                except ValueError as error:
                    logger.error('Can\'t associate birthday because ' +
                                 error.message)

        details = kwargs['details']
        if details:
            if not user.first_name and details['first_name']:
                user.first_name = details['first_name']
                changed = True

            if not user.last_name and details['last_name']:
                user.last_name = details['last_name']
                changed = True

        if changed:
            user.save()
