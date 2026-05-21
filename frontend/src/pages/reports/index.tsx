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
  { id: 'SKU-001', productName: 'Electric Forklift C203', category: 'Machinery', qty: 5, unitValue: '$12,500', status: 'In Stock' },
  { id: 'SKU-002', productName: 'Dell Latitude E7', category: 'Electronics', qty: 3, unitValue: '$1,200', status: 'Low Stock' },
  { id: 'SKU-003', productName: 'Industrial Printer X2', category: 'Electronics', qty: 8, unitValue: '$850', status: 'In Stock' },
  { id: 'SKU-004', productName: 'Hand Tool Set', category: 'Tools', qty: 15, unitValue: '$250', status: 'In Stock' },
  { id: 'SKU-005', productName: 'Hydraulic Lift 300-DC', category: 'Machinery', qty: 2, unitValue: '$8,000', status: 'Low Stock' },
  { id: 'SKU-006', productName: 'Handheld Scanner Gen-4', category: 'Electronics', qty: 12, unitValue: '$450', status: 'Reordering' },
];

const equipmentCategories = ['Machinery', 'Electronics', 'Tools'];

const statusColors: Record<string, string> = {
  'In Stock': 'bg-emerald-100 text-emerald-700',
  'Low Stock': 'bg-amber-100 text-amber-700',
  Reordering: 'bg-blue-100 text-blue-700',
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredItems = inventoryReports.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = inventoryReports.reduce(
    (sum, item) => sum + parseFloat(item.unitValue.replace('$', '').replace(',', '')) * item.qty,
    0,
  );
  const totalItems = inventoryReports.reduce((sum, item) => sum + item.qty, 0);
  const lowStockCount = inventoryReports.filter((item) => item.status === 'Low Stock').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Inventory Reports</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600">+2.5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active SKU Items</p>
                  <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">+8.5% from last month</p>
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
                  <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                  <p className="text-2xl font-bold">{lowStockCount}</p>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs mt-1">
                    Action Required
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Stock</TabsTrigger>
            <TabsTrigger value="movement">Movement History</TabsTrigger>
            <TabsTrigger value="decommissioned">Decommissioned</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SKU or Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {equipmentCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Global Distribution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Global Distribution</SelectItem>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="building-a">Building A</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  Reset
                </Button>
                <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                  Apply Filters
                </Button>
              </div>
            </div>

            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Item ID / SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Qty / Unit</TableHead>
                    <TableHead className="text-right">Unit Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm text-blue-600">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.qty} Units
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
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to {filteredItems.length} of {inventoryReports.length} results
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
              <p>Movement history data will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="decommissioned">
            <div className="border rounded-lg bg-card p-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Decommissioned items will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
