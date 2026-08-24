import { productRepository } from "./product.repository";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "./product.types";
import { categoryService } from "@/modules/categories/category.service";

export const productService = {
  async getAllProducts() {
    return productRepository.findMany();
  },

  async getProductById(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  async createProduct(data: CreateProductInput) {
    await categoryService.getCategoryById(data.categoryId);

    const existingProduct = await productRepository.findBySlug(
      data.slug
    );

    if (existingProduct) {
      throw new Error("Product slug already exists");
    }

    return productRepository.create(data);
  },

  async updateProduct(slug: string, data: UpdateProductInput) {
    const product = await this.getProductBySlug(slug);

    if (data.categoryId) {
      await categoryService.getCategoryById(data.categoryId);
    }

    if (data.slug) {
      const existingProduct = await productRepository.findBySlug(
        data.slug
      );

      if (
        existingProduct &&
        existingProduct.id !== product.id
      ) {
        throw new Error("Product slug already exists");
      }
    }

    return productRepository.update(product.id, data);
  },

  async deleteProduct(slug: string) {
    const product = await this.getProductBySlug(slug);

    return productRepository.delete(product.id);
  },
};