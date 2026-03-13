"use client";

import { useUserStore } from "@/stores/user-store";
import { locales, type Locale, type TranslationKey } from "./locales";

export function useTranslations() {
  const language = useUserStore((s) => s.language) as Locale;

  function t(key: TranslationKey): string {
    return locales[language]?.[key] || locales.en[key] || key;
  }

  return { t, locale: language, isRTL: language === "ar" };
}
