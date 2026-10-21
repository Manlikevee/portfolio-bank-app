import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance } from "react-native";

import { load, save } from "@/lib/storage";

export type Mode = "system" | "light" | "dark";

type ThemeModeContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const Ctx = createContext<ThemeModeContextType>({
  mode: "system",
  setMode: () => {},
});

export const useThemeMode = () => useContext(Ctx);

function applyTheme(mode: Mode) {
  Appearance.setColorScheme(mode === "system" ? "unspecified" : mode);
}

function isValidMode(value: unknown): value is Mode {
  return value === "system" || value === "light" || value === "dark";
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");

  useEffect(() => {
    let mounted = true;

    async function initializeTheme() {
      try {
        const storedMode = await load<Mode>("theme-mode", "system");

        const validMode = isValidMode(storedMode) ? storedMode : "system";

        if (mounted) {
          setModeState(validMode);
          applyTheme(validMode);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
        if (mounted) applyTheme("system");
      }
    }

    initializeTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    applyTheme(newMode);

    void save("theme-mode", newMode).catch((error) => {
      console.warn("Failed to save theme preference:", error);
    });
  }, []);

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}
