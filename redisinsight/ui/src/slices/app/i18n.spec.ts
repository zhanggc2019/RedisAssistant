import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import i18nReducer, {
  initializeI18nState,
  changeLanguage,
  i18nSelector,
} from 'uiSrc/slices/app/i18n'

describe('i18n Slice', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    /**
     * 构造与运行时一致的 reducer 结构，保证 i18nSelector(state.app.i18n) 可用。
     */
    const appReducer = combineReducers({
      i18n: i18nReducer,
    })

    store = configureStore({
      reducer: {
        app: appReducer,
      },
    })
  })

  describe('initializeI18nState', () => {
    it('should initialize with default language', async () => {
      await store.dispatch(initializeI18nState() as any)
      const state = store.getState()
      const i18nState = i18nSelector(state as any)

      expect(i18nState.currentLanguage).toBeDefined()
      expect(['en', 'zh']).toContain(i18nState.currentLanguage)
    })
  })

  describe('changeLanguage', () => {
    it('should change language to Chinese', async () => {
      await store.dispatch(changeLanguage('zh') as any)
      const state = store.getState()
      const i18nState = i18nSelector(state as any)

      expect(i18nState.currentLanguage).toBe('zh')
    })

    it('should change language to English', async () => {
      await store.dispatch(changeLanguage('en') as any)
      const state = store.getState()
      const i18nState = i18nSelector(state as any)

      expect(i18nState.currentLanguage).toBe('en')
    })

    it('should handle unsupported language gracefully', async () => {
      await store.dispatch(changeLanguage('fr') as any)
      const state = store.getState()
      const i18nState = i18nSelector(state as any)

      // Should not change to unsupported language
      expect(['en', 'zh']).toContain(i18nState.currentLanguage)
    })
  })

  describe('selectors', () => {
    it('i18nSelector should return correct state shape', () => {
      const state = store.getState()
      const i18nState = i18nSelector(state as any)

      expect(i18nState).toHaveProperty('loading')
      expect(i18nState).toHaveProperty('currentLanguage')
      expect(i18nState).toHaveProperty('currentNamespace')
    })
  })
})
