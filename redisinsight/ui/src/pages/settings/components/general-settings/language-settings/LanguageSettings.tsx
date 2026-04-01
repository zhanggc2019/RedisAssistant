import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Spacer } from 'uiSrc/components/base/layout/spacer'
import {
  defaultValueRender,
  RiSelect,
} from 'uiSrc/components/base/forms/select/RiSelect'
import { FormField } from 'uiSrc/components/base/forms/FormField'
import { Title } from 'uiSrc/components/base/text'
import i18n, { supportedLngs } from 'uiSrc/i18n/config'
import { changeLanguage } from 'uiSrc/slices/app/i18n'

/**
 * 通用设置中的语言选择项，负责切换 i18next 当前语言。
 */
const LanguageSettings = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  /**
   * 将检测到的语言代码归一化为受支持值。
   */
  const getCurrentLanguage = (): string => {
    const normalizedLanguage = i18n.language?.toLowerCase().split('-')[0]
    return supportedLngs.includes(normalizedLanguage)
      ? normalizedLanguage
      : supportedLngs[0]
  }

  /**
   * 根据语言代码返回下拉框展示名称。
   */
  const getLanguageLabel = (lng: string): string =>
    lng === 'zh'
      ? t('settings.general.language.chinese')
      : t('settings.general.language.english')

  /**
   * 处理语言切换并触发全局 i18n 更新。
   */
  const onLanguageChange = async (value: string) => {
    await dispatch(changeLanguage(value))
  }

  return (
    <form data-testid="settings-language-form">
      <Title size="XS">{t('settings.general.language.title')}</Title>
      <Spacer size="m" />
      <FormField label={t('settings.general.language.description')}>
        <RiSelect
          valueRender={defaultValueRender}
          options={supportedLngs.map((lng) => ({
            value: lng,
            label: getLanguageLabel(lng),
            'data-test-subj': `language-option-${lng}`,
          }))}
          value={getCurrentLanguage()}
          onChange={onLanguageChange}
          style={{ marginTop: '12px' }}
          data-test-subj="select-language"
          data-testid="select-language"
        />
      </FormField>
      <Spacer size="xl" />
    </form>
  )
}

export default LanguageSettings
