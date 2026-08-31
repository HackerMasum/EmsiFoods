export type UserRole =
  | "ADMIN"
  | "WORKER"
  | "CUSTOMER";

export type LanguagePreference =
  | "EN"
  | "BN";

export type ThemePreference =
  | "LIGHT"
  | "DARK"
  | "SYSTEM";

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  languagePreference: LanguagePreference;
  themePreference: ThemePreference;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  name?: string;
  phone?: string;
  address?: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message?: string;
};