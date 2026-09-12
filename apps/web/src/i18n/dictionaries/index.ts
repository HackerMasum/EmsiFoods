import { en } from "./en";
import { bn } from "./bn";

export const dictionaries = {
  EN: en,
  BN: bn,
} as const;

export type Dictionary = (typeof dictionaries)[keyof typeof dictionaries];