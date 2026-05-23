import axiosInstance from './axiosInstance';
import { Equipment, EquipmentStatus } from '@/shared/types';

interface RawEquipment {
  id: number;
  name: string;
  category: string;
  inventory_number: string;
  department: string;
  status: string;
  location: string;
  created_at: string;
}

function toEquipment(raw: RawEquipment): Equipment {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.category,
    serialNumber: raw.inventory_number,
    department: raw.department,
    status: raw.status as EquipmentStatus,
    location: raw.location,
    createdAt: raw.created_at,
  };
}

export const equipmentApi = {
  getEquipment: (): Promise<Equipment[]> =>
    axiosInstance.get<RawEquipment[]>('/equipment/').then((r) => r.data.map(toEquipment)),

  createEquipment: (data: Omit<Equipment, 'id'>): Promise<Equipment> =>
    axiosInstance.post<RawEquipment>('/equipment/', data).then((r) => toEquipment(r.data)),

  updateEquipment: (id: number, data: Partial<Equipment>): Promise<Equipment> =>
    axiosInstance.patch<RawEquipment>(`/equipment/${id}/`, data).then((r) => toEquipment(r.data)),

  deleteEquipment: (id: number): Promise<void> =>
    axiosInstance.delete(`/equipment/${id}/`).then(() => undefined),
};
