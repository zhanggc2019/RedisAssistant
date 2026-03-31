import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import zhTranslations from './locales/zh.json'

export const defaultNS = 'common'
export const supportedLngs = ['en', 'zh']
export const fallbackLng = 'en'
export const defaultLng = 'zh' // 默认语言：中文

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enTranslations,
      },
      zh: {
        common: zhTranslations,
      },
    },
    lng: defaultLng, // 设置默认语言
    fallbackLng,
    defaultNS,
    ns: [defaultNS],
    supportedLngs,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
