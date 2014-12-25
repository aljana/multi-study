# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import sorl.thumbnail.fields
import django.utils.timezone
import api.users.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(default=django.utils.timezone.now, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='superuser status', help_text='Designates that this user has all permissions without explicitly assigning them.')),
                ('username', models.EmailField(unique=True, editable=False, max_length=254, verbose_name='Username')),
                ('email', models.EmailField(db_index=True, unique=True, max_length=254, verbose_name='Email address', help_text='Required. Email must be unique since it identifies user.')),
                ('avatar_width', models.PositiveIntegerField(null=True, blank=True)),
                ('avatar_height', models.PositiveIntegerField(null=True, blank=True)),
                ('avatar', sorl.thumbnail.fields.ImageField(blank=True, validators=[api.users.models.validate_avatar], null=True, verbose_name='Avatar', upload_to=api.users.models.generate_avatar_filename)),
                ('first_name', models.CharField(null=True, max_length=30, blank=True, verbose_name='First name')),
                ('last_name', models.CharField(null=True, max_length=30, blank=True, verbose_name='Last name')),
                ('birthday', models.DateField(null=True, blank=True, verbose_name='Birthday')),
                ('gender', models.CharField(default='M', max_length=1, choices=[('M', 'Male'), ('F', 'Female')])),
                ('is_staff', models.BooleanField(default=False, verbose_name='Staff status', help_text='Designates whether the user can log into this admin site.')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active', help_text='Designates whether this user should be treated as active. Deselect this instead of deleting accounts.')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='Date joined')),
                ('groups', models.ManyToManyField(to='auth.Group', related_query_name='user', blank=True, verbose_name='groups', related_name='user_set', help_text='The groups this user belongs to. A user will get all permissions granted to each of his/her group.')),
                ('user_permissions', models.ManyToManyField(to='auth.Permission', related_query_name='user', blank=True, verbose_name='user permissions', related_name='user_set', help_text='Specific permissions for this user.')),
            ],
            options={
                'verbose_name_plural': 'users',
                'verbose_name': 'user',
                'swappable': 'AUTH_USER_MODEL',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AccessToken',
            fields=[
                ('key', models.CharField(primary_key=True, max_length=40, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('expiration', models.DateTimeField()),
                ('user', models.ForeignKey(related_name='access_token', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'access_tokens',
                'verbose_name': 'access_token',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='RefreshToken',
            fields=[
                ('key', models.CharField(primary_key=True, max_length=40, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('expiration', models.DateTimeField()),
                ('access_token', models.ForeignKey(related_name='refresh_token', to='users.AccessToken')),
            ],
            options={
                'verbose_name_plural': 'refresh_tokens',
                'verbose_name': 'refresh_token',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='RememberMeToken',
            fields=[
                ('key', models.CharField(primary_key=True, max_length=40, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('expiration', models.DateTimeField()),
                ('user', models.ForeignKey(related_name='remember_me_token', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'remember_me_tokens',
                'verbose_name': 'remember_me_token',
            },
            bases=(models.Model,),
        ),
    ]
