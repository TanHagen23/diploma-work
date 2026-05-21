from django.db import models
from equipment.models import Equipment


class Decommission(models.Model):
    equipment = models.OneToOneField(Equipment, on_delete=models.CASCADE, related_name='decommission', verbose_name='Оборудование')
    reason = models.TextField(verbose_name='Причина списания')
    decommission_date = models.DateField(verbose_name='Дата списания')
    approved_by = models.CharField(max_length=255, verbose_name='Утверждено')
    act_number = models.CharField(max_length=100, verbose_name='Номер акта')
    notes = models.TextField(blank=True, verbose_name='Примечания')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')

    class Meta:
        verbose_name = 'Списание'
        verbose_name_plural = 'Списания'
        ordering = ['-decommission_date']

    def __str__(self):
        return f'Списание {self.equipment} — акт {self.act_number}'
