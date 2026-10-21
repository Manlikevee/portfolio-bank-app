import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ReactElement } from 'react';

import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';
import { Project, progress } from '@/lib/types';
import { StatusDot } from './ui';
import { Icon } from './ui';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

const PALETTE = ['#6C5CE7', '#00A8A8', '#F0824C', '#E84A8A', '#3B82F6', '#22A06B'];

export function Thumb({ project, style }: { project: Project; style?: StyleProp<ViewStyle> }) {
  const color = PALETTE[[...project.title].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
  const uri = project.images[0];
  return (
    <View style={[{ aspectRatio: 1, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: color, alignItems: 'center', justifyContent: 'center' }, style]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        : <ThemedText type="title" style={{ color: '#fff' }}>{project.title.slice(0, 2).toUpperCase()}</ThemedText>}
    </View>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { toggleFavourite } = useProjects();
  const t = useTheme();
  const { done, total } = progress(project);
  return (
    <Pressable style={{ flex: 1, maxWidth: '50%', gap: 6 }}
      onPress={() => router.push({ pathname: '/project/[id]', params: { id: project.id } })}>
      <View>
        <Thumb project={project} />
        <View style={[s.pill, { left: 8, backgroundColor: 'rgba(0,0,0,0.45)', flexDirection: 'row', gap: 6, paddingHorizontal: 10, alignItems: 'center' }]}>
          <StatusDot state={project.active ? 'on' : 'off'} size={8} />
          <ThemedText type="caption" style={{ color: '#fff' }}>{project.active ? 'Active' : 'Inactive'}</ThemedText>
        </View>
        <Pressable onPress={() => toggleFavourite(project.id)} hitSlop={8} accessibilityLabel="Toggle favourite"
          style={[s.pill, { right: 8, width: 32, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }]}>
          <Icon name={project.favourite ? 'heart' : 'heart-outline'} size={18} color={project.favourite ? '#FF6B70' : '#fff'} />
        </Pressable>
      </View>
      <ThemedText type="bold" numberOfLines={1}>{project.title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
        {project.category}{total ? ` · ${done}/${total} features` : ''}
      </ThemedText>
      {total > 0 && (
        <View style={{ height: 4, borderRadius: 2, backgroundColor: t.backgroundSelected }}>
          <View style={{ height: 4, borderRadius: 2, width: `${(done / total) * 100}%`, backgroundColor: t.success }} />
        </View>
      )}
    </Pressable>
  );
}

export function ProjectGrid({ data, header, empty }: { data: Project[]; header?: ReactElement; empty: ReactElement }) {
  return (
    <FlatList data={data} numColumns={2} keyExtractor={(p) => p.id} keyboardShouldPersistTaps="handled"
      columnWrapperStyle={{ gap: Spacing.three }}
      contentContainerStyle={{ padding: Spacing.three, gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.five }}
      ListHeaderComponent={header} ListEmptyComponent={empty}
      renderItem={({ item }) => <ProjectCard project={item} />} />
  );
}

const s = StyleSheet.create({
  pill: { position: 'absolute', top: 8, height: 32, borderRadius: 16 },
});
