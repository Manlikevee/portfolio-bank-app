import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProjectGrid } from '@/components/project-card';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip, EmptyState, IconButton, Screen, SearchBar } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';

export default function Home() {
  const { projects } = useProjects();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))], [projects]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects
      .filter((p) => cat === 'All' || p.category === cat)
      .filter((p) => !needle || [p.title, p.category, p.summary, ...p.stack].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [projects, q, cat]);
  const active = projects.filter((p) => p.active).length;
  const pending = projects.reduce((n, p) => n + p.features.filter((f) => !f.done).length, 0);
  const add = () => router.push('/project/form');

  const header = (
    <View style={{ gap: Spacing.three }}>
      <View style={{ flexDirection: 'row', gap: Spacing.two, alignItems: 'center' }}>
        <SearchBar value={q} onChangeText={setQ} />
        <IconButton name="add" label="New project" onPress={add} />
      </View>
      <View style={{ backgroundColor: '#1E1F26', borderRadius: Radius.lg, padding: Spacing.four, gap: Spacing.three }}>
        <ThemedText type="subtitle" style={{ color: '#fff' }}>
          {projects.length} projects · {active} active
        </ThemedText>
        <ThemedText type="small" style={{ color: '#B8BBC8' }}>{pending} features still pending across your portfolio</ThemedText>
        <Button label="New project" icon="add" onPress={add} style={{ alignSelf: 'flex-start', backgroundColor: '#999' }} />
      </View>
      <ThemedText type="subtitle">Categories</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.two }}>
        {categories.map((c) => <Chip key={c} label={c} active={c === cat} onPress={() => setCat(c)} />)}
      </ScrollView>
    </View>
  );
  return (
    <Screen>
      <ProjectGrid data={shown} header={header}
        empty={<EmptyState icon="folder-open-outline" title="No projects found" message="Add a project or change your search and category filter." />} />
    </Screen>
  );
}
