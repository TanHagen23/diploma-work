import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { Equipment, EquipmentPayload, EquipmentStatus } from '@/shared/types';
import { equipmentApi } from '@/entities/equipment';
import { toast } from 'sonner';

interface EquipmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment | null;
  onSaved: (equipment: Equipment) => void;
}

const LOCATIONS = ['Склад А', 'Склад Б', 'Офис 1', 'Офис 2', 'Серверная'];
const CATEGORIES = ['Техника', 'Оргтехника', 'Сетевое оборудование', 'Мебель'];

const EMPTY: EquipmentPayload = {
  name: '',
  inventory_number: '',
  category: '',
  status: 'active',
  location: '',
  responsible_person: '',
  purchase_date: '',
  purchase_price: null,
  notes: '',
};

export function EquipmentFormModal({ open, onOpenChange, equipment, onSaved }: EquipmentFormModalProps) {
  const isEdit = !!equipment;
  const [form, setForm] = useState<EquipmentPayload>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name,
        inventory_number: equipment.serialNumber,
        category: equipment.type,
        status: equipment.status,
        location: equipment.location,
        responsible_person: equipment.responsiblePerson ?? equipment.department,
        purchase_date: equipment.purchaseDate ?? '',
        purchase_price: equipment.purchasePrice ?? null,
        notes: equipment.notes ?? '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [equipment, open]);

  const set = <K extends keyof EquipmentPayload>(key: K, value: EquipmentPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.inventory_number.trim()) {
      toast.error('Заполните обязательные поля: Наименование и Инвентарный номер');
      return;
    }

    setSaving(true);
    try {
      const payload: EquipmentPayload = {
        ...form,
        purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
        purchase_date: form.purchase_date || undefined,
      };

      let saved: Equipment;
      if (isEdit && equipment) {
        saved = await equipmentApi.update(equipment.id, payload);
        toast.success('Оборудование обновлено');
      } else {
        saved = await equipmentApi.create(payload);
        toast.success('Оборудование добавлено');
      }
      onSaved(saved);
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.inventory_number?.[0]
        ?? err?.response?.data?.detail
        ?? 'Ошибка при сохранении';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактировать оборудование' : 'Добавить оборудование'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Наименование <span className="text-red-500">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Dell Latitude 7490"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Инвентарный номер <span className="text-red-500">*</span></Label>
              <Input
                value={form.inventory_number}
                onChange={(e) => set('inventory_number', e.target.value)}
                placeholder="INV-001"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Категория</Label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Статус</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as EquipmentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активно</SelectItem>
                  <SelectItem value="maintenance">На обслуживании</SelectItem>
                  <SelectItem value="decommissioned">Списано</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Местонахождение</Label>
              <Select value={form.location} onValueChange={(v) => set('location', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите локацию" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Ответственное лицо</Label>
              <Input
                value={form.responsible_person}
                onChange={(e) => set('responsible_person', e.target.value)}
                placeholder="Иванов А.П."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Дата приобретения</Label>
              <Input
                type="date"
                value={form.purchase_date ?? ''}
                onChange={(e) => set('purchase_date', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Стоимость (₽)</Label>
              <Input
                type="number"
                min={0}
                value={form.purchase_price ?? ''}
                onChange={(e) => set('purchase_price', e.target.value ? Number(e.target.value) : null)}
                placeholder="75000"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Примечания</Label>
              <Input
                value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Дополнительная информация..."
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Отмена
          </Button>
          <Button
            className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
