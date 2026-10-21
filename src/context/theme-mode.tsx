import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import { load, save } from '@/lib/storage';

export type Mode = 'system' | 'light' | 'dark';
const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({ mode: 'system', setMode: () => {} });
export const useThemeMode = () => useContext(Ctx);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('system');
  const apply = (m: Mode) => Appearance.setColorScheme(m === 'system' ? null : m);

  useEffect(() => {
    load<Mode>('theme-mode', 'system').then((m) => { setModeState(m); apply(m); });
  }, []);

  const setMode = (m: Mode) => { setModeState(m); apply(m); save('theme-mode', m); };
  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}
