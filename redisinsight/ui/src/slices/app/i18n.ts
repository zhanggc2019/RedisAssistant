import { createSlice } from '@reduxjs/toolkit'
import i18n, {
  defaultNS,
  supportedLngs as configSupportedLngs,
  fallbackLng,
} from 'uiSrc/i18n/config'
import { AppDispatch, RootState } from '../store'

export interface I18nState {
  loading: boolean
  currentLanguage: string
  currentNamespace: string
  error?: string
}

const supportedLngs: string[] = configSupportedLngs

/**
 * 归一化语言代码（如 zh-CN -> zh），并校验是否受支持。
 */
const normalizeSupportedLanguage = (
  language?: string | null,
): string | undefined => {
  if (!language) {
    return undefined
  }

  const normalized = language.toLowerCase().split('-')[0]

  return supportedLngs.includes(normalized) ? normalized : undefined
}

export const initialState: I18nState = {
  loading: false,
  currentLanguage: normalizeSupportedLanguage(i18n.language) || fallbackLng,
  currentNamespace: defaultNS,
}

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguageRequest: (state) => {
      state.loading = true
    },
    setLanguageSuccess: (state, { payload }: { payload: string }) => {
      state.loading = false
      state.currentLanguage = payload
    },
    setLanguageFailure: (state, { payload }: { payload: string }) => {
      state.loading = false
      state.error = payload
    },
  },
})

// Actions generated from the slice
export const { setLanguageRequest, setLanguageSuccess, setLanguageFailure } =
  i18nSlice.actions

// A selector
export const i18nSelector = (state: RootState) => state.app.i18n

// The reducer
export default i18nSlice.reducer

// Asynchronous thunk action to change language
export function changeLanguage(
  language: string,
  onSuccessAction?: () => void,
  onFailAction?: () => void,
) {
  return async (dispatch: AppDispatch) => {
    const normalizedLanguage = normalizeSupportedLanguage(language)

    if (!normalizedLanguage) {
      dispatch(setLanguageFailure(`Unsupported language: ${language}`))
      onFailAction?.()
      return
    }

    dispatch(setLanguageRequest())

    try {
      await i18n.changeLanguage(normalizedLanguage)
      dispatch(setLanguageSuccess(normalizedLanguage))
      onSuccessAction?.()
    } catch (error) {
      dispatch(
        setLanguageFailure(
          error instanceof Error ? error.message : 'Failed to change language',
        ),
      )
      onFailAction?.()
    }
  }
}

// Action to initialize i18n state from stored preference
export function initializeI18nState() {
  return async (dispatch: AppDispatch) => {
    const storedLanguage = normalizeSupportedLanguage(
      localStorage.getItem('i18nextLng'),
    )
    const browserLanguage = normalizeSupportedLanguage(navigator.language)
    const detectedLanguage = storedLanguage || browserLanguage || fallbackLng

    await dispatch(changeLanguage(detectedLanguage))
  }
}
