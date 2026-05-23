import { equipmentApi as sharedEquipmentApi } from '@/shared/api/equipment';
import { Equipment } from '@/shared/types';

export const equipmentApi = {
  getAll: (): Promise<Equipment[]> => sharedEquipmentApi.getEquipment(),

  getById: async (id: number): Promise<Equipment | undefined> => {
    const list = await sharedEquipmentApi.getEquipment();
    return list.find((eq) => eq.id === id);
  },

  create: (data: Omit<Equipment, 'id'>): Promise<Equipment> =>
    sharedEquipmentApi.createEquipment(data),

  update: (id: number, data: Partial<Equipment>): Promise<Equipment> =>
    sharedEquipmentApi.updateEquipment(id, data),

  delete: (id: number): Promise<void> => sharedEquipmentApi.deleteEquipment(id),
};
