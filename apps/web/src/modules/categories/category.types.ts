export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;