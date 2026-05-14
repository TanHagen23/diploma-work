import { User } from '@/shared/types';

const mockUsers: User[] = [
  {
    id: 1,
    fullName: 'John Doe',
    login: 'john.doe',
    email: 'john@figma.com',
    role: 'admin',
    department: 'IT',
    lastLogin: '2024-03-14',
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    login: 'jane.smith',
    email: 'jane.smith@figma.com',
    role: 'operator',
    department: 'Warehouse',
    lastLogin: '2024-03-15',
  },
  {
    id: 3,
    fullName: 'Robert Brown',
    login: 'robert.brown',
    email: 'robert.b@figma.com',
    role: 'viewer',
    department: 'Logistics',
    lastLogin: '2024-03-13',
  },
  {
    id: 4,
    fullName: 'Emily Johnson',
    login: 'emily.j',
    email: 'emily.johnson@figma.com',
    role: 'operator',
    department: 'Maintenance',
    lastLogin: '2024-03-14',
  },
  {
    id: 5,
    fullName: 'Michael Wilson',
    login: 'michael.w',
    email: 'm.wilson@figma.com',
    role: 'admin',
    department: 'IT',
    lastLogin: '2024-03-15',
  },
];

export const userApi = {
  getAll: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  getById: async (id: number): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers.find((u) => u.id === id)), 300);
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers[0]), 300);
    });
  },
};
