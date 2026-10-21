import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'bold' | 'title' | 'subtitle' | 'small' | 'smallBold' | 'caption';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 },
  bold: { fontFamily: Fonts.bold, fontSize: 15, lineHeight: 22 },
  title: { fontFamily: Fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  subtitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24 },
  small: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
  smallBold: { fontFamily: Fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: Fonts.medium, fontSize: 12, lineHeight: 16 },
});
