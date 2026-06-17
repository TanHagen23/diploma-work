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
import XLSXStyle from 'xlsx-js-style';

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

// ── Excel export ───────────────────────────────────────────────────────────
function getStatusCellStyle(value: string): Record<string, unknown> | null {
  const v = value.toLowerCase();
  if (v === 'в наличии' || v === 'active') {
    return { fill: { patternType: 'solid', fgColor: { rgb: 'DCFCE7' } }, font: { color: { rgb: '15803D' }, name: 'Calibri' }, alignment: { horizontal: 'center', vertical: 'center' } };
  }
  if (v === 'на обслуживании' || v === 'maintenance') {
    return { fill: { patternType: 'solid', fgColor: { rgb: 'FEF9C3' } }, font: { color: { rgb: '92400E' }, name: 'Calibri' }, alignment: { horizontal: 'center', vertical: 'center' } };
  }
  if (v === 'списано' || v === 'decommissioned') {
    return { fill: { patternType: 'solid', fgColor: { rgb: 'FEE2E2' } }, font: { color: { rgb: '991B1B' }, name: 'Calibri' }, alignment: { horizontal: 'center', vertical: 'center' } };
  }
  return null;
}

function buildStyledWorksheet(
  headers: string[],
  dataRows: string[][],
  statusColIdx: number | null,
  sheetLabel: string,
): Record<string, unknown> {
  const numCols = headers.length;
  const ws: Record<string, unknown> = {};
  const today = new Date().toLocaleDateString('ru-RU');
  const count = dataRows.length;

  // Row 0 — title
  ws[XLSXStyle.utils.encode_cell({ r: 0, c: 0 })] = {
    v: 'AssetManager WMS — Отчёт об инвентаризации оборудования',
    t: 's',
    s: {
      fill: { patternType: 'solid', fgColor: { rgb: '1E3A5F' } },
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center' },
    },
  };

  // Row 1 — date / count
  ws[XLSXStyle.utils.encode_cell({ r: 1, c: 0 })] = {
    v: `Дата формирования: ${today} | Всего позиций: ${count}`,
    t: 's',
    s: {
      fill: { patternType: 'solid', fgColor: { rgb: 'EFF6FF' } },
      font: { sz: 11, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center' },
    },
  };

  // Row 2 — empty (skip, covered by merge)

  // Row 3 — column headers
  headers.forEach((h, c) => {
    ws[XLSXStyle.utils.encode_cell({ r: 3, c })] = {
      v: h,
      t: 's',
      s: {
        fill: { patternType: 'solid', fgColor: { rgb: '2563EB' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, name: 'Calibri' },
        alignment: { horizontal: 'center', vertical: 'center' },
      },
    };
  });

  // Rows 4+ — data with zebra
  dataRows.forEach((row, rowIdx) => {
    const zebra = rowIdx % 2 === 0 ? 'FFFFFF' : 'F1F5F9';
    row.forEach((val, c) => {
      const ref = XLSXStyle.utils.encode_cell({ r: 4 + rowIdx, c });
      const statusStyle = statusColIdx === c ? getStatusCellStyle(val) : null;
      ws[ref] = {
        v: val ?? '',
        t: 's',
        s: statusStyle ?? {
          fill: { patternType: 'solid', fgColor: { rgb: zebra } },
          font: { name: 'Calibri' },
          alignment: { vertical: 'center' },
        },
      };
    });
  });

  // Last row — total
  const totalRow = 4 + count;
  for (let c = 0; c < numCols; c++) {
    ws[XLSXStyle.utils.encode_cell({ r: totalRow, c })] = {
      v: c === 0 ? `Итого: ${count} ${sheetLabel}` : '',
      t: 's',
      s: {
        fill: { patternType: 'solid', fgColor: { rgb: 'DBEAFE' } },
        font: { bold: true, name: 'Calibri' },
        alignment: { vertical: 'center' },
      },
    };
  }

  ws['!ref'] = XLSXStyle.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: totalRow, c: numCols - 1 } });

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: numCols - 1 } },
    { s: { r: totalRow, c: 0 }, e: { r: totalRow, c: numCols - 1 } },
  ];

  ws['!cols'] = headers.map((h, idx) => {
    const maxLen = Math.max(h.length, ...dataRows.map((r) => String(r[idx] ?? '').length));
    return { wch: maxLen + 4 };
  });

  ws['!rows'] = [
    { hpt: 36 },
    { hpt: 22 },
    { hpt: 8 },
    { hpt: 24 },
  ];

  return ws;
}

// ── Skeleton helpers ───────────────────────────────────────────────────────
function SkeletonRows({ cols, count = 5 }: { cols: number; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-muted animate-pulse rounded" style={{ width: j === 0 ? '6rem' : '100%' }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function SkeletonStat() {
  return <div className="h-8 w-16 bg-muted animate-pulse rounded mt-0.5" />;
}

// ── Component ──────────────────────────────────────────────────────────────
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
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) || item.serialNumber.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || item.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;

  // ── Export handlers ──────────────────────────────────────────────────────
  const handleExportExcel = () => {
    let ws: Record<string, unknown>;
    let sheetName: string;
    let fileName: string;

    if (activeTab === 'current') {
      const headers = ['Инв. номер', 'Наименование', 'Категория', 'Статус', 'Местонахождение', 'Ответственный'];
      const rows = filteredEquipment.map((e) => [
        e.serialNumber,
        e.name,
        e.type,
        STATUS_LABELS[e.status] ?? e.status,
        e.location,
        e.responsiblePerson ?? '',
      ]);
      ws = buildStyledWorksheet(headers, rows, 3, 'единиц оборудования');
      sheetName = 'Оборудование';
      fileName = 'equipment_report.xlsx';
    } else if (activeTab === 'movement') {
      const headers = ['Оборудование', 'Инв. номер', 'Откуда', 'Куда', 'Дата', 'Ответственный', 'Причина'];
      const rows = movements.map((m) => [
        m.equipmentName,
        m.equipment.serialNumber,
        m.from,
        m.to,
        new Date(m.date).toLocaleDateString('ru-RU'),
        m.operator,
        m.reason,
      ]);
      ws = buildStyledWorksheet(headers, rows, null, 'записей перемещений');
      sheetName = 'Перемещения';
      fileName = 'movements_report.xlsx';
    } else {
      const headers = ['Акт №', 'Оборудование', 'Инв. номер', 'Дата', 'Причина', 'Утверждено'];
      const rows = decommissions.map((d) => [
        d.actNumber,
        d.equipment.name,
        d.equipment.serialNumber,
        new Date(d.decommissionDate).toLocaleDateString('ru-RU'),
        d.reason,
        d.approvedBy,
      ]);
      ws = buildStyledWorksheet(headers, rows, null, 'позиций списано');
      sheetName = 'Списание';
      fileName = 'decommissions_report.xlsx';
    }

    const wb = XLSXStyle.utils.book_new();
    XLSXStyle.utils.book_append_sheet(wb, ws, sheetName);
    XLSXStyle.writeFile(wb, fileName);
  };

  const handlePrint = () => {
    const prevTitle = document.title;
    document.title = `Отчёт — ${activeTab} — ${new Date().toLocaleDateString('ru-RU')}`;
    setTimeout(() => { window.print(); document.title = prevTitle; }, 100);
  };

  const today = new Date().toLocaleDateString('ru-RU');
  const printConfig = {
    current: {
      title: 'Текущий запас',
      headers: ['Инв. номер', 'Наименование', 'Категория', 'Статус', 'Местонахождение', 'Ответственный'],
      rows: filteredEquipment.map((e) => [e.serialNumber, e.name, e.type, STATUS_LABELS[e.status] ?? e.status, e.location, e.responsiblePerson ?? '—']),
    },
    movement: {
      title: 'История перемещений',
      headers: ['Оборудование', 'Инв. номер', 'Откуда', 'Куда', 'Дата', 'Ответственный', 'Причина'],
      rows: movements.map((m) => [m.equipmentName, m.equipment.serialNumber, m.from, m.to, new Date(m.date).toLocaleDateString('ru-RU'), m.operator, m.reason]),
    },
    decommissioned: {
      title: 'Списанные позиции',
      headers: ['Акт №', 'Оборудование', 'Инв. номер', 'Дата', 'Причина', 'Утверждено'],
      rows: decommissions.map((d) => [d.actNumber, d.equipment.name, d.equipment.serialNumber, new Date(d.decommissionDate).toLocaleDateString('ru-RU'), d.reason, d.approvedBy]),
    },
  };
  const activePrint = printConfig[activeTab as keyof typeof printConfig] ?? printConfig.current;

  return (
    <>
    <style>{`
      .print-report { display: none; }
      @media print {
        * { visibility: hidden !important; }
        .print-report {
          display: block !important;
          visibility: visible !important;
          position: absolute; top: 0; left: 0; width: 100%;
          padding: 30px; background: white; color: black;
          font-family: Arial, sans-serif;
        }
        .print-report * { visibility: visible !important; }
        .print-header { margin-bottom: 24px; border-bottom: 2px solid #1E3A5F; padding-bottom: 12px; }
        .print-title { font-size: 22px; font-weight: bold; color: #1E3A5F; }
        .print-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
        .print-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .print-table th { text-align: left; padding: 8px 12px; background: #2563EB; color: white; font-size: 12px; }
        .print-table td { padding: 9px 12px; border: 1px solid #e2e8f0; font-size: 12px; }
        .print-table tr:nth-child(even) td { background: #F1F5F9; }
      }
    `}</style>
    <AppLayout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Отчёты об инвентаризации</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <FileText className="h-4 w-4 mr-2" />
              Экспорт PDF
            </Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт Excel
            </Button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего позиций</p>
                  {loadingEq ? <SkeletonStat /> : (
                    <p className="text-2xl font-bold">{equipment.length}</p>
                  )}
                  <p className="text-xs text-blue-600">Единиц оборудования</p>
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
                  {loadingEq ? <SkeletonStat /> : (
                    <p className="text-2xl font-bold">{categories.length}</p>
                  )}
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
                  {loadingEq ? <SkeletonStat /> : (
                    <p className="text-2xl font-bold">{maintenanceCount}</p>
                  )}
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs mt-1">
                    Требует внимания
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Текущий запас</TabsTrigger>
            <TabsTrigger value="movement">История перемещений</TabsTrigger>
            <TabsTrigger value="decommissioned">Списанные</TabsTrigger>
          </TabsList>

          {/* ── Current stock ── */}
          <TabsContent value="current" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
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
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
              >
                Сбросить
              </Button>
            </div>

            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Местонахождение</TableHead>
                    <TableHead>Ответственный</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEq ? (
                    <SkeletonRows cols={6} />
                  ) : filteredEquipment.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
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
          <TabsContent value="movement">
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Оборудование</TableHead>
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Откуда</TableHead>
                    <TableHead>Куда</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Ответственный</TableHead>
                    <TableHead>Причина</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingMv ? (
                    <SkeletonRows cols={7} />
                  ) : movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <RotateCcw className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                        <p className="text-muted-foreground">История перемещений пуста</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((m) => (
                      <TableRow key={m.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{m.equipmentName}</TableCell>
                        <TableCell className="font-mono text-sm text-blue-600">
                          {m.equipment.serialNumber}
                        </TableCell>
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
          <TabsContent value="decommissioned">
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Акт №</TableHead>
                    <TableHead>Оборудование</TableHead>
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Дата списания</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Утверждено</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingDc ? (
                    <SkeletonRows cols={6} />
                  ) : decommissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                        <p className="text-muted-foreground">Списанных позиций нет</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    decommissions.map((d) => (
                      <TableRow key={d.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm text-blue-600">
                          {d.actNumber}
                        </TableCell>
                        <TableCell className="font-medium">{d.equipment.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {d.equipment.serialNumber}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(d.decommissionDate).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{d.reason}</TableCell>
                        <TableCell className="text-muted-foreground">{d.approvedBy}</TableCell>
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

    {/* ── Print-only report ── */}
    <div className="print-report">
      <div className="print-header">
        <div className="print-title">AssetManager WMS — Отчёт об инвентаризации</div>
        <div className="print-subtitle">
          {activePrint.title} · Дата формирования: {today} · Всего позиций: {activePrint.rows.length}
        </div>
      </div>
      <table className="print-table">
        <thead>
          <tr>
            {activePrint.headers.map((h) => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {activePrint.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
