import React from 'react'
import reactRouterDom from 'react-router-dom'
import { cloneDeep } from 'lodash'
import {
  render,
  screen,
  cleanup,
  mockedStore,
  fireEvent,
} from 'uiSrc/utils/test-utils'

import { Pages } from 'uiSrc/constants'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import { appFeatureFlagsFeaturesSelector } from 'uiSrc/slices/app/features'
import HomeTabs from './HomeTabs'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

jest.mock('uiSrc/slices/app/features', () => ({
  ...jest.requireActual('uiSrc/slices/app/features'),
  appFeatureFlagsFeaturesSelector: jest.fn().mockReturnValue({
    redisDataIntegration: {
      flag: true,
    },
  }),
}))

jest.mock('uiSrc/telemetry', () => ({
  ...jest.requireActual('uiSrc/telemetry'),
  sendEventTelemetry: jest.fn(),
}))

describe('HomeTabs', () => {
  it('should render', () => {
    expect(render(<HomeTabs />)).toBeTruthy()
  })

  it('should show database instances tab active', async () => {
    reactRouterDom.useLocation = jest
      .fn()
      .mockReturnValue({ pathname: Pages.home })

    render(<HomeTabs />)

    const tabs = await screen.findAllByRole('tab')

    const databasesTab = tabs.find((tab) =>
      tab.getAttribute('id')?.endsWith('trigger-databases'),
    )

    expect(databasesTab).toHaveAttribute('data-state', 'active')
  })

  it('should hide rdi tab by default', () => {
    reactRouterDom.useLocation = jest
      .fn()
      .mockReturnValue({ pathname: Pages.rdi })

    render(<HomeTabs />)

    expect(screen.queryByText('Redis Data Integration')).not.toBeInTheDocument()
  })

  it('should not navigate to rdi when rdi tab is hidden', () => {
    const pushMock = jest.fn()
    reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMock })
    reactRouterDom.useLocation = jest
      .fn()
      .mockReturnValue({ pathname: Pages.home })

    render(<HomeTabs />)

    expect(screen.queryByText('Redis Data Integration')).not.toBeInTheDocument()

    expect(pushMock).not.toHaveBeenCalledWith(Pages.rdi)
  })

  it('should not send rdi telemetry when rdi tab is hidden', () => {
    const sendEventTelemetryMock = jest.fn()
    ;(sendEventTelemetry as jest.Mock).mockImplementation(
      () => sendEventTelemetryMock,
    )
    reactRouterDom.useLocation = jest
      .fn()
      .mockReturnValue({ pathname: Pages.home })

    render(<HomeTabs />)

    expect(screen.queryByText('Redis Data Integration')).not.toBeInTheDocument()

    expect(sendEventTelemetry).not.toBeCalledWith(
      expect.objectContaining({
        event: TelemetryEvent.INSTANCES_TAB_CHANGED,
        eventData: expect.objectContaining({
          tab: 'Redis Data Integration',
        }),
      }),
    )
  })

  it('should not render rdi tab', () => {
    ;(appFeatureFlagsFeaturesSelector as jest.Mock).mockReturnValue({
      rdi: {
        flag: false,
      },
    })

    render(<HomeTabs />)

    expect(screen.queryByText('Redis Data Integration')).not.toBeInTheDocument()
  })
})
