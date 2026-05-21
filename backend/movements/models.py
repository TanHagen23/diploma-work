from django.db import models
from equipment.models import Equipment


class Movement(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='movements', verbose_name='Оборудование')
    from_location = models.CharField(max_length=255, verbose_name='Откуда')
    to_location = models.CharField(max_length=255, verbose_name='Куда')
    responsible_person = models.CharField(max_length=255, verbose_name='Ответственное лицо')
    movement_date = models.DateField(verbose_name='Дата перемещения')
    reason = models.CharField(max_length=500, verbose_name='Причина')
    notes = models.TextField(blank=True, verbose_name='Примечания')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        verbose_name = 'Перемещение'
        verbose_name_plural = 'Перемещения'
        ordering = ['-movement_date']

    def __str__(self):
        return f'{self.equipment} — {self.from_location} → {self.to_location}'
