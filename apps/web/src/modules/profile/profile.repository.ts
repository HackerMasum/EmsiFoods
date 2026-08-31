import { prisma } from "@/lib/prisma";
import type { UpdateProfileInput } from "./profile.types";

export const profileRepository = {
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        languagePreference: true,
        themePreference: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async update(
    userId: string,
    data: UpdateProfileInput
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        languagePreference: true,
        themePreference: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};