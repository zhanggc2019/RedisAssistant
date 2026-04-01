import React from 'react'
import { instance, mock } from 'ts-mockito'
import { act, fireEvent, render, screen } from 'uiSrc/utils/test-utils'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import { dateTimeOptions } from 'uiSrc/constants'
import { Nullable } from 'uiSrc/utils'
import DatetimeForm, { Props } from './DatetimeForm'

const mockedProps = mock<Props>()
const PRESET_FORMAT_LABEL =
  /Pre-selected formats|预设格式|settings\.general\.dateTime\.preset/
const CUSTOM_FORMAT_LABEL = /Custom|自定义|settings\.general\.dateTime\.custom/
const INVALID_FORMAT_PREVIEW =
  /Invalid Format|无效格式|settings\.general\.dateTime\.invalidFormatShort/

jest.mock('uiSrc/slices/user/user-settings', () => ({
  ...jest.requireActual('uiSrc/slices/user/user-settings'),
  userSettingsConfigSelector: jest.fn().mockReturnValue({
    dateFormat: null,
    timezone: null,
  }),
}))

jest.mock('uiSrc/telemetry', () => ({
  ...jest.requireActual('uiSrc/telemetry'),
  sendEventTelemetry: jest.fn(),
}))

describe('DatetimeForm', () => {
  it('should render', () => {
    expect(render(<DatetimeForm {...instance(mockedProps)} />)).toBeTruthy()
  })

  it('should not show custom btn and input unless custom radio btn is clicked ', async () => {
    const { container } = render(<DatetimeForm {...instance(mockedProps)} />)
    expect(screen.getByText(PRESET_FORMAT_LABEL)).toBeTruthy()
    expect(
      container.querySelector('[data-test-subj="select-datetime"]'),
    ).toBeTruthy()
    expect(screen.queryByTestId('datetime-custom-btn')).toBeFalsy()
    await act(() => fireEvent.click(screen.getByText(CUSTOM_FORMAT_LABEL)))
    expect(screen.queryByTestId('datetime-custom-btn')).toBeTruthy()
  })

  it('should display invalid format when wrong format is typed in a custom input', async () => {
    const onFormatChange = jest.fn()
    render(
      <DatetimeForm
        {...instance(mockedProps)}
        onFormatChange={onFormatChange}
      />,
    )

    await act(() => fireEvent.click(screen.getByText(CUSTOM_FORMAT_LABEL)))
    const customInput: Nullable<HTMLElement> = screen.getByTestId(
      'custom-datetime-input',
    )

    await act(() =>
      fireEvent.change(customInput, { target: { value: 'fffffinvalid' } }),
    )

    expect(onFormatChange).toBeCalledWith(
      expect.stringMatching(INVALID_FORMAT_PREVIEW),
    )
  })

  it('should call proper telemetry events when custom format is saved', async () => {
    const sendEventTelemetryMock = jest.fn()
    sendEventTelemetry.mockImplementation(() => sendEventTelemetryMock)

    render(<DatetimeForm {...instance(mockedProps)} />)

    await act(() => fireEvent.click(screen.getByText(CUSTOM_FORMAT_LABEL)))
    const customInput: Nullable<HTMLElement> = screen.getByTestId(
      'custom-datetime-input',
    )

    await act(() =>
      fireEvent.change(customInput, {
        target: { value: dateTimeOptions[1].value },
      }),
    )
    await act(() => fireEvent.click(screen.getByTestId('datetime-custom-btn')))

    expect(sendEventTelemetry).toBeCalledWith({
      event: TelemetryEvent.SETTINGS_DATE_TIME_FORMAT_CHANGED,
      eventData: {
        currentFormat: dateTimeOptions[1].value,
      },
    })
  })

  it('should call proper telemetry events when radio option is changed to common', async () => {
    const sendEventTelemetryMock = jest.fn()
    sendEventTelemetry.mockImplementation(() => sendEventTelemetryMock)

    render(<DatetimeForm {...instance(mockedProps)} />)

    await act(() => fireEvent.click(screen.getByText(CUSTOM_FORMAT_LABEL)))
    await act(() => fireEvent.click(screen.getByText(PRESET_FORMAT_LABEL)))

    expect(sendEventTelemetry).toHaveBeenCalledWith({
      event: TelemetryEvent.SETTINGS_DATE_TIME_FORMAT_CHANGED,
      eventData: {
        currentFormat: dateTimeOptions[0].value,
      },
    })
  })

  it('should call sendEventTelemetry when common formats is changed', async () => {
    const sendEventTelemetryMock = jest.fn()
    sendEventTelemetry.mockImplementation(() => sendEventTelemetryMock)

    render(<DatetimeForm {...instance(mockedProps)} />)

    fireEvent.click(screen.getByTestId('select-datetime-testid'))
    await act(() =>
      fireEvent.click(screen.queryByText(dateTimeOptions[1].value) || document),
    )
    expect(sendEventTelemetry).toBeCalledWith({
      event: TelemetryEvent.SETTINGS_DATE_TIME_FORMAT_CHANGED,
      eventData: {
        currentFormat: dateTimeOptions[1].value,
      },
    })
  })
})
