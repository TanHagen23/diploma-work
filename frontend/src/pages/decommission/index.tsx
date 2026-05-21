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
  CardHeader,
} from '@/shared/ui';
import { Search, Plus, CheckCircle, Clock, AlertTriangle, Package } from 'lucide-react';

const decommissionedItems = [
  {
    id: 'DEC-001',
    name: 'Forklift Model X200',
    type: 'Heavy Machinery',
    serialNumber: 'FL-2019-001',
    decommissionDate: '2024-01-15',
    reason: 'End of Life',
    status: 'Completed',
  },
  {
    id: 'DEC-002',
    name: 'Handheld Scanner Gen-3',
    type: 'Electronics',
    serialNumber: 'HS-2020-042',
    decommissionDate: '2024-02-20',
    reason: 'Damaged Beyond Repair',
    status: 'Pending Disposal',
  },
  {
    id: 'DEC-003',
    name: 'Industrial Conveyor Belt',
    type: 'Machinery',
    serialNumber: 'CB-2018-007',
    decommissionDate: '2024-03-01',
    reason: 'Obsolete',
    status: 'In Progress',
  },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-emerald-100 text-emerald-700',
  'Pending Disposal': 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
};

export default function DecommissionPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = decommissionedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Decommissioning</h1>
            <p className="text-muted-foreground">Manage equipment decommissioning and disposal</p>
          </div>
          <Button className="bg-[#2E74B5] hover:bg-[#245d91]">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-semibold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-semibold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Disposal</p>
                  <p className="text-2xl font-semibold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search decommissioned items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending Disposal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-slate-500" />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-blue-600">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.type}</TableCell>
                    <TableCell className="text-muted-foreground">{item.serialNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{item.decommissionDate}</TableCell>
                    <TableCell className="text-muted-foreground">{item.reason}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[item.status]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
