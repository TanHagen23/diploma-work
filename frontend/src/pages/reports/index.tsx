import { useState } from 'react';
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

const inventoryReports = [
  { id: 'АРТ-001', productName: 'Электропогрузчик C203', category: 'Техника', qty: 5, unitValue: '₽750 000', status: 'В наличии' },
  { id: 'АРТ-002', productName: 'Dell Latitude E7', category: 'Электроника', qty: 3, unitValue: '₽72 000', status: 'Мало' },
  { id: 'АРТ-003', productName: 'Промышленный принтер X2', category: 'Электроника', qty: 8, unitValue: '₽51 000', status: 'В наличии' },
  { id: 'АРТ-004', productName: 'Набор ручных инструментов', category: 'Инструменты', qty: 15, unitValue: '₽15 000', status: 'В наличии' },
  { id: 'АРТ-005', productName: 'Гидравлический подъёмник 300-DC', category: 'Техника', qty: 2, unitValue: '₽480 000', status: 'Мало' },
  { id: 'АРТ-006', productName: 'Сканер Gen-4', category: 'Электроника', qty: 12, unitValue: '₽27 000', status: 'Дозаказ' },
];

const equipmentCategories = ['Техника', 'Электроника', 'Инструменты'];

const statusColors: Record<string, string> = {
  'В наличии': 'bg-emerald-100 text-emerald-700',
  'Мало': 'bg-amber-100 text-amber-700',
  'Дозаказ': 'bg-blue-100 text-blue-700',
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredItems = inventoryReports.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = inventoryReports.reduce((sum, item) => sum + item.qty, 0);
  const lowStockCount = inventoryReports.filter((item) => item.status === 'Мало').length;

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
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
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
                  <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">+8.5% с прошлого месяца</p>
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
                  <p className="text-2xl font-bold">{equipmentCategories.length}</p>
                  <p className="text-xs text-emerald-600">+2.5% с прошлого месяца</p>
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
                  <p className="text-sm text-muted-foreground">Мало на складе</p>
                  <p className="text-2xl font-bold">{lowStockCount}</p>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs mt-1">
                    Требует внимания
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Текущий запас</TabsTrigger>
            <TabsTrigger value="movement">История перемещений</TabsTrigger>
            <TabsTrigger value="decommissioned">Списанные</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Артикул или название"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {equipmentCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все склады" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все склады</SelectItem>
                  <SelectItem value="warehouse-a">Склад А</SelectItem>
                  <SelectItem value="warehouse-b">Склад Б</SelectItem>
                  <SelectItem value="building-a">Корпус А</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}>
                  Сбросить
                </Button>
                <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  Применить
                </Button>
              </div>
            </div>

            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Артикул</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead className="text-right">Кол-во</TableHead>
                    <TableHead className="text-right">Стоимость</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действие</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm text-blue-600">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.qty} шт.
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.unitValue}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                          Подробнее
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Показано 1 — {filteredItems.length} из {inventoryReports.length}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? 'default' : 'outline'}
                      size="sm"
                      className={page === 1 ? 'bg-[#2563eb]' : ''}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="movement">
            <div className="border rounded-lg bg-card p-8 text-center text-muted-foreground">
              <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>История перемещений будет отображена здесь.</p>
            </div>
          </TabsContent>

          <TabsContent value="decommissioned">
            <div className="border rounded-lg bg-card p-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Списанные позиции будут отображены здесь.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
