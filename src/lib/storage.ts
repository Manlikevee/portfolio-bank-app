import Storage from 'expo-sqlite/kv-store';

export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await Storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function save(key: string, value: unknown) {
  try {
    await Storage.setItem(key, JSON.stringify(value));
  } catch {}
}
