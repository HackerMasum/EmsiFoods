import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";

export const authRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  async createUser(data: {
    name?: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role ?? "CUSTOMER",
      },
    });
  },

  async updateUserRole(
    id: string,
    role: UserRole
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });
  },
};