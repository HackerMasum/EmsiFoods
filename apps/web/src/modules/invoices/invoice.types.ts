export type InvoiceItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: string;
  total: string;
};

export type InvoicePayment = {
  status: string;
  method: string | null;
  transactionId: string | null;
  amount: string;
};

export type InvoiceStore = {
  storeName: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  currency: string;
};

export type InvoiceData = {
  invoiceNumber: string;

  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: Date;

    customerName: string;
    phone: string;
    address: string;

    subtotal: string;
    discount: string;
    total: string;
  };

  items: InvoiceItem[];

  payment: InvoicePayment | null;

  store: InvoiceStore;
};