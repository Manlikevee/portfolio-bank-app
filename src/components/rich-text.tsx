import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

/** Supports: "# heading", "- bullet", **bold**, *italic*. */
function inline(s: string) {
  return s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**'))
      return <Text key={i} style={{ fontFamily: Fonts.bold }}>{part.slice(2, -2)}</Text>;
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*'))
      return <Text key={i} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</Text>;
    return part;
  });
}

export function RichText({ text }: { text: string }) {
  return (
    <View style={{ gap: 6 }}>
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <View key={i} style={{ height: 4 }} />;
        if (line.startsWith('# ')) return <ThemedText key={i} type="subtitle">{inline(line.slice(2))}</ThemedText>;
        if (/^[-*] /.test(line))
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              <ThemedText>•</ThemedText><ThemedText style={{ flex: 1 }}>{inline(line.slice(2))}</ThemedText>
            </View>
          );
        return <ThemedText key={i}>{inline(line)}</ThemedText>;
      })}
    </View>
  );
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTheme();
  const [sel, setSel] = useState({ start: 0, end: 0 });
  const wrap = (tok: string) =>
    onChange(value.slice(0, sel.start) + tok + value.slice(sel.start, sel.end) + tok + value.slice(sel.end));
  const prefix = (pre: string) => {
    const ls = value.lastIndexOf('\n', sel.start - 1) + 1;
    onChange(value.slice(0, ls) + pre + value.slice(ls));
  };
  const tools: [string, () => void, object?][] = [
    ['B', () => wrap('**'), { fontFamily: Fonts.extrabold }],
    ['I', () => wrap('*'), { fontStyle: 'italic' }],
    ['H', () => prefix('# ')],
    ['•', () => prefix('- ')],
  ];
  return (
    <View style={{ gap: 6 }}>
      <ThemedText type="smallBold">Description</ThemedText>
      <View style={{ borderRadius: Radius.md, backgroundColor: t.backgroundElement, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', gap: Spacing.one, padding: Spacing.two, borderBottomWidth: 1, borderBottomColor: t.border }}>
          {tools.map(([label, fn, st]) => (
            <Pressable key={label} onPress={fn}
              style={{ width: 36, height: 34, borderRadius: Radius.sm, backgroundColor: t.backgroundSelected, alignItems: 'center', justifyContent: 'center' }}>
              <ThemedText type="smallBold" style={st}>{label}</ThemedText>
            </Pressable>
          ))}
        </View>
        <TextInput multiline value={value} onChangeText={onChange} textAlignVertical="top"
          onSelectionChange={(e) => setSel(e.nativeEvent.selection)}
          placeholder="What is it, what did you build, what was hard?" placeholderTextColor={t.textSecondary}
          style={{ minHeight: 140, padding: Spacing.three, color: t.text, fontFamily: Fonts.medium, fontSize: 15, lineHeight: 22 }} />
      </View>
    </View>
  );
}
