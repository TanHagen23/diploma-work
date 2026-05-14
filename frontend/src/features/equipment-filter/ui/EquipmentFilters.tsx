import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui';
import { useIsDesktop } from '@/shared/hooks/useMediaQuery';
import { Search } from 'lucide-react';

interface EquipmentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export function EquipmentFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}: EquipmentFiltersProps) {
  const isDesktop = useIsDesktop();

  const filtersContent = (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, serial, or location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="in_stock">In Stock</SelectItem>
          <SelectItem value="deployed">Deployed</SelectItem>
          <SelectItem value="decommissioned">Decommissioned</SelectItem>
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="forklift">Forklift</SelectItem>
          <SelectItem value="laptop">Laptop</SelectItem>
          <SelectItem value="printer">Printer</SelectItem>
          <SelectItem value="machine">Machine</SelectItem>
          <SelectItem value="tool">Hand Tool</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  if (isDesktop) {
    return filtersContent;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="filters" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="text-sm font-medium">Filters</span>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          {filtersContent}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
