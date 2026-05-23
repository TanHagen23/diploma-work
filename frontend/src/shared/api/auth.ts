import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/token/', { username, password });
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user_role');
  },
};
