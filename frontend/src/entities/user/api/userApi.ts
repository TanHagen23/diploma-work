import axiosInstance from '@/shared/api/axiosInstance';
import { User } from '@/shared/types';

interface DjangoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  role: string;
  profile: {
    department: string;
    phone: string;
  } | null;
}

function mapUser(raw: DjangoUser): User {
  const fullName = [raw.first_name, raw.last_name].filter(Boolean).join(' ') || raw.username;
  return {
    id: raw.id,
    fullName,
    login: raw.username,
    email: raw.email,
    role: raw.role as User['role'],
    department: raw.profile?.department ?? '',
    lastLogin: raw.last_login ?? raw.date_joined,
  };
}

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await axiosInstance.get<DjangoUser[]>('/users/');
    return data.map(mapUser);
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await axiosInstance.get<DjangoUser>(`/users/${id}/`);
    return mapUser(data);
  },

  me: async (): Promise<User> => {
    const { data } = await axiosInstance.get<DjangoUser>('/users/me/');
    return mapUser(data);
  },

  update: async (id: number, payload: { fullName?: string; email?: string; department?: string; role?: string }): Promise<User> => {
    const { fullName, department, ...rest } = payload;
    const parts = fullName?.trim().split(' ') ?? [];
    const body: Record<string, unknown> = { ...rest };
    if (fullName !== undefined) {
      body.first_name = parts[0] ?? '';
      body.last_name = parts.slice(1).join(' ');
    }
    if (department !== undefined) {
      body.profile = { department };
    }
    const { data } = await axiosInstance.patch<DjangoUser>(`/users/${id}/`, body);
    return mapUser(data);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}/`);
  },
};
