import { useState, useEffect } from 'react';
import { AppLayout } from '@/widgets/app-layout';
import { EquipmentFormModal } from '@/features/equipment-crud/ui/EquipmentFormModal';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { Plus, Search, Filter, Package } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useIsDesktop } from '@/shared/hooks/useMediaQuery';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Equipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const isDesktop = useIsDesktop();

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentApi.getAll();
      setEquipment(data);
      setFilteredEquipment(data);
    } catch {
      setError('Не удалось загрузить данные. Проверьте соединение с сервером.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEquipment(); }, []);

  useEffect(() => {
    let filtered = equipment;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.serialNumber.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    setFilteredEquipment(filtered);
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, equipment]);

  const totalPages = Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE) || 1;
  const paginated = filteredEquipment.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleAddNew = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (eq: Equipment) => {
    setEditTarget(eq);
    setFormOpen(true);
  };

  const handleSaved = (saved: Equipment) => {
    setEquipment((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await equipmentApi.delete(deleteTarget.id);
      setEquipment((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      toast.success(`«${deleteTarget.name}» удалено`);
    } catch {
      toast.error('Ошибка при удалении');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Оборудование</h1>
            <p className="text-muted-foreground mt-1">
              Управление и учёт всех активов склада.
            </p>
          </div>
          <Button
            className="hidden lg:flex bg-[#2563eb] hover:bg-[#1d4ed8] gap-2"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4" />
            Добавить
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, номеру или локации..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активно</SelectItem>
              <SelectItem value="maintenance">На обслуживании</SelectItem>
              <SelectItem value="decommissioned">Списано</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={fetchEquipment}>
              Повторить
            </Button>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Оборудование не найдено"
            description="Измените фильтры или добавьте новое оборудование."
            action={
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            }
          />
        ) : isDesktop ? (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12" />
                  <TableHead>Наименование</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Инв. номер</TableHead>
                  <TableHead>Местонахождение</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <EquipmentRow
                    key={item.id}
                    equipment={item}
                    onSelect={() => {}}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredEquipment.length)} из{' '}
                {filteredEquipment.length}
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
          <div className="grid grid-cols-1 gap-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard key={item.id} equipment={item} onSelect={() => handleEdit(item)} />
            ))}
          </div>
        )}
      </div>

      <Button
        className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 shadow-lg bg-[#2563eb] hover:bg-[#1d4ed8]"
        size="icon"
        onClick={handleAddNew}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <EquipmentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        equipment={editTarget}
        onSaved={handleSaved}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить оборудование?</AlertDialogTitle>
            <AlertDialogDescription>
              «{deleteTarget?.name}» будет удалено безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
