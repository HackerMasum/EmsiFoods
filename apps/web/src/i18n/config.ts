export const SUPPORTED_LANGUAGES = ["EN", "BN"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "EN";

export const LANGUAGE_STORAGE_KEY = "emsi-language";