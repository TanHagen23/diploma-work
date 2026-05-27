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
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from '@/shared/ui';
import { decommissionsApi, CreateDecommissionPayload } from '@/shared/api/decommissions';
import { equipmentApi } from '@/shared/api/equipment';
import { Decommission, Equipment } from '@/shared/types';
import { Search, Plus, CheckCircle, AlertTriangle, Package, FileX } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM: CreateDecommissionPayload = {
  equipment: 0,
  reason: '',
  decommission_date: new Date().toISOString().split('T')[0],
  approved_by: '',
  act_number: '',
  notes: '',
};

export default function DecommissionPage() {
  const [decommissions, setDecommissions] = useState<Decommission[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateDecommissionPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([decommissionsApi.getDecommissions(), equipmentApi.getEquipment()])
      .then(([decs, eqs]) => {
        setDecommissions(decs);
        // Only active/maintenance equipment can be decommissioned
        const decommissionedIds = new Set(decs.map((d) => d.equipmentId));
        setEquipmentList(eqs.filter((e) => !decommissionedIds.has(e.id)));
      })
      .catch(() => toast.error('Ошибка загрузки данных'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = decommissions.filter((item) =>
    item.equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.actNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const setField = <K extends keyof CreateDecommissionPayload>(key: K, value: CreateDecommissionPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.equipment || !form.reason || !form.approved_by || !form.act_number) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    setSaving(true);
    try {
      const created = await decommissionsApi.createDecommission(form);
      setDecommissions((prev) => [created, ...prev]);
      setEquipmentList((prev) => prev.filter((e) => e.id !== form.equipment));
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      toast.success('Акт о списании создан');
    } catch (err: any) {
      const msg = err?.response?.data?.equipment?.[0]
        ?? err?.response?.data?.act_number?.[0]
        ?? err?.response?.data?.detail
        ?? 'Ошибка при сохранении';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Списание оборудования</h1>
            <p className="text-muted-foreground">Учёт и управление списанием активов</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2E74B5] hover:bg-[#245d91]">
                <Plus className="h-4 w-4 mr-2" />
                Новый акт
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Акт о списании оборудования</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Оборудование <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.equipment ? String(form.equipment) : ''}
                    onValueChange={(v) => setField('equipment', Number(v))}
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

                <div className="space-y-1.5">
                  <Label>Причина списания <span className="text-red-500">*</span></Label>
                  <Input
                    value={form.reason}
                    onChange={(e) => setField('reason', e.target.value)}
                    placeholder="Физический износ, неисправность и т.д."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Дата списания</Label>
                    <Input
                      type="date"
                      value={form.decommission_date}
                      onChange={(e) => setField('decommission_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Номер акта <span className="text-red-500">*</span></Label>
                    <Input
                      value={form.act_number}
                      onChange={(e) => setField('act_number', e.target.value)}
                      placeholder="АКТ-2024-005"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Утверждено <span className="text-red-500">*</span></Label>
                  <Input
                    value={form.approved_by}
                    onChange={(e) => setField('approved_by', e.target.value)}
                    placeholder="Директор Иванов А.П."
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
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  <FileX className="h-4 w-4 mr-2" />
                  {saving ? 'Сохранение...' : 'Создать акт'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
                  <FileX className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего списано</p>
                  {loading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                    <p className="text-2xl font-semibold dark:text-white">{decommissions.length}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Завершено</p>
                  {loading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                    <p className="text-2xl font-semibold dark:text-white">{decommissions.length}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Доступно для списания</p>
                  {loading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                    <p className="text-2xl font-semibold dark:text-white">{equipmentList.length}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или номеру акта..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12" />
                    <TableHead>Акт №</TableHead>
                    <TableHead>Оборудование</TableHead>
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Утверждено</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        Записей о списании не найдено
                      </td>
                    </TableRow>
                  ) : filtered.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-blue-600 dark:text-blue-400">
                        {item.actNumber}
                      </TableCell>
                      <TableCell className="font-medium">{item.equipment.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {item.equipment.serialNumber}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.decommissionDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs max-w-[180px] truncate">
                          {item.reason}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.approvedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
