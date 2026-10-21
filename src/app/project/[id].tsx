import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import { LiveBadge } from '@/components/live-badge';
import { Thumb } from '@/components/project-card';
import { RichText } from '@/components/rich-text';
import { ThemedText } from '@/components/themed-text';
import { Button, EmptyState, Icon, IconButton, Screen, Section, StatusDot, Tag } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';
import { normalizeUrl } from '@/lib/health';
import { progress } from '@/lib/types';
import { useTheme } from '@/hooks/use-theme';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { get, checks, check, toggleActive, toggleFavourite, toggleFeature, remove } = useProjects();
  const { width } = useWindowDimensions();
  const t = useTheme();
  const p = get(id);
  useEffect(() => { if (id) check(id); }, [id, check]);

  if (!p) {
    return (
      <Screen>
        <View style={{ padding: Spacing.three }}><IconButton name="chevron-back" label="Back" onPress={() => router.back()} /></View>
        <EmptyState icon="alert-circle-outline" title="Project not found" message="It may have been deleted." />
      </Screen>
    );
  }
  const { done, total } = progress(p);
  const pending = p.features.filter((f) => !f.done);
  const completed = p.features.filter((f) => f.done);
  const open = (url: string) => WebBrowser.openBrowserAsync(normalizeUrl(url));
  const confirmDelete = () =>
    Alert.alert('Delete project?', p.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { remove(p.id); router.back(); } },
    ]);
  const links: [string, string, 'globe-outline' | 'server-outline' | 'logo-github'][] = [
    ['Website', p.websiteUrl, 'globe-outline'], ['Backend', p.backendUrl, 'server-outline'], ['Repository', p.repoUrl, 'logo-github'],
  ];
  const feature = (f: { id: string; title: string; done: boolean }) => (
    <Pressable key={f.id} onPress={() => toggleFeature(p.id, f.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}>
      <Icon name={f.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={f.done ? t.success : t.textSecondary} />
      <ThemedText style={{ flex: 1, textDecorationLine: f.done ? 'line-through' : 'none', opacity: f.done ? 0.6 : 1 }}>{f.title}</ThemedText>
    </Pressable>
  );

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.three }}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          <IconButton name={p.favourite ? 'heart' : 'heart-outline'} label="Favourite" color={p.favourite ? t.danger : undefined} onPress={() => toggleFavourite(p.id)} />
          <IconButton name="create-outline" label="Edit" onPress={() => router.push({ pathname: '/project/form', params: { id: p.id } })} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.six, gap: Spacing.four }}>
        {p.images.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {p.images.map((uri, i) => (
              <Image key={i} source={{ uri }} contentFit="cover"
                style={{ width: width - Spacing.three * 2, height: 220, borderRadius: Radius.lg, marginHorizontal: Spacing.three }} />
            ))}
          </ScrollView>
        ) : <Thumb project={p} style={{ aspectRatio: 16 / 9, marginHorizontal: Spacing.three, borderRadius: Radius.lg }} />}

        <View style={{ paddingHorizontal: Spacing.three, gap: Spacing.four }}>
          <View style={{ gap: 4 }}>
            <ThemedText type="title">{p.title}</ThemedText>
            <ThemedText themeColor="textSecondary">{p.category}{p.summary ? ` · ${p.summary}` : ''}</ThemedText>
          </View>

          <Section title="Status">
            <View style={{ gap: 10, backgroundColor: t.backgroundElement, borderRadius: Radius.md, padding: Spacing.three }}>
              <Pressable onPress={() => toggleActive(p.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StatusDot state={p.active ? 'on' : 'off'} />
                <ThemedText type="small"><ThemedText type="smallBold">Manual</ThemedText>  {p.active ? 'Active' : 'Inactive'} (tap to change)</ThemedText>
              </Pressable>
              {p.websiteUrl ? <LiveBadge label="Website" h={checks[p.id]?.website} /> : null}
              {p.backendUrl ? <LiveBadge label="Backend" h={checks[p.id]?.backend} /> : null}
              {(p.websiteUrl || p.backendUrl) ? <Button label="Check now" icon="refresh" variant="secondary" onPress={() => check(p.id)} style={{ alignSelf: 'flex-start' }} /> : null}
            </View>
          </Section>

          {p.description ? <Section title="About"><RichText text={p.description} /></Section> : null}

          {p.stack.length > 0 && (
            <Section title="Tech stack">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>{p.stack.map((s) => <Tag key={s} label={s} />)}</View>
            </Section>
          )}

          {total > 0 && (
            <Section title="Features" action={<ThemedText type="smallBold" themeColor="textSecondary">{done}/{total} done</ThemedText>}>
              {pending.length > 0 && <ThemedText type="smallBold" themeColor="textSecondary">Pending</ThemedText>}
              {pending.map(feature)}
              {completed.length > 0 && <ThemedText type="smallBold" themeColor="textSecondary" style={{ marginTop: 6 }}>Completed</ThemedText>}
              {completed.map(feature)}
            </Section>
          )}

          {links.some(([, u]) => u) && (
            <Section title="Links">
              {links.filter(([, u]) => u).map(([label, url, icon]) => (
                <Pressable key={label} onPress={() => open(url)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.backgroundElement, borderRadius: Radius.md, padding: Spacing.three }}>
                  <Icon name={icon} />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{label}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>{url}</ThemedText>
                  </View>
                  <Icon name="open-outline" size={18} color={t.textSecondary} />
                </Pressable>
              ))}
            </Section>
          )}
          <Button label="Delete project" icon="trash-outline" variant="danger" onPress={confirmDelete} />
        </View>
      </ScrollView>
    </Screen>
  );
}
