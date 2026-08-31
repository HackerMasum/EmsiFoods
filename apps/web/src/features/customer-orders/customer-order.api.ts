import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CustomerOrder,
} from "./customer-order.types";

async function getErrorMessage(
  response: Response
): Promise<string> {
  try {
    const body =
      (await response.json()) as ApiErrorResponse;

    return body.message ?? "Something went wrong";
  } catch {
    return "Something went wrong";
  }
}

type OrdersResponseData =
  | CustomerOrder[]
  | {
      orders: CustomerOrder[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };

export async function getCustomerOrders(
  token: string
): Promise<CustomerOrder[]> {
  const response = await fetch("/api/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body =
    (await response.json()) as ApiSuccessResponse<OrdersResponseData>;

  if (Array.isArray(body.data)) {
    return body.data;
  }

  if (
    body.data &&
    "orders" in body.data &&
    Array.isArray(body.data.orders)
  ) {
    return body.data.orders;
  }

  throw new Error(
    "Invalid orders response received from server"
  );
}

export async function getCustomerOrderById(
  orderId: string,
  token: string
): Promise<CustomerOrder> {
  const response = await fetch(
    `/api/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body =
    (await response.json()) as ApiSuccessResponse<CustomerOrder>;

  return body.data;
}

export async function cancelCustomerOrder(
  orderId: string,
  token: string
): Promise<CustomerOrder> {
  const response = await fetch(
    `/api/orders/${orderId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body =
    (await response.json()) as ApiSuccessResponse<CustomerOrder>;

  return body.data;
}