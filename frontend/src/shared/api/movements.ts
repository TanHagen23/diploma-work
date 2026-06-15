import axiosInstance from './axiosInstance';
import { Movement } from '@/shared/types';
import { toEquipment } from './equipment';

interface RawMovement {
  id: number;
  equipment: number;
  equipment_detail: {
    id: number;
    name: string;
    category: string;
    inventory_number: string;
    status: string;
    location: string;
    responsible_person: string;
    purchase_date: string | null;
    purchase_price: string | null;
    notes: string;
    created_at: string;
  };
  from_location: string;
  to_location: string;
  responsible_person: string;
  movement_date: string;
  reason: string;
  notes: string;
  created_at: string;
}

export interface CreateMovementPayload {
  equipment: number;
  from_location: string;
  to_location: string;
  responsible_person: string;
  movement_date: string;
  reason: string;
  notes?: string;
}

function toMovement(raw: RawMovement): Movement {
  return {
    id: raw.id,
    equipment: toEquipment(raw.equipment_detail),
    equipmentId: raw.equipment,
    equipmentName: raw.equipment_detail.name,
    from: raw.from_location,
    to: raw.to_location,
    date: raw.movement_date,
    operator: raw.responsible_person,
    reason: raw.reason,
    notes: raw.notes,
  };
}

export const movementsApi = {
  getMovements: (): Promise<Movement[]> =>
    axiosInstance.get<RawMovement[]>('/movements/').then((r) => r.data.map(toMovement)),

  getRecent: (limit: number = 5): Promise<Movement[]> =>
    axiosInstance
      .get<RawMovement[]>('/movements/')
      .then((r) => r.data.slice(0, limit).map(toMovement)),

  createMovement: (data: CreateMovementPayload): Promise<Movement> =>
    axiosInstance.post<RawMovement>('/movements/', data).then((r) => toMovement(r.data)),

  deleteMovement: (id: number): Promise<void> =>
    axiosInstance.delete(`/movements/${id}/`).then(() => undefined),
};
