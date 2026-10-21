import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, View } from 'react-native';

import { RichTextEditor } from '@/components/rich-text';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip, Field, Icon, IconButton, Screen, Section, Tag } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';
import { useTheme } from '@/hooks/use-theme';
import { emptyDraft, ProjectDraft, uid } from '@/lib/types';

const PRESETS = ['Mobile', 'Web', 'Backend', 'Design', 'Other'];

export default function ProjectForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { get, add, update, projects } = useProjects();
  const t = useTheme();
  const existing = id ? get(id) : undefined;
  const [d, setD] = useState<ProjectDraft>(() => (existing ? { ...existing } : emptyDraft()));
  const [tech, setTech] = useState('');
  const [feat, setFeat] = useState('');
  const set = <K extends keyof ProjectDraft>(k: K, v: ProjectDraft[K]) => setD((p) => ({ ...p, [k]: v }));
  const categories = Array.from(new Set([...PRESETS, ...projects.map((p) => p.category).filter(Boolean)]));

  const pickImages = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 6, quality: 0.5, base64: true,
    });
    if (r.canceled) return;
    const added = r.assets.filter((a) => a.base64).map((a) => `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}`);
    set('images', [...d.images, ...added].slice(0, 8));
  };
  const addTech = () => {
    const v = tech.trim();
    if (v && !d.stack.includes(v)) set('stack', [...d.stack, v]);
    setTech('');
  };
  const addFeature = () => {
    const v = feat.trim();
    if (v) set('features', [...d.features, { id: uid(), title: v, done: false }]);
    setFeat('');
  };
  const save = () => {
    if (!d.title.trim()) return Alert.alert('Title needed', 'Give your project a name first.');
    const clean = { ...d, title: d.title.trim(), category: d.category.trim() || 'Other' };
    if (existing) update(existing.id, clean); else add(clean);
    router.back();
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.three }}>
        <ThemedText type="title">{existing ? 'Edit project' : 'New project'}</ThemedText>
        <IconButton name="close" label="Close" onPress={() => router.back()} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: Spacing.three, gap: Spacing.four, paddingBottom: Spacing.six }}>
        <Field label="Title" value={d.title} onChangeText={(v) => set('title', v)} placeholder="Project name" />
        <Field label="Short summary" value={d.summary} onChangeText={(v) => set('summary', v)} placeholder="One line about it" />

        <Section title="Category">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
            {categories.map((c) => <Chip key={c} label={c} active={d.category === c} onPress={() => set('category', c)} />)}
          </View>
          <Field label="Or type a new one" value={d.category} onChangeText={(v) => set('category', v)} placeholder="e.g. Game" />
        </Section>

        <Section title="Images" action={<Button label="Add" icon="image-outline" variant="secondary" onPress={pickImages} />}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.two }}>
            {d.images.map((uri, i) => (
              <View key={i}>
                <Image source={{ uri }} style={{ width: 96, height: 96, borderRadius: Radius.md }} contentFit="cover" />
                <Pressable onPress={() => set('images', d.images.filter((_, j) => j !== i))} hitSlop={6}
                  style={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 2 }}>
                  <Icon name="close" size={16} color="#fff" />
                </Pressable>
              </View>
            ))}
            {d.images.length === 0 && <ThemedText themeColor="textSecondary">No images yet. The first one becomes the thumbnail.</ThemedText>}
          </ScrollView>
        </Section>

        <RichTextEditor value={d.description} onChange={(v) => set('description', v)} />

        <Section title="Tech stack">
          <Field label="Add technology" value={tech} onChangeText={setTech} onSubmitEditing={addTech} placeholder="Expo, Node, Postgres…" returnKeyType="done" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
            {d.stack.map((s) => <Tag key={s} label={s} onRemove={() => set('stack', d.stack.filter((x) => x !== s))} />)}
          </View>
        </Section>

        <Section title="Features">
          <Field label="Add feature" value={feat} onChangeText={setFeat} onSubmitEditing={addFeature} placeholder="e.g. Push notifications" returnKeyType="done" />
          {d.features.map((f) => (
            <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable onPress={() => set('features', d.features.map((x) => (x.id === f.id ? { ...x, done: !x.done } : x)))}>
                <Icon name={f.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={f.done ? t.success : t.textSecondary} />
              </Pressable>
              <ThemedText style={{ flex: 1 }}>{f.title}</ThemedText>
              <Pressable onPress={() => set('features', d.features.filter((x) => x.id !== f.id))} hitSlop={8}>
                <Icon name="trash-outline" size={20} color={t.danger} />
              </Pressable>
            </View>
          ))}
          <ThemedText type="caption" themeColor="textSecondary">Tap the circle to mark a feature completed.</ThemedText>
        </Section>

        <Section title="Links">
          <Field label="Website" value={d.websiteUrl} onChangeText={(v) => set('websiteUrl', v)} autoCapitalize="none" keyboardType="url" placeholder="https://" />
          <Field label="Backend / API" value={d.backendUrl} onChangeText={(v) => set('backendUrl', v)} autoCapitalize="none" keyboardType="url" placeholder="https://" />
          <Field label="Repository" value={d.repoUrl} onChangeText={(v) => set('repoUrl', v)} autoCapitalize="none" keyboardType="url" placeholder="https://github.com/…" />
        </Section>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <ThemedText type="bold">Active</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Shows a green dot when on, red when off.</ThemedText>
          </View>
          <Switch value={d.active} onValueChange={(v) => set('active', v)} trackColor={{ true: t.success }} />
        </View>

        <Button label={existing ? 'Save changes' : 'Create project'} icon="checkmark" onPress={save} />
      </ScrollView>
    </Screen>
  );
}
