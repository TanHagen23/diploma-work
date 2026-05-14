export type EquipmentStatus = 'in_stock' | 'deployed' | 'decommissioned';
export type UserRole = 'admin' | 'operator' | 'viewer';
export type MovementStatus = 'completed' | 'in_progress';

export interface Equipment {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  department: string;
  status: EquipmentStatus;
  location: string;
  createdAt: string;
}

export interface Movement {
  id: number;
  equipment: Equipment;
  equipmentName: string;
  from: string;
  to: string;
  date: string;
  operator: string;
  status: MovementStatus;
}

export interface User {
  id: number;
  fullName: string;
  login: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  location: string;
}

export interface DashboardStats {
  totalEquipment: number;
  totalEquipmentChange: string;
  deployed: number;
  deployedChange: string;
  inStock: number;
  inStockChange: string;
  decommissioned: number;
  decommissionedChange: string;
}
