import type { ReactNode } from 'react'
import styled from 'styled-components'

const FieldRoot = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm}px;
  width: 100%;
`

const LabelRow = styled.span`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md}px;
`

const LabelText = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-weight: ${({ theme }) => theme.font.weights.semibold};
  letter-spacing: 0.04em;
`

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.font.sizes.xs};
  font-variant-numeric: tabular-nums;
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.font.sizes.xs};
`

interface FieldProps {
  label: string
  hint?: string
  count?: string
  error?: string
  hideLabel?: boolean
  children: ReactNode
}

export function Field({ label, hint, count, error, hideLabel = false, children }: FieldProps) {
  return (
    <FieldRoot>
      <LabelRow>
        <LabelText className={hideLabel ? 'sr-only' : undefined}>{label}</LabelText>
        {count ? <Meta>{count}</Meta> : null}
      </LabelRow>
      {children}
      {error ? <ErrorText role="alert">{error}</ErrorText> : hint ? <Meta>{hint}</Meta> : null}
    </FieldRoot>
  )
}
