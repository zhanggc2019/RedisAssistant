import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { i18nSelector, changeLanguage } from 'uiSrc/slices/app/i18n'
import { supportedLngs, getLanguageName } from 'uiSrc/i18n/config'
import { IconLanguage } from '@redis-ui/icons'

const LanguageSwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.borderColor.default};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bgInput};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.borderColor.hover};
    background: ${({ theme }) => theme.colors.bgHover};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const LanguageDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 150px;
  background: ${({ theme }) => theme.colors.bgPopover};
  border: 1px solid ${({ theme }) => theme.borderColor.default};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 0.2s ease;
`

const LanguageOption = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  ${({ isActive, theme }) =>
    isActive &&
    `
    background: ${theme.colors.bgActive};
    font-weight: 500;
    
    &::after {
      content: '✓';
      color: ${theme.colors.primary};
    }
  `}

  &:first-child {
    border-radius: 4px 4px 0 0;
  }

  &:last-child {
    border-radius: 0 0 4px 4px;
  }
`

export const LanguageSwitcher: React.FC = () => {
  const dispatch = useDispatch()
  const { currentLanguage } = useSelector(i18nSelector)
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const handleLanguageChange = async (lng: string) => {
    await dispatch(changeLanguage(lng))
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <LanguageSwitcherContainer ref={dropdownRef}>
      <LanguageButton onClick={() => setIsOpen(!isOpen)} aria-label="Select language">
        <IconLanguage />
        <span>{getLanguageName(currentLanguage)}</span>
      </LanguageButton>

      <LanguageDropdown isOpen={isOpen}>
        {supportedLngs.map((lng) => (
          <LanguageOption
            key={lng}
            isActive={currentLanguage === lng}
            onClick={() => handleLanguageChange(lng)}
          >
            {getLanguageName(lng)}
          </LanguageOption>
        ))}
      </LanguageDropdown>
    </LanguageSwitcherContainer>
  )
}

export default LanguageSwitcher
