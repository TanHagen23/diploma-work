import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppLayout } from '@/widgets/app-layout';
import { EquipmentFilters } from '@/features/equipment-filter';
import { MoveEquipmentModal } from '@/features/equipment-move';
import { EquipmentRow, EquipmentCard, equipmentApi } from '@/entities/equipment';
import { Button, Table, TableBody, TableHead, TableHeader, TableRow, EmptyState, Skeleton } from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { Plus, Package, Filter } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useIsDesktop } from '@/shared/hooks/useMediaQuery';
import { authStore } from '@/features/auth';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  
  const debouncedSearch = useDebounce(search, 300);
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const userRole = authStore.getUserRole();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await equipmentApi.getAll();
        setEquipment(data);
        setFilteredEquipment(data);
      } catch (error) {
        console.error('Failed to fetch equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  useEffect(() => {
    let filtered = equipment;

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((item) => 
        item.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredEquipment(filtered);
  }, [debouncedSearch, statusFilter, typeFilter, equipment]);

  const handleEquipmentSelect = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setMoveModalOpen(true);
  };

  return (
    <AppLayout 
      title="Equipment Inventory" 
      subtitle="View and manage all warehouse equipment"
    >
      <div className="space-y-4">
        {/* Header with filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <EquipmentFilters
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />
          </div>
          
          {userRole !== 'viewer' && (
            <>
              {/* Desktop button */}
              <Button
                className="hidden lg:flex bg-[#2E74B5] hover:bg-[#245d91] gap-2"
                onClick={() => navigate('/equipment/new')}
              >
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>

              {/* Mobile FAB */}
              <Button
                className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 shadow-lg bg-[#2E74B5] hover:bg-[#245d91]"
                size="icon"
                onClick={() => navigate('/equipment/new')}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>

        {/* Equipment list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
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
                  Add Equipment
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Desktop table view */}
            {isDesktop ? (
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((item) => (
                      <EquipmentRow 
                        key={item.id} 
                        equipment={item}
                        onSelect={handleEquipmentSelect}
                      />
                    ))}
                  </TableBody>
                </Table>
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
          </>
        )}

        {/* Results count */}
        {!loading && filteredEquipment.length > 0 && (
          <p className="text-sm text-gray-500 text-center">
            Showing {filteredEquipment.length} of {equipment.length} items
          </p>
        )}
      </div>

      {/* Move Equipment Modal */}
      <MoveEquipmentModal
        open={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        equipment={selectedEquipment}
      />
    </AppLayout>
  );
}
