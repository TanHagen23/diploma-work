import { useState, useEffect } from 'react';
import { AppLayout } from '@/widgets/app-layout';
import {
  Button,
  Input,
  Badge,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from '@/shared/ui';
import { movementsApi, CreateMovementPayload } from '@/shared/api/movements';
import { equipmentApi } from '@/shared/api/equipment';
import { Movement, Equipment } from '@/shared/types';
import { Search, Plus, ArrowRightLeft, Package, Info } from 'lucide-react';
import { toast } from 'sonner';

const LOCATIONS = ['Склад А', 'Склад Б', 'Офис 1', 'Офис 2', 'Серверная'];

const EMPTY_FORM: CreateMovementPayload = {
  equipment: 0,
  from_location: '',
  to_location: '',
  responsible_person: '',
  movement_date: new Date().toISOString().split('T')[0],
  reason: '',
  notes: '',
};

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateMovementPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    Promise.all([movementsApi.getMovements(), equipmentApi.getEquipment()])
      .then(([mvs, eqs]) => {
        setMovements(mvs);
        setEquipmentList(eqs.filter((e) => e.status !== 'decommissioned'));
      })
      .catch(() => toast.error('Ошибка загрузки данных'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = movements.filter((m) =>
    m.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
    m.from.toLowerCase().includes(search.toLowerCase()) ||
    m.to.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const setField = <K extends keyof CreateMovementPayload>(key: K, value: CreateMovementPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.equipment || !form.to_location || !form.responsible_person || !form.reason) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    setSaving(true);
    try {
      const created = await movementsApi.createMovement(form);
      setMovements((prev) => [created, ...prev]);
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      toast.success('Перемещение зарегистрировано');
    } catch {
      toast.error('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const selectedEquipment = equipmentList.find((e) => e.id === form.equipment);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Перемещения оборудования</h1>
            <p className="text-muted-foreground mt-1">
              Учёт перемещений активов между локациями.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                <Plus className="h-4 w-4 mr-2" />
                Новое перемещение
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Зарегистрировать перемещение</DialogTitle>
              </DialogHeader>

              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-700 dark:text-blue-400 text-sm mt-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Каждое перемещение фиксируется в журнале аудита автоматически.</span>
              </div>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Оборудование <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.equipment ? String(form.equipment) : ''}
                    onValueChange={(v) => {
                      const eq = equipmentList.find((e) => e.id === Number(v));
                      setField('equipment', Number(v));
                      setField('from_location', eq?.location ?? '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите оборудование" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentList.map((eq) => (
                        <SelectItem key={eq.id} value={String(eq.id)}>
                          {eq.serialNumber} — {eq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Откуда</Label>
                    <Input
                      value={selectedEquipment?.location ?? form.from_location}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Куда <span className="text-red-500">*</span></Label>
                    <Select value={form.to_location} onValueChange={(v) => setField('to_location', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите локацию" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Дата перемещения</Label>
                    <Input
                      type="date"
                      value={form.movement_date}
                      onChange={(e) => setField('movement_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Ответственное лицо <span className="text-red-500">*</span></Label>
                    <Input
                      value={form.responsible_person}
                      onChange={(e) => setField('responsible_person', e.target.value)}
                      placeholder="Иванов А.П."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Причина <span className="text-red-500">*</span></Label>
                  <Input
                    value={form.reason}
                    onChange={(e) => setField('reason', e.target.value)}
                    placeholder="Выдача сотруднику, ремонт и т.д."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Примечания</Label>
                  <Input
                    value={form.notes ?? ''}
                    onChange={(e) => setField('notes', e.target.value)}
                    placeholder="Дополнительная информация"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                  Отмена
                </Button>
                <Button
                  className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {saving ? 'Сохранение...' : 'Зарегистрировать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по оборудованию или локации..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12" />
                  <TableHead>Оборудование</TableHead>
                  <TableHead>Откуда</TableHead>
                  <TableHead>Куда</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Ответственный</TableHead>
                  <TableHead>Причина</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      Перемещений не найдено
                    </td>
                  </TableRow>
                ) : paginated.map((movement) => (
                  <TableRow key={movement.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{movement.equipmentName}</p>
                        <p className="text-sm text-muted-foreground">{movement.equipment.serialNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{movement.from}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.to}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.date}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.operator}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs">
                        {movement.reason}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Показано {filtered.length} из {movements.length}
              </p>
              {totalPages > 1 && (
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className={page === currentPage ? 'bg-[#2563eb]' : ''}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
