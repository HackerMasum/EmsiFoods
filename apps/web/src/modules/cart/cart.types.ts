export type AddCartItemInput = {
  userId: string;
  productId: string;
  quantity: number;
};

export type UpdateCartItemInput = {
  quantity: number;
};