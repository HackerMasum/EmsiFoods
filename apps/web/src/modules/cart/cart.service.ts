import { cartRepository } from "./cart.repository";
import { productRepository } from "@/modules/products/product.repository";
import type {
  AddCartItemInput,
  UpdateCartItemInput,
} from "./cart.types";

export const cartService = {
  async getCart(userId: string) {
    let cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }

    return cart;
  },

  async addItem(data: AddCartItemInput) {
    const product = await productRepository.findById(data.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error("Product is not available");
    }

    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    let cart = await cartRepository.findCartByUserId(data.userId);

    if (!cart) {
      cart = await cartRepository.createCart(data.userId);
    }

    const existingItem = await cartRepository.findCartItem(
      cart.id,
      data.productId
    );

    if (existingItem) {
      await cartRepository.updateItem(cart.id, data.productId, {
        quantity: existingItem.quantity + data.quantity,
      });
    } else {
      await cartRepository.addItem(cart.id, data);
    }

    return this.getCart(data.userId);
  },

  async updateItem(
    userId: string,
    productId: string,
    data: UpdateCartItemInput
  ) {
    if (data.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await cartRepository.findCartItem(
      cart.id,
      productId
    );

    if (!item) {
      throw new Error("Cart item not found");
    }

    await cartRepository.updateItem(cart.id, productId, data);

    return this.getCart(userId);
  },

  async removeItem(userId: string, productId: string) {
    const cart = await cartRepository.findCartByUserId(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = await cartRepository.findCartItem(
      cart.id,
      productId
    );

    if (!item) {
      throw new Error("Cart item not found");
    }

    await cartRepository.deleteItem(cart.id, productId);

    return this.getCart(userId);
  },
};