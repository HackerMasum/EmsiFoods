export type CreateProductInput = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  isActive?: boolean;
};

export type UpdateProductInput = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  isActive?: boolean;
};