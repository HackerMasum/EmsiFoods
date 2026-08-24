import { prisma } from "@/lib/prisma";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export const categoryRepository = {
  async findMany() {
    return prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  async create(data: CreateCategoryInput) {
    return prisma.category.create({
      data,
    });
  },

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },
};