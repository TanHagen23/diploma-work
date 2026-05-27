import { TableCell, TableRow, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { EquipmentBadge } from './EquipmentBadge';
import { Package, MoreHorizontal, Edit, Trash2, ArrowRightLeft } from 'lucide-react';

interface EquipmentRowProps {
  equipment: Equipment;
  onSelect?: (equipment: Equipment) => void;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (equipment: Equipment) => void;
}

export function EquipmentRow({ equipment, onSelect, onEdit, onDelete }: EquipmentRowProps) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell>
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{equipment.name}</p>
          <p className="text-sm text-muted-foreground">{equipment.department}</p>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{equipment.type}</TableCell>
      <TableCell className="font-mono text-sm text-muted-foreground">{equipment.serialNumber}</TableCell>
      <TableCell className="text-muted-foreground">{equipment.location}</TableCell>
      <TableCell>
        <EquipmentBadge status={equipment.status} />
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSelect?.(equipment)}>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Переместить
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(equipment)}>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
              onClick={() => onDelete?.(equipment)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
