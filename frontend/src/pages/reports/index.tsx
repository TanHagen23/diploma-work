import { useState, useEffect } from 'react';
import { AppLayout } from '@/widgets/app-layout';
import {
  Button,
  Input,
  Badge,
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
} from '@/shared/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Search, FileText, Download, DollarSign, Package, AlertTriangle, RotateCcw } from 'lucide-react';
import { equipmentApi } from '@/entities/equipment';
import { movementsApi } from '@/shared/api/movements';
import { decommissionsApi } from '@/shared/api/decommissions';
import type { Equipment, Movement, Decommission } from '@/shared/types';
import * as XLSX from 'xlsx';

const STATUS_LABELS: Record<string, string> = {
  active: 'В наличии',
  maintenance: 'На обслуживании',
  decommissioned: 'Списано',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  maintenance: 'bg-amber-100 text-amber-700',
  decommissioned: 'bg-red-100 text-red-700',
};

function exportToXlsx(rows: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Данные');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [decommissions, setDecommissions] = useState<Decommission[]>([]);
  const [loadingEq, setLoadingEq] = useState(true);
  const [loadingMv, setLoadingMv] = useState(true);
  const [loadingDc, setLoadingDc] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    equipmentApi.getAll().then(setEquipment).finally(() => setLoadingEq(false));
    movementsApi.getMovements().then(setMovements).finally(() => setLoadingMv(false));
    decommissionsApi.getDecommissions().then(setDecommissions).finally(() => setLoadingDc(false));
  }, []);

  const categories = [...new Set(equipment.map((e) => e.type))].filter(Boolean);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = equipment.filter((e) => e.status === 'maintenance').length;

  const handleExport = () => {
    if (activeTab === 'current') {
      exportToXlsx(
        filteredEquipment.map((e) => ({
          'Инв. номер': e.serialNumber,
          'Наименование': e.name,
          'Категория': e.type,
          'Статус': STATUS_LABELS[e.status] ?? e.status,
          'Локация': e.location,
          'Ответственный': e.responsiblePerson ?? '',
          'Стоимость': e.purchasePrice ?? '',
        })),
        'equipment',
      );
    } else if (activeTab === 'movement') {
      exportToXlsx(
        movements.map((m) => ({
          'ID': m.id,
          'Оборудование': m.equipmentName,
          'Откуда': m.from,
          'Куда': m.to,
          'Дата': m.date,
          'Оператор': m.operator,
          'Причина': m.reason,
          'Примечания': m.notes,
        })),
        'movements',
      );
    } else {
      exportToXlsx(
        decommissions.map((d) => ({
          'ID': d.id,
          'Оборудование': d.equipment.name,
          'Дата списания': d.decommissionDate,
          'Причина': d.reason,
          'Утверждено': d.approvedBy,
          'Акт №': d.actNumber,
          'Примечания': d.notes,
        })),
        'decommissions',
      );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Отчёты об инвентаризации</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Экспорт PDF
            </Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Активные позиции</p>
                  <p className="text-2xl font-bold">{loadingEq ? '…' : equipment.length}</p>
                  <p className="text-xs text-blue-600">Всего единиц оборудования</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Категорий</p>
                  <p className="text-2xl font-bold">{loadingEq ? '…' : categories.length}</p>
                  <p className="text-xs text-emerald-600">Уникальных категорий</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">На обслуживании</p>
                  <p className="text-2xl font-bold">{loadingEq ? '…' : lowStockCount}</p>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs mt-1">
                    Требует внимания
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Текущий запас</TabsTrigger>
            <TabsTrigger value="movement">История перемещений</TabsTrigger>
            <TabsTrigger value="decommissioned">Списанные</TabsTrigger>
          </TabsList>

          {/* ── Current stock ── */}
          <TabsContent value="current" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Инв. номер или название"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                >
                  Сбросить
                </Button>
              </div>
            </div>

            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Локация</TableHead>
                    <TableHead>Ответственный</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEq ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Загрузка…
                      </TableCell>
                    </TableRow>
                  ) : filteredEquipment.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Нет данных
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipment.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm text-blue-600">
                          {item.serialNumber}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.type}</TableCell>
                        <TableCell className="text-muted-foreground">{item.location}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.responsiblePerson ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColors[item.status] ?? 'bg-gray-100 text-gray-700'}
                          >
                            {STATUS_LABELS[item.status] ?? item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {!loadingEq && (
                <div className="px-4 py-3 border-t text-sm text-muted-foreground">
                  Показано {filteredEquipment.length} из {equipment.length}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Movement history ── */}
          <TabsContent value="movement" className="space-y-4">
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Оборудование</TableHead>
                    <TableHead>Откуда</TableHead>
                    <TableHead>Куда</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Оператор</TableHead>
                    <TableHead>Причина</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingMv ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Загрузка…
                      </TableCell>
                    </TableRow>
                  ) : movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <RotateCcw className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-muted-foreground">История перемещений пуста</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((m) => (
                      <TableRow key={m.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{m.equipmentName}</TableCell>
                        <TableCell className="text-muted-foreground">{m.from}</TableCell>
                        <TableCell className="text-muted-foreground">{m.to}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(m.date).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{m.operator}</TableCell>
                        <TableCell className="text-muted-foreground">{m.reason}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {!loadingMv && movements.length > 0 && (
                <div className="px-4 py-3 border-t text-sm text-muted-foreground">
                  Всего записей: {movements.length}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Decommissioned ── */}
          <TabsContent value="decommissioned" className="space-y-4">
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Оборудование</TableHead>
                    <TableHead>Дата списания</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Утверждено</TableHead>
                    <TableHead>Акт №</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDc ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Загрузка…
                      </TableCell>
                    </TableRow>
                  ) : decommissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-muted-foreground">Списанных позиций нет</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    decommissions.map((d) => (
                      <TableRow key={d.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{d.equipment.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(d.decommissionDate).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{d.reason}</TableCell>
                        <TableCell className="text-muted-foreground">{d.approvedBy}</TableCell>
                        <TableCell className="text-muted-foreground">{d.actNumber}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {!loadingDc && decommissions.length > 0 && (
                <div className="px-4 py-3 border-t text-sm text-muted-foreground">
                  Всего записей: {decommissions.length}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
