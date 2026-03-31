import { useTranslation, UseTranslationOptions, UseTranslationResponse } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { i18nSelector, changeLanguage } from 'uiSrc/slices/app/i18n'
import { supportedLngs, fallbackLng } from 'uiSrc/i18n/config'

export interface UseI18nReturn extends UseTranslationResponse {
  currentLanguage: string
  setLanguage: (lng: string) => Promise<void>
  isSupportedLanguage: (lng: string) => boolean
}

/**
 * Custom hook for using i18n with Redux integration
 * Provides translation function and language management
 */
export const useI18n = (
  ns?: string | string[],
  options?: UseTranslationOptions,
): UseI18nReturn => {
  const dispatch = useDispatch()
  const { currentLanguage } = useSelector(i18nSelector)
  const { t, ...rest } = useTranslation(ns, options)

  const setLanguage = async (lng: string): Promise<void> => {
    if (!isSupportedLanguage(lng)) {
      console.warn(`Unsupported language: ${lng}. Falling back to ${fallbackLng}`)
      return
    }
    
    await dispatch(changeLanguage(lng))
  }

  const isSupportedLanguage = (lng: string): boolean => {
    return supportedLngs.includes(lng)
  }

  return {
    ...rest,
    t,
    currentLanguage,
    setLanguage,
    isSupportedLanguage,
  }
}

/**
 * Helper function to check if a language is supported
 */
export const isSupportedLanguage = (lng: string): boolean => {
  return supportedLngs.includes(lng)
}

/**
 * Get language name from code
 */
export const getLanguageName = (lng: string): string => {
  const names: Record<string, string> = {
    en: 'English',
    zh: '中文',
  }
  return names[lng] || lng
}
