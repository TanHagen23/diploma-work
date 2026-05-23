import axiosInstance from './axiosInstance';

export const decommissionsApi = {
  getDecommissions: (): Promise<unknown[]> =>
    axiosInstance.get('/decommissions/').then((r) => r.data),

  createDecommission: (data: unknown): Promise<unknown> =>
    axiosInstance.post('/decommissions/', data).then((r) => r.data),
};
