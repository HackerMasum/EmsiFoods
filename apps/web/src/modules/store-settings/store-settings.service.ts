import { storeSettingsRepository } from "./store-settings.repository";
import type { UpdateStoreSettingsInput } from "./store-settings.types";

export const storeSettingsService = {
  async getStoreSettings() {
    let settings = await storeSettingsRepository.findFirst();

    if (!settings) {
      settings = await storeSettingsRepository.create();
    }

    return settings;
  },

  async updateStoreSettings(data: UpdateStoreSettingsInput) {
    const settings = await this.getStoreSettings();

    return storeSettingsRepository.update(settings.id, data);
  },
};