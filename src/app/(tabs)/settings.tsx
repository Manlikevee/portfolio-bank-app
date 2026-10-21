import { Alert, ScrollView, Share, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Chip, Screen, Section } from '@/components/ui';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Mode, useThemeMode } from '@/context/theme-mode';
import { useProjects } from '@/context/projects';

const MODES: [Mode, string][] = [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']];

export default function Settings() {
  const { mode, setMode } = useThemeMode();
  const { projects, clearAll } = useProjects();
  const exportJson = () =>
    Share.share({ message: JSON.stringify(projects.map((p) => ({ ...p, images: [] })), null, 2) });
  const clear = () =>
    Alert.alert('Delete all projects?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' }, { text: 'Delete all', style: 'destructive', onPress: clearAll },
    ]);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.three, gap: Spacing.four, paddingBottom: BottomTabInset + Spacing.five }}>
        <ThemedText type="title">Settings</ThemedText>
        <Section title="Appearance">
          <View style={{ flexDirection: 'row', gap: Spacing.two }}>
            {MODES.map(([m, label]) => <Chip key={m} label={label} active={mode === m} onPress={() => setMode(m)} />)}
          </View>
        </Section>
        <Section title="Your data">
          <ThemedText themeColor="textSecondary">{projects.length} projects stored on this device.</ThemedText>
          <Button label="Export as JSON (without images)" icon="share-outline" variant="secondary" onPress={exportJson} />
          <Button label="Delete all projects" icon="trash-outline" variant="danger" onPress={clear} />
        </Section>
      </ScrollView>
    </Screen>
  );
}
