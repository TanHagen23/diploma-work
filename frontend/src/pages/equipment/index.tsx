import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppLayout } from '@/widgets/app-layout';
import { MoveEquipmentModal } from '@/features/equipment-move';
import { EquipmentRow, EquipmentCard, equipmentApi } from '@/entities/equipment';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
  Skeleton,
} from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { Plus, Search, Filter, Download, Package } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useIsDesktop } from '@/shared/hooks/useMediaQuery';
import { authStore } from '@/features/auth';

const ITEMS_PER_PAGE = 10;

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const userRole = authStore.getUserRole();

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentApi.getAll();
      setEquipment(data);
      setFilteredEquipment(data);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
      setError('Не удалось загрузить данные. Проверьте соединение с сервером.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    let filtered = equipment;

    if (debouncedSearch) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((item) =>
        item.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredEquipment(filtered);
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, typeFilter, equipment]);

  const totalPages = Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE) || 1;
  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEquipmentSelect = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setMoveModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Row 1: Title + New Asset button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Equipment Inventory</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all warehouse assets and their current status.
            </p>
          </div>
          {userRole !== 'viewer' && (
            <Button
              className="hidden lg:flex bg-[#2563eb] hover:bg-[#1d4ed8] gap-2"
              onClick={() => navigate('/equipment/new')}
            >
              <Plus className="w-4 h-4" />
              New Asset
            </Button>
          )}
        </div>

        {/* Row 2: Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets by name, serial, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="deployed">In Operation</SelectItem>
                <SelectItem value="maintenance">In Repair</SelectItem>
                <SelectItem value="decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="forklift">Forklift</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
                <SelectItem value="machine">Machine</SelectItem>
                <SelectItem value="tool">Hand Tool</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Equipment list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={fetchEquipment}
            >
              Повторить
            </Button>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No equipment found"
            description="Try adjusting your filters or add new equipment to get started."
            action={
              userRole !== 'viewer' ? (
                <Button onClick={() => navigate('/equipment/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Asset
                </Button>
              ) : undefined
            }
          />
        ) : isDesktop ? (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEquipment.map((item) => (
                  <EquipmentRow
                    key={item.id}
                    equipment={item}
                    onSelect={handleEquipmentSelect}
                  />
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredEquipment.length)} of{' '}
                {filteredEquipment.length} assets
              </p>
              {totalPages > 1 && (
                <div className="flex gap-1">
                  {pageNumbers.map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className={page === currentPage ? 'bg-[#2563eb] hover:bg-[#1d4ed8]' : ''}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile card view */
          <div className="grid grid-cols-1 gap-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onSelect={handleEquipmentSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      {userRole !== 'viewer' && (
        <Button
          className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 shadow-lg bg-[#2563eb] hover:bg-[#1d4ed8]"
          size="icon"
          onClick={() => navigate('/equipment/new')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      <MoveEquipmentModal
        open={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        equipment={selectedEquipment}
      />
    </AppLayout>
  );
}
