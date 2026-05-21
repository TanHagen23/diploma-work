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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';
import { movementApi } from '@/entities/movement';
import { Movement } from '@/shared/types';
import { Search, Plus, ArrowRightLeft, Info, Package } from 'lucide-react';

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-100 text-slate-700',
};

const statusLabels: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  pending: 'Pending',
};

const mockLocations = [
  'Warehouse A',
  'Warehouse B',
  'Building A',
  'Building B',
  'Building C',
  'Storage',
  'IT Stock',
];

const mockPersonnel = [
  'John Doe',
  'Jane Smith',
  'Michael Wilson',
  'Emily Johnson',
  'Alex Rivera',
];

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    movementApi.getAll().then((data) => {
      setMovements(data);
      setLoading(false);
    });
  }, []);

  const filtered = movements.filter((m) =>
    m.equipment.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Equipment Movements</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage asset transfers between locations.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                <Plus className="h-4 w-4 mr-2" />
                New Movement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Move Equipment</DialogTitle>
                <DialogDescription className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-lg text-blue-700">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Every movement is automatically logged in the audit history. Ensure the{' '}
                    <strong>Responsible Person</strong> is informed of the transfer details.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Equipment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">EQ-4452 - Electric Forklift C203</SelectItem>
                      <SelectItem value="2">DL-99123 - Dell Latitude E7</SelectItem>
                      <SelectItem value="5">IP-87654 - Industrial Printer X2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Location</Label>
                    <Input value="Harbor Site A" disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>To Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Site" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLocations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Transfer</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Responsible Person</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Personnel" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPersonnel.map((person) => (
                          <SelectItem key={person} value={person}>
                            {person}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#2563eb] hover:bg-[#1d4ed8]"
                  onClick={() => setDialogOpen(false)}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Confirm Movement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((movement) => (
                  <TableRow key={movement.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-slate-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{movement.equipment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {movement.equipment.serialNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{movement.from}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.to}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.date}</TableCell>
                    <TableCell className="text-muted-foreground">{movement.operator}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[movement.status]}>
                        {statusLabels[movement.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing 1 to {filtered.length} of {movements.length} movements
              </p>
              <div className="flex gap-1">
                {[1, 2, 3].map((page) => (
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
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
