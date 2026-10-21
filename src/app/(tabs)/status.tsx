import { router } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, Switch, View } from 'react-native';

import { LiveBadge } from '@/components/live-badge';
import { Thumb } from '@/components/project-card';
import { ThemedText } from '@/components/themed-text';
import { Button, EmptyState, IconButton, Screen, StatusDot } from '@/components/ui';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';
import { useTheme } from '@/hooks/use-theme';

export default function Status() {
  const { projects, checks, check, checkAll, toggleActive, ready } = useProjects();
  const t = useTheme();
  useEffect(() => { if (ready) checkAll(); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Screen>
      <FlatList data={projects} keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: Spacing.three, gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.five }}
        ListHeaderComponent={
          <View style={{ gap: Spacing.two, marginBottom: Spacing.one }}>
            <ThemedText type="title">Status</ThemedText>
            <ThemedText themeColor="textSecondary">Green or red dot = your manual status. Live checks ping each website and backend.</ThemedText>
            <Button label="Check all now" icon="refresh" variant="secondary" onPress={checkAll} style={{ alignSelf: 'flex-start' }} />
          </View>
        }
        ListEmptyComponent={<EmptyState icon="pulse-outline" title="Nothing to monitor" message="Add a project with a website or backend URL." />}
        renderItem={({ item: p }) => (
          <Pressable onPress={() => router.push({ pathname: '/project/[id]', params: { id: p.id } })}
            style={{ backgroundColor: t.card, borderWidth: 1, borderColor: t.border, borderRadius: Radius.lg, padding: Spacing.three, gap: Spacing.two }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.three }}>
              <Thumb project={p} style={{ width: 52, borderRadius: Radius.sm }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <StatusDot state={p.active ? 'on' : 'off'} />
                  <ThemedText type="bold" numberOfLines={1} style={{ flex: 1 }}>{p.title}</ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">{p.active ? 'Marked active' : 'Marked inactive'}</ThemedText>
              </View>
              <Switch value={p.active} onValueChange={() => toggleActive(p.id)} trackColor={{ true: t.success }} />
            </View>
            {p.websiteUrl ? <LiveBadge label="Website" h={checks[p.id]?.website} /> : null}
            {p.backendUrl ? <LiveBadge label="Backend" h={checks[p.id]?.backend} /> : null}
            {(p.websiteUrl || p.backendUrl) ? (
              <View style={{ alignSelf: 'flex-end' }}><IconButton name="refresh" label="Re-check" onPress={() => check(p.id)} /></View>
            ) : null}
          </Pressable>
        )} />
    </Screen>
  );
}
