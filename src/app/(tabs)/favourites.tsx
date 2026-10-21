import { ProjectGrid } from '@/components/project-card';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, Screen } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';

export default function Favourites() {
  const { projects } = useProjects();
  return (
    <Screen>
      <ProjectGrid data={projects.filter((p) => p.favourite)}
        header={<ThemedText type="title" style={{ marginBottom: Spacing.one }}>Favourites</ThemedText>}
        empty={<EmptyState icon="heart-outline" title="No favourites yet" message="Tap the heart on a project to pin it here." />} />
    </Screen>
  );
}
