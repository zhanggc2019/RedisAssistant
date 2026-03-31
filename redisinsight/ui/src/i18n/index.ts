export { default as i18n, defaultNS, supportedLngs, fallbackLng } from './config'
export { I18nProvider } from './i18nContext'
export { useI18n, isSupportedLanguage, getLanguageName } from '../hooks/useI18n'
export * from '../slices/app/i18n'

// Re-export translations for direct access if needed
export { default as enTranslations } from './locales/en.json'
export { default as zhTranslations } from './locales/zh.json'
