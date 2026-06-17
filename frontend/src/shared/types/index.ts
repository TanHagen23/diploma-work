export type EquipmentStatus = 'active' | 'maintenance' | 'decommissioned';
export type UserRole = 'admin' | 'manager' | 'viewer';

export interface Equipment {
  id: number;
  name: string;
  type: string;           // category
  serialNumber: string;   // inventory_number
  department: string;     // responsible_person
  status: EquipmentStatus;
  location: string;
  createdAt: string;
  responsiblePerson?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
}

export interface Movement {
  id: number;
  equipment: Equipment;
  equipmentId: number;
  equipmentName: string;
  from: string;           // from_location
  to: string;             // to_location
  date: string;           // movement_date
  operator: string;       // responsible_person
  reason: string;
  notes: string;
}

export interface Decommission {
  id: number;
  equipment: Equipment;
  equipmentId: number;
  reason: string;
  decommissionDate: string;  // decommission_date
  approvedBy: string;        // approved_by
  actNumber: string;         // act_number
  notes: string;
  createdAt: string;
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
  active: number;
  activeChange: string;
  maintenance: number;
  maintenanceChange: string;
  decommissioned: number;
  decommissionedChange: string;
}

export interface EquipmentPayload {
  name: string;
  inventory_number: string;
  category: string;
  status: EquipmentStatus;
  location: string;
  responsible_person: string;
  purchase_date?: string;
  purchase_price?: number | null;
  notes?: string;
}
