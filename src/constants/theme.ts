export const Colors = {
  light: {
    text: '#14151A', textSecondary: '#6B6F7B', background: '#FFFFFF', backgroundElement: '#F3F4F8',
    backgroundSelected: '#E4E6EE', card: '#FFFFFF', border: '#E8E9EF', primary: '#5B4FE5',
    primaryText: '#FFFFFF', success: '#22A06B', danger: '#E5484D', warning: '#E0A100',
  },
  dark: {
    text: '#F5F6FA', textSecondary: '#A1A5B3', background: '#0E0F13', backgroundElement: '#1A1C23',
    backgroundSelected: '#272A33', card: '#16181F', border: '#262932', primary: '#8B82FF',
    primaryText: '#0E0F13', success: '#3DD598', danger: '#FF6B70', warning: '#F2C14E',
  },
} as const;
export type ThemeColor = keyof typeof Colors.light;

// Plus Jakarta Sans needs one family name per weight in React Native.
export const Fonts = {
  regular: 'PlusJakartaSans_400Regular', medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold', bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const Radius = { sm: 10, md: 16, lg: 22, pill: 999 } as const;
export const BottomTabInset = 90;
