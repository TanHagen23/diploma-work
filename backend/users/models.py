from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Администратор'),
        ('manager', 'Менеджер'),
        ('viewer', 'Наблюдатель'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Пользователь')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer', verbose_name='Роль')
    department = models.CharField(max_length=255, blank=True, verbose_name='Отдел')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'

    def __str__(self):
        return f'{self.user.username} ({self.get_role_display()})'
