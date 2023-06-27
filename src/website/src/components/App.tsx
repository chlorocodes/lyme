import { ThemeProvider } from 'styled-components'
import { Router } from './Router'
import { darkTheme } from '../theme/dark'
import { GlobalStyle } from './GlobalStyle'

export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  )
}
