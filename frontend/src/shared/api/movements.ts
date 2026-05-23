import axiosInstance from './axiosInstance';
import { Movement } from '@/shared/types';

export const movementsApi = {
  getMovements: (): Promise<Movement[]> =>
    axiosInstance.get<Movement[]>('/movements/').then((r) => r.data),

  createMovement: (data: Omit<Movement, 'id'>): Promise<Movement> =>
    axiosInstance.post<Movement>('/movements/', data).then((r) => r.data),
};
