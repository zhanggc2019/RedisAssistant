import React, { ReactElement, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  appInitSelector,
  initializeAppAction,
  STATUS_FAIL,
  STATUS_SUCCESS,
} from 'uiSrc/slices/app/init'
import { removePagePlaceholder } from 'uiSrc/utils'
import ConnectivityError from 'uiSrc/components/connectivity-error/ConnectivityError'
import SuspenseLoader from 'uiSrc/components/main-router/components/SuspenseLoader'

type Props = {
  children: ReactElement
  onSuccess?: () => void
  onFail?: () => void
}

const MAX_AUTO_RETRY_ATTEMPTS = 3

/**
 * Returns delay for the current auto-retry attempt during app initialization.
 */
const getAutoRetryDelay = (attempt: number): number => (attempt + 1) * 1_000

const AppInit = ({ children, onSuccess, onFail }: Props) => {
  const dispatch = useDispatch()
  const { status } = useSelector(appInitSelector)
  const retryAttemptRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initApp = useCallback(
    () => dispatch(initializeAppAction(onSuccess, onFail)),
    [dispatch, onSuccess, onFail],
  )

  useEffect(() => {
    initApp()
  }, [initApp])

  useEffect(() => {
    if (status === STATUS_SUCCESS) {
      retryAttemptRef.current = 0
      return
    }

    if (
      status === STATUS_FAIL &&
      retryAttemptRef.current < MAX_AUTO_RETRY_ATTEMPTS
    ) {
      const delay = getAutoRetryDelay(retryAttemptRef.current)
      retryTimerRef.current = setTimeout(() => {
        retryAttemptRef.current += 1
        initApp()
      }, delay)
    }

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }
  }, [status, initApp])

  /**
   * Resets retry counter and manually triggers app re-initialization.
   */
  const handleManualRetry = () => {
    retryAttemptRef.current = 0
    initApp()
  }

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  if (status === STATUS_FAIL) {
    removePagePlaceholder()
    return (
      <ConnectivityError
        isLoading={false}
        onRetry={handleManualRetry}
        error="An unexpected server error has occurred. Please retry the request."
      />
    )
  }

  return status === STATUS_SUCCESS ? children : <SuspenseLoader />
}

export default AppInit
