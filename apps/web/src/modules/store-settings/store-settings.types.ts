export type UpdateStoreSettingsInput = {
  storeName?: string;
  tagline?: string | null;
  description?: string | null;
  logo?: string | null;
  favicon?: string | null;

  phone?: string | null;
  email?: string | null;
  address?: string | null;

  facebookUrl?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;

  currency?: string;
  defaultLanguage?: string;
};