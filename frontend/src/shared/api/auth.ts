import axiosInstance from './axiosInstance';

function decodeJwtPayload(token: string): { user_id?: number } {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

export const authApi = {
  login: async (username: string, password: string) => {
    const { data } = await axiosInstance.post<{ access: string; refresh: string }>(
      '/auth/token/',
      { username, password }
    );

    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);

    const { user_id } = decodeJwtPayload(data.access);
    if (user_id) {
      const { data: user } = await axiosInstance.get(`/users/${user_id}/`);
      localStorage.setItem('user_role', user.role ?? 'viewer');
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user_role');
  },
};
