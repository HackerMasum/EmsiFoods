"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "./config";

import { dictionaries } from "./dictionaries";

export function useTranslation() {
  const [language, setLanguageState] =
    useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const storedLanguage =
      localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (
      storedLanguage === "EN" ||
      storedLanguage === "BN"
    ) {
      setLanguageState(storedLanguage);
    }
  }, []);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      nextLanguage
    );
  }

  const dictionary = dictionaries[language];

  return {
    language,
    dictionary,
    setLanguage,
  };
}