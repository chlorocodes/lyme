import { FC } from 'react'
import { createGlobalStyle } from 'styled-components'

// https://github.com/styled-components/styled-components/issues/3738
export const GlobalStyle = createGlobalStyle`
  * {
    background: ${({ theme }) => theme.background};
  }
` as unknown as FC
