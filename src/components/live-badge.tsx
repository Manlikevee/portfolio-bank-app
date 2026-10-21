import { View } from 'react-native';

import { Health } from '@/lib/health';
import { DotState, StatusDot } from './ui';
import { ThemedText } from './themed-text';

export function LiveBadge({ label, h }: { label: string; h?: Health }) {
  const state: DotState = !h ? 'idle' : h.state === 'up' ? 'on' : h.state === 'down' ? 'off' : 'wait';
  const text = !h ? 'Not checked' : h.state === 'checking' ? 'Checking…' : h.state === 'up' ? `Online · ${h.ms} ms` : 'Offline';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <StatusDot state={state} />
      <ThemedText type="small"><ThemedText type="smallBold">{label}</ThemedText>  {text}</ThemedText>
    </View>
  );
}
