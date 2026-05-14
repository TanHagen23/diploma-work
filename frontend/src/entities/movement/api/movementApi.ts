import { Movement } from '@/shared/types';

const mockMovements: Movement[] = [
  {
    id: 1,
    equipmentName: 'Electric Forklift C203',
    equipment: {
      id: 1,
      name: 'Electric Forklift C203',
      type: 'Forklift',
      serialNumber: 'EQ-4452',
      department: 'Warehouse A',
      status: 'in_stock',
      location: 'Building A',
      createdAt: '2024-01-15',
    },
    from: 'Warehouse A',
    to: 'Warehouse B',
    date: '2024-03-10',
    operator: 'John Doe',
    status: 'completed',
  },
  {
    id: 2,
    equipmentName: 'Dell Latitude E7',
    equipment: {
      id: 2,
      name: 'Dell Latitude E7',
      type: 'Laptop',
      serialNumber: 'DL-99123',
      department: 'IT Department',
      status: 'deployed',
      location: 'Building B',
      createdAt: '2024-02-20',
    },
    from: 'IT Stock',
    to: 'Jane Smith Desk',
    date: '2024-03-12',
    operator: 'Michael Wilson',
    status: 'completed',
  },
  {
    id: 3,
    equipmentName: 'Industrial Printer X2',
    equipment: {
      id: 5,
      name: 'Industrial Printer X2',
      type: 'Printer',
      serialNumber: 'IP-87654',
      department: 'Logistics',
      status: 'deployed',
      location: 'Building A',
      createdAt: '2024-01-20',
    },
    from: 'Storage',
    to: 'Building A - Floor 2',
    date: '2024-03-14',
    operator: 'Emily Johnson',
    status: 'in_progress',
  },
];

export const movementApi = {
  getAll: async (): Promise<Movement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMovements), 500);
    });
  },

  getRecent: async (limit: number = 5): Promise<Movement[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMovements.slice(0, limit)), 400);
    });
  },

  create: async (data: Omit<Movement, 'id'>): Promise<Movement> => {
    return new Promise((resolve) => {
      const newMovement = { ...data, id: Math.max(...mockMovements.map(m => m.id)) + 1 };
      mockMovements.push(newMovement);
      setTimeout(() => resolve(newMovement), 500);
    });
  },
};
