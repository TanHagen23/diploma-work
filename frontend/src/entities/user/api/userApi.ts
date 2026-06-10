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
  profile: {
    role: string;
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
    role: (raw.profile?.role ?? 'viewer') as User['role'],
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
};
