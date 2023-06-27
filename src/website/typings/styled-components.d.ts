import 'styled-components'
import { Theme } from '../src/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    black1: string
    white1: string
    gray1: string
    green1: string
    background: string
    foreground: string
    primary: string
  }
}
