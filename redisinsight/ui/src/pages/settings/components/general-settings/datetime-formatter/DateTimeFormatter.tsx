import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { formatTimestamp } from 'uiSrc/utils'
import { DATETIME_FORMATTER_DEFAULT, TimezoneOption } from 'uiSrc/constants'
import { userSettingsConfigSelector } from 'uiSrc/slices/user/user-settings'
import { FlexItem, Row } from 'uiSrc/components/base/layout/flex'
import { Spacer } from 'uiSrc/components/base/layout'
import { Title } from 'uiSrc/components/base/text/Title'
import { Text } from 'uiSrc/components/base/text'
import TimezoneForm from './components/timezone-form/TimezoneForm'
import DatetimeForm from './components/datetime-form/DatetimeForm'
import { TextInput } from 'uiSrc/components/base/inputs'

const DateTimeFormatter = () => {
  const { t } = useTranslation()
  const [preview, setPreview] = useState('')
  const config = useSelector(userSettingsConfigSelector)

  useEffect(() => {
    setPreview(
      formatTimestamp(
        new Date(),
        config?.dateFormat || DATETIME_FORMATTER_DEFAULT,
        config?.timezone || TimezoneOption.Local,
      ),
    )
  }, [config?.dateFormat, config?.timezone])

  return (
    <>
      <Title size="M">{t('settings.general.dateTime.title')}</Title>
      <Spacer size="m" />
      <Text color="primary">{t('settings.general.dateTime.description')}</Text>
      <Spacer size="m" />
      <DatetimeForm onFormatChange={(newPreview) => setPreview(newPreview)} />
      <Spacer size="m" />
      <Text color="primary">
        {t('settings.general.dateTime.timezoneDescription')}
      </Text>
      <Spacer size="s" />
      <Row align="center" justify="between" gap="m">
        <FlexItem grow={1}>
          <TimezoneForm />
        </FlexItem>
        <Row align="center" gap="m" grow={false}>
          <Text color="primary" size="m">
            {t('settings.general.dateTime.preview')}
          </Text>
          <TextInput
            variant="outline"
            value={preview}
            disabled
            data-testid="data-preview"
          />
        </Row>
      </Row>
    </>
  )
}

export default DateTimeFormatter
