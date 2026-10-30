import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '../theme'

export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}
