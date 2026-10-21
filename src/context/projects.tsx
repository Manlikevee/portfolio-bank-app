import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { checkUrl, Health } from '@/lib/health';
import { load, save } from '@/lib/storage';
import { Project, ProjectDraft, uid } from '@/lib/types';

type Check = { website?: Health; backend?: Health };
type Ctx = {
  projects: Project[]; ready: boolean; checks: Record<string, Check>;
  get: (id: string) => Project | undefined;
  add: (d: ProjectDraft) => string;
  update: (id: string, d: Partial<Project>) => void;
  remove: (id: string) => void;
  toggleFavourite: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleFeature: (id: string, featureId: string) => void;
  check: (id: string) => Promise<void>;
  checkAll: () => Promise<void>;
  clearAll: () => void;
};
const ProjectsContext = createContext<Ctx | null>(null);
export const useProjects = () => {
  const c = useContext(ProjectsContext);
  if (!c) throw new Error('useProjects must be used inside ProjectsProvider');
  return c;
};

const now = Date.now();
const SEED: Project[] = [
  {
    id: 'seed-1', title: 'Portfolio Website', category: 'Web', summary: 'Personal site with case studies',
    description: '# Overview\nA fast **static portfolio** with project case studies.\n- Responsive layout\n- *Dark mode* support',
    images: [], stack: ['React', 'Vite', 'Tailwind'], websiteUrl: 'https://example.com', backendUrl: '', repoUrl: '',
    features: [
      { id: 'f1', title: 'Landing page', done: true }, { id: 'f2', title: 'Case study pages', done: true },
      { id: 'f3', title: 'Contact form', done: false },
    ],
    active: true, favourite: true, createdAt: now, updatedAt: now,
  },
  {
    id: 'seed-2', title: 'Tasks API', category: 'Backend', summary: 'REST API for a to-do app',
    description: 'Node service with **JWT auth** and a Postgres database.',
    images: [], stack: ['Node', 'Express', 'PostgreSQL'], websiteUrl: '', backendUrl: 'https://example.com/api', repoUrl: '',
    features: [{ id: 'f4', title: 'Auth endpoints', done: true }, { id: 'f5', title: 'Rate limiting', done: false }],
    active: false, favourite: false, createdAt: now, updatedAt: now,
  },
];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);
  const [checks, setChecks] = useState<Record<string, Check>>({});
  const ref = useRef(projects);
  ref.current = projects;

  useEffect(() => {
    load<Project[] | null>('projects', null).then((p) => { setProjects(p ?? SEED); setReady(true); });
  }, []);
  useEffect(() => { if (ready) save('projects', projects); }, [projects, ready]);

  const patch = (id: string, fn: (p: Project) => Partial<Project>) =>
    setProjects((all) => all.map((p) => (p.id === id ? { ...p, ...fn(p), updatedAt: Date.now() } : p)));

  const check = useCallback(async (id: string) => {
    const p = ref.current.find((x) => x.id === id);
    if (!p) return;
    const run = async (key: 'website' | 'backend', url: string) => {
      if (!url) return;
      setChecks((c) => ({ ...c, [id]: { ...c[id], [key]: { state: 'checking', at: Date.now() } } }));
      const result = await checkUrl(url);
      setChecks((c) => ({ ...c, [id]: { ...c[id], [key]: result } }));
    };
    await Promise.all([run('website', p.websiteUrl), run('backend', p.backendUrl)]);
  }, []);

  const value: Ctx = {
    projects, ready, checks, check,
    get: (id) => projects.find((p) => p.id === id),
    add: (d) => {
      const id = uid(); const t = Date.now();
      setProjects((all) => [{ ...d, id, createdAt: t, updatedAt: t }, ...all]);
      return id;
    },
    update: (id, d) => patch(id, () => d),
    remove: (id) => setProjects((all) => all.filter((p) => p.id !== id)),
    toggleFavourite: (id) => patch(id, (p) => ({ favourite: !p.favourite })),
    toggleActive: (id) => patch(id, (p) => ({ active: !p.active })),
    toggleFeature: (id, fid) =>
      patch(id, (p) => ({ features: p.features.map((f) => (f.id === fid ? { ...f, done: !f.done } : f)) })),
    checkAll: async () => { await Promise.all(ref.current.map((p) => check(p.id))); },
    clearAll: () => setProjects([]),
  };
  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}
