# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='image',
            field=models.ImageField(null=True, blank=True, upload_to='quiz/', verbose_name='Image'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='image',
            field=models.ImageField(null=True, blank=True, upload_to='quiz/', verbose_name='Image'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='quizinstance',
            name='image',
            field=models.ImageField(null=True, blank=True, upload_to='quiz/', verbose_name='Image'),
            preserve_default=True,
        ),
    ]
