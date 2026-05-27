import axiosInstance from './axiosInstance';
import { Equipment, EquipmentPayload, EquipmentStatus } from '@/shared/types';

interface RawEquipment {
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
}

export function toEquipment(raw: RawEquipment): Equipment {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.category,
    serialNumber: raw.inventory_number,
    department: raw.responsible_person,
    status: raw.status as EquipmentStatus,
    location: raw.location,
    createdAt: raw.created_at,
    responsiblePerson: raw.responsible_person,
    purchaseDate: raw.purchase_date ?? undefined,
    purchasePrice: raw.purchase_price ? parseFloat(raw.purchase_price) : undefined,
    notes: raw.notes,
  };
}

export const equipmentApi = {
  getEquipment: (): Promise<Equipment[]> =>
    axiosInstance.get<RawEquipment[]>('/equipment/').then((r) => r.data.map(toEquipment)),

  createEquipment: (data: EquipmentPayload): Promise<Equipment> =>
    axiosInstance.post<RawEquipment>('/equipment/', data).then((r) => toEquipment(r.data)),

  updateEquipment: (id: number, data: Partial<EquipmentPayload>): Promise<Equipment> =>
    axiosInstance.patch<RawEquipment>(`/equipment/${id}/`, data).then((r) => toEquipment(r.data)),

  deleteEquipment: (id: number): Promise<void> =>
    axiosInstance.delete(`/equipment/${id}/`).then(() => undefined),
};
