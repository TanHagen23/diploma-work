import { TableCell, TableRow } from '@/shared/ui';
import { Equipment } from '@/shared/types';
import { EquipmentBadge } from './EquipmentBadge';
import { Package, Edit, Trash2, ArrowLeftRight } from 'lucide-react';

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
        <div className="flex justify-end gap-1">
          <button
            title="Переместить"
            onClick={() => onSelect?.(equipment)}
            className="p-2 text-muted-foreground hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeftRight size={16} />
          </button>
          <button
            title="Редактировать"
            onClick={() => onEdit?.(equipment)}
            className="p-2 text-muted-foreground hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            title="Удалить"
            onClick={() => onDelete?.(equipment)}
            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
