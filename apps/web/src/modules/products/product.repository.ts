import { prisma } from "@/lib/prisma";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "./product.types";

export const productRepository = {
  async findMany() {
    return prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  },

  async create(data: CreateProductInput) {
    return prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  },

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },
};