import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

export type IconName = keyof typeof Ionicons.glyphMap;

export function Icon({ name, size = 20, color }: { name: IconName; size?: number; color?: string }) {
  const t = useTheme();
  return <Ionicons name={name} size={size} color={color ?? t.text} />;
}

export function Screen({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.background }}>{children}</SafeAreaView>;
}

export function Button({ label, onPress, icon, variant = 'primary', style, disabled }: {
  label: string; onPress: () => void; icon?: IconName; disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger'; style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.primary : variant === 'danger' ? t.danger + '1A' : t.backgroundElement;
  const fg = variant === 'primary' ? t.primaryText : variant === 'danger' ? t.danger : t.text;
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      {icon && <Ionicons name={icon} size={18} color={fg} />}
      <ThemedText type="smallBold" style={{ color: fg }}>{label}</ThemedText>
    </Pressable>
  );
}

export function IconButton({ name, onPress, color, label }: { name: IconName; onPress: () => void; color?: string; label: string }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} hitSlop={8}
      style={({ pressed }) => [s.iconBtn, { backgroundColor: t.backgroundElement, opacity: pressed ? 0.7 : 1 }]}>
      <Ionicons name={name} size={20} color={color ?? t.text} />
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress}
      style={[s.chip, { backgroundColor: active ? t.text : t.backgroundElement }]}>
      <ThemedText type="small" style={{ color: active ? t.background : t.text, fontFamily: Fonts.semibold }}>{label}</ThemedText>
    </Pressable>
  );
}

export function Tag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  const t = useTheme();
  return (
    <View style={[s.tag, { backgroundColor: t.primary + '1F' }]}>
      <ThemedText type="caption" style={{ color: t.primary, fontFamily: Fonts.semibold }}>{label}</ThemedText>
      {onRemove && <Pressable onPress={onRemove} hitSlop={8}><Ionicons name="close" size={14} color={t.primary} /></Pressable>}
    </View>
  );
}

export type DotState = 'on' | 'off' | 'wait' | 'idle';
export function StatusDot({ state, size = 10 }: { state: DotState; size?: number }) {
  const t = useTheme();
  const color = state === 'on' ? t.success : state === 'off' ? t.danger : state === 'wait' ? t.warning : t.textSecondary;
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

export function SearchBar(props: TextInputProps) {
  const t = useTheme();
  return (
    <View style={[s.search, { backgroundColor: t.backgroundElement }]}>
      <Ionicons name="search-outline" size={20} color={t.textSecondary} />
      <TextInput placeholder="Search projects" placeholderTextColor={t.textSecondary} autoCorrect={false}
        style={{ flex: 1, color: t.text, fontFamily: Fonts.medium, fontSize: 15 }} {...props} />
    </View>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  const t = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput placeholderTextColor={t.textSecondary} {...props}
        style={[{ fontFamily: Fonts.medium, fontSize: 15, color: t.text, backgroundColor: t.backgroundElement,
          borderRadius: Radius.md, paddingHorizontal: Spacing.three, paddingVertical: 12 }, style]} />
    </View>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <View style={{ gap: Spacing.two }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText type="subtitle">{title}</ThemedText>{action}
      </View>
      {children}
    </View>
  );
}

export function EmptyState({ icon, title, message }: { icon: IconName; title: string; message: string }) {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center', padding: Spacing.five, gap: Spacing.two }}>
      <View style={[s.iconBtn, { width: 56, height: 56, borderRadius: 28, backgroundColor: t.backgroundElement }]}>
        <Ionicons name={icon} size={26} color={t.textSecondary} />
      </View>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>{message}</ThemedText>
    </View>
  );
}

const s = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, paddingHorizontal: 18, borderRadius: Radius.pill },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: Radius.pill },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 11, borderRadius: Radius.pill },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, paddingHorizontal: 14, borderRadius: Radius.pill },
});
