import { prisma } from "@/lib/prisma";
import type { UpdateStoreSettingsInput } from "./store-settings.types";

export const storeSettingsRepository = {
  async findFirst() {
    return prisma.storeSettings.findFirst();
  },

  async create() {
    return prisma.storeSettings.create({
      data: {},
    });
  },

  async update(id: string, data: UpdateStoreSettingsInput) {
    return prisma.storeSettings.update({
      where: { id },
      data,
    });
  },
};