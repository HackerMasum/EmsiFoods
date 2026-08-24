import { categoryRepository } from "./category.repository";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export const categoryService = {
  async getAllCategories() {
    return categoryRepository.findMany();
  },

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  },

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  },

  async createCategory(data: CreateCategoryInput) {
    const existingCategory = await categoryRepository.findBySlug(
      data.slug
    );

    if (existingCategory) {
      throw new Error("Category slug already exists");
    }

    return categoryRepository.create(data);
  },

  async updateCategory(slug: string, data: UpdateCategoryInput) {
    const category = await this.getCategoryBySlug(slug);

    if (data.slug) {
      const existingCategory =
        await categoryRepository.findBySlug(data.slug);

      if (
        existingCategory &&
        existingCategory.id !== category.id
      ) {
        throw new Error("Category slug already exists");
      }
    }

    return categoryRepository.update(category.id, data);
  },

  async deleteCategory(slug: string) {
    const category = await this.getCategoryBySlug(slug);

    return categoryRepository.delete(category.id);
  },
};