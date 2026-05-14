import axiosInstance from '@/shared/api/axiosInstance';
import { Equipment } from '@/shared/types';

// Mock data for development
const mockEquipment: Equipment[] = [
  {
    id: 1,
    name: 'Electric Forklift C203',
    type: 'Forklift',
    serialNumber: 'EQ-4452',
    department: 'Warehouse A',
    status: 'in_stock',
    location: 'Building A',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Dell Latitude E7',
    type: 'Laptop',
    serialNumber: 'DL-99123',
    department: 'IT Department',
    status: 'deployed',
    location: 'Building B',
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    name: 'Power Jack Manual',
    type: 'Hand Tool',
    serialNumber: 'SN-1421536',
    department: 'Warehouse B',
    status: 'in_stock',
    location: 'Building C',
    createdAt: '2024-03-10',
  },
  {
    id: 4,
    name: 'Hydraulic Lift 300-DC',
    type: 'Machine',
    serialNumber: 'HL-32145',
    department: 'Maintenance',
    status: 'decommissioned',
    location: 'Storage',
    createdAt: '2023-12-01',
  },
  {
    id: 5,
    name: 'Industrial Printer X2',
    type: 'Printer',
    serialNumber: 'IP-87654',
    department: 'Logistics',
    status: 'deployed',
    location: 'Building A',
    createdAt: '2024-01-20',
  },
];

export const equipmentApi = {
  getAll: async (): Promise<Equipment[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockEquipment), 500);
    });
  },

  getById: async (id: number): Promise<Equipment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockEquipment.find((eq) => eq.id === id)), 300);
    });
  },

  create: async (data: Omit<Equipment, 'id'>): Promise<Equipment> => {
    return new Promise((resolve) => {
      const newEquipment = { ...data, id: Math.max(...mockEquipment.map(e => e.id)) + 1 };
      mockEquipment.push(newEquipment);
      setTimeout(() => resolve(newEquipment), 500);
    });
  },

  update: async (id: number, data: Partial<Equipment>): Promise<Equipment> => {
    return new Promise((resolve, reject) => {
      const index = mockEquipment.findIndex((eq) => eq.id === id);
      if (index === -1) {
        setTimeout(() => reject(new Error('Equipment not found')), 300);
      } else {
        mockEquipment[index] = { ...mockEquipment[index], ...data };
        setTimeout(() => resolve(mockEquipment[index]), 500);
      }
    });
  },

  delete: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      const index = mockEquipment.findIndex((eq) => eq.id === id);
      if (index !== -1) {
        mockEquipment.splice(index, 1);
      }
      setTimeout(() => resolve(), 300);
    });
  },
};
