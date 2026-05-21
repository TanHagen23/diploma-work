from django.db import models


class Equipment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Активно'),
        ('maintenance', 'На обслуживании'),
        ('decommissioned', 'Списано'),
    ]

    name = models.CharField(max_length=255, verbose_name='Наименование')
    inventory_number = models.CharField(max_length=100, unique=True, verbose_name='Инвентарный номер')
    category = models.CharField(max_length=100, verbose_name='Категория')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name='Статус')
    location = models.CharField(max_length=255, verbose_name='Местонахождение')
    responsible_person = models.CharField(max_length=255, verbose_name='Ответственное лицо')
    purchase_date = models.DateField(null=True, blank=True, verbose_name='Дата приобретения')
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name='Стоимость')
    notes = models.TextField(blank=True, verbose_name='Примечания')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        verbose_name = 'Оборудование'
        verbose_name_plural = 'Оборудование'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.inventory_number})'
