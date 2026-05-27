import axiosInstance from './axiosInstance';
import { Decommission } from '@/shared/types';
import { toEquipment } from './equipment';

interface RawDecommission {
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
  reason: string;
  decommission_date: string;
  approved_by: string;
  act_number: string;
  notes: string;
  created_at: string;
}

export interface CreateDecommissionPayload {
  equipment: number;
  reason: string;
  decommission_date: string;
  approved_by: string;
  act_number: string;
  notes?: string;
}

function toDecommission(raw: RawDecommission): Decommission {
  return {
    id: raw.id,
    equipment: toEquipment(raw.equipment_detail),
    equipmentId: raw.equipment,
    reason: raw.reason,
    decommissionDate: raw.decommission_date,
    approvedBy: raw.approved_by,
    actNumber: raw.act_number,
    notes: raw.notes,
    createdAt: raw.created_at,
  };
}

export const decommissionsApi = {
  getDecommissions: (): Promise<Decommission[]> =>
    axiosInstance
      .get<RawDecommission[]>('/decommissions/')
      .then((r) => r.data.map(toDecommission)),

  createDecommission: (data: CreateDecommissionPayload): Promise<Decommission> =>
    axiosInstance
      .post<RawDecommission>('/decommissions/', data)
      .then((r) => toDecommission(r.data)),
};
