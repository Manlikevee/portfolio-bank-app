export type Feature = { id: string; title: string; done: boolean };
export type Project = {
  id: string; title: string; category: string; summary: string; description: string;
  images: string[]; stack: string[]; features: Feature[];
  websiteUrl: string; backendUrl: string; repoUrl: string;
  active: boolean; favourite: boolean; createdAt: number; updatedAt: number;
};
export type ProjectDraft = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const progress = (p: Project) => ({
  done: p.features.filter((f) => f.done).length,
  total: p.features.length,
});
export const emptyDraft = (): ProjectDraft => ({
  title: '', category: '', summary: '', description: '', images: [], stack: [], features: [],
  websiteUrl: '', backendUrl: '', repoUrl: '', active: true, favourite: false,
});
