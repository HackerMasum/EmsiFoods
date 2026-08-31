import { profileRepository } from "./profile.repository";
import type { UpdateProfileInput } from "./profile.types";

export const profileService = {
  async getProfile(userId: string) {
    const user =
      await profileRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ) {
    if (
      data.name !== undefined &&
      data.name.trim().length === 0
    ) {
      throw new Error("Name cannot be empty");
    }

    if (
      data.phone !== undefined &&
      data.phone.trim().length === 0
    ) {
      throw new Error("Phone cannot be empty");
    }

    return profileRepository.update(userId, {
      ...data,
      name: data.name?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
    });
  },
};