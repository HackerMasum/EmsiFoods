import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  UpdateProfileInput,
  UserProfile,
} from "./profile.types";

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

export async function getProfile(
  token: string
): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body =
    (await response.json()) as ApiSuccessResponse<UserProfile>;

  return body.data;
}

export async function updateProfile(
  data: UpdateProfileInput,
  token: string
): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body =
    (await response.json()) as ApiSuccessResponse<UserProfile>;

  return body.data;
}