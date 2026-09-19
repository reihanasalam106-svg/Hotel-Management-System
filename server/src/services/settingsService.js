import { settingsRepository } from '../repositories/settingsRepository.js';

export const settingsService = {
  async getSettings() {
    return settingsRepository.getSettings();
  },

  async updateSettings(data) {
    return settingsRepository.updateSettings(data);
  }
};
