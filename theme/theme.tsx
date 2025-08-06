import { Platform, TextStyle } from 'react-native'

export type Colors = {
  primary: string
  secondary: string
  background: string
  textPrimary: string
  textSecondary: string
  border: string
  muted: string
  error: string
  success: string
}

export type TypographyKeys = 'heading1' | 'heading2' | 'body' | 'caption' | 'button'

export type TypographyVariant = {
  fontSize: number
  fontWeight: TextStyle['fontWeight']
  lineHeight: number
}

export type Typography = Record<TypographyKeys, TypographyVariant>

export type Elevation = {
  shadow1: TextStyle
  shadow2: TextStyle
}

export type ThemeType = {
  colors: Colors
  spacing: Record<string, number>
  borderRadius: Record<string, number>
  typography: Typography
  elevation: Elevation
}

export const lightColors: Colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  textPrimary: '#000000',
  textSecondary: '#666666',
  border: '#CCCCCC',
  muted: '#999999',
  error: '#FF3B30',
  success: '#34C759',
}

export const darkColors: Colors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#1C1C1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1A6',
  border: '#3A3A3C',
  muted: '#636366',
  error: '#FF453A',
  success: '#30D158',
}

export const typography: Typography = {
  heading1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  heading2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
}

export const elevation: Elevation = {
  shadow1: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
  }) as TextStyle,
  shadow2: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
    },
    android: {
      elevation: 5,
    },
  }) as TextStyle,
}
