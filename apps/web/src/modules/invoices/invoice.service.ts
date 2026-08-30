import { invoiceRepository } from "./invoice.repository";
import type {
  InvoiceData,
  InvoiceItem,
  InvoicePayment,
  InvoiceStore,
} from "./invoice.types";

export const invoiceService = {
  async getInvoiceByOrderId(
    orderId: string
  ): Promise<InvoiceData> {
    const order =
      await invoiceRepository.findOrderForInvoice(
        orderId
      );

    if (!order) {
      throw new Error("Order not found");
    }

    const storeSettings =
      await invoiceRepository.getStoreSettings();

    const items: InvoiceItem[] = order.items.map(
      (item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price.toString(),
        total: item.price
          .mul(item.quantity)
          .toString(),
      })
    );

    const payment: InvoicePayment | null =
      order.payment
        ? {
            status: order.payment.status,
            method: order.payment.method,
            transactionId:
              order.payment.transactionId,
            amount: order.payment.amount.toString(),
          }
        : null;

    const store: InvoiceStore = {
      storeName:
        storeSettings?.storeName ?? "EmsiFoods",
      tagline:
        storeSettings?.tagline ?? null,
      description:
        storeSettings?.description ?? null,
      logo: storeSettings?.logo ?? null,
      phone: storeSettings?.phone ?? null,
      email: storeSettings?.email ?? null,
      address: storeSettings?.address ?? null,
      currency:
        storeSettings?.currency ?? "BDT",
    };

    return {
      // We generate a readable invoice number from the order
      invoiceNumber: `INV-${order.orderNumber}`,

      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,

        customerName: order.customerName,
        phone: order.phone,
        address: order.address,

        subtotal: order.subtotal.toString(),
        discount: order.discount.toString(),
        total: order.total.toString(),
      },

      items,
      payment,
      store,
    };
  },
};