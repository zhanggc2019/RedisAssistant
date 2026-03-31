/**
 * i18n Usage Examples
 * 
 * This file demonstrates how to use the internationalization (i18n) system
 * in RedisInsight.
 */

import React from 'react'
import { useI18n } from 'uiSrc/hooks/useI18n'

// ============================================================================
// Basic Usage - Using the useI18n Hook
// ============================================================================

export const BasicExample: React.FC = () => {
  // Get the translation function
  const { t } = useI18n()

  return (
    <div>
      {/* Simple translation */}
      <h1>{t('app.welcome')}</h1>
      
      {/* Nested keys */}
      <p>{t('common.loading')}</p>
      
      {/* Navigation items */}
      <nav>
        <a href="/home">{t('navigation.home')}</a>
        <a href="/browser">{t('navigation.browser')}</a>
      </nav>
    </div>
  )
}

// ============================================================================
// With Language Switching
// ============================================================================

export const LanguageSwitcherExample: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useI18n()

  const handleLanguageChange = async (lng: string) => {
    await setLanguage(lng)
    console.log(`Language changed to: ${lng}`)
  }

  return (
    <div>
      <h1>{t('app.welcome')}</h1>
      
      <div>
        <p>Current language: {currentLanguage}</p>
        
        <button onClick={() => handleLanguageChange('en')}>
          English
        </button>
        
        <button onClick={() => handleLanguageChange('zh')}>
          中文
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// With Interpolation (Variables)
// ============================================================================

export const InterpolationExample: React.FC = () => {
  const { t } = useI18n()

  return (
    <div>
      {/* Pass variables to translations */}
      <p>{t('validation.minLength', { min: 6 })}</p>
      <p>{t('validation.maxLength', { max: 50 })}</p>
    </div>
  )
}

// ============================================================================
// Using Specific Namespace
// ============================================================================

export const NamespaceExample: React.FC = () => {
  // Specify namespace explicitly
  const { t } = useI18n('common')

  return (
    <div>
      {/* No need to prefix with 'common' */}
      <button>{t('save')}</button>
      <button>{t('cancel')}</button>
      <button>{t('delete')}</button>
    </div>
  )
}

// ============================================================================
// Conditional Rendering with Translations
// ============================================================================

export const ConditionalExample: React.FC<{ success?: boolean }> = ({ success }) => {
  const { t } = useI18n()

  return (
    <div>
      {success ? (
        <span style={{ color: 'green' }}>{t('messages.saveSuccess')}</span>
      ) : (
        <span style={{ color: 'red' }}>{t('messages.saveFailed')}</span>
      )}
    </div>
  )
}

// ============================================================================
// Form Validation Example
// ============================================================================

export const FormValidationExample: React.FC = () => {
  const { t } = useI18n()
  
  const validateForm = (email: string, password: string) => {
    const errors: string[] = []
    
    if (!email) {
      errors.push(t('validation.required'))
    }
    
    if (password && password.length < 6) {
      errors.push(t('validation.minLength', { min: 6 }))
    }
    
    return errors
  }

  return (
    <form>
      {/* Form fields here */}
      <div className="errors">
        {validateForm('', '123').map((error, index) => (
          <p key={index} className="error">{error}</p>
        ))}
      </div>
    </form>
  )
}

// ============================================================================
// Dynamic Keys (Use with caution)
// ============================================================================

export const DynamicKeysExample: React.FC<{ type: 'success' | 'error' | 'warning' }> = ({ type }) => {
  const { t } = useI18n()

  // Dynamic key construction
  return (
    <div>
      <p>{t(`common.${type}`)}</p>
    </div>
  )
}

// ============================================================================
// Best Practices
// ============================================================================

/**
 * DO:
 * - Use the useI18n hook in functional components
 * - Keep translation keys organized by feature/section
 * - Use namespaces for large translation files
 * - Test all supported languages during development
 * 
 * DON'T:
 * - Hardcode text that should be translated
 * - Use dynamic keys that can't be statically analyzed
 * - Forget to add translations for all supported languages
 * - Mix translation systems (use either i18n or hardcoded strings)
 */
