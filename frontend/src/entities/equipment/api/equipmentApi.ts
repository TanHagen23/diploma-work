import { equipmentApi as sharedEquipmentApi } from '@/shared/api/equipment';
import { Equipment, EquipmentPayload } from '@/shared/types';

export const equipmentApi = {
  getAll: (): Promise<Equipment[]> => sharedEquipmentApi.getEquipment(),

  getById: async (id: number): Promise<Equipment | undefined> => {
    const list = await sharedEquipmentApi.getEquipment();
    return list.find((eq) => eq.id === id);
  },

  create: (data: EquipmentPayload): Promise<Equipment> =>
    sharedEquipmentApi.createEquipment(data),

  update: (id: number, data: Partial<EquipmentPayload>): Promise<Equipment> =>
    sharedEquipmentApi.updateEquipment(id, data),

  delete: (id: number): Promise<void> => sharedEquipmentApi.deleteEquipment(id),
};
