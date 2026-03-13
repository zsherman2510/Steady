import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';
import type { AppState, UserProfile } from '../state/appState';

type Props = {
  onBack: () => void;
  appState: AppState;
  actions: {
    signIn: (payload: Pick<UserProfile, 'name' | 'email'>) => void;
    signOut?: () => void;
  };
};

export function AuthScreen({ onBack, appState, actions }: Props) {
  const [name, setName] = useState(appState.user?.name || '');
  const [email, setEmail] = useState(appState.user?.email || '');
  const [mode, setMode] = useState<'email' | 'guest'>('email');

  const canSubmit = useMemo(() => {
    if (mode === 'guest') return name.trim().length >= 2;
    return name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(email.trim());
  }, [name, email, mode]);

  const handleSubmit = () => {
    if (!canSubmit) {
      Alert.alert('Missing info', mode === 'guest' ? 'Add a display name first.' : 'Add a valid name and email first.');
      return;
    }
    actions.signIn({ name: name.trim(), email: mode === 'guest' ? '' : email.trim() });
  };

  return (
    <Screen>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
      <Text style={styles.eyebrow}>AUTH</Text>
      <Text style={styles.title}>Private, simple, no judgment.</Text>
      <Text style={styles.sub}>This is a clean auth placeholder now. Convex Auth plugs in here next, but the screen already behaves like a real entry flow.</Text>

      <Card>
        <Text style={styles.cardTitle}>How do you want to enter?</Text>
        <View style={styles.segmentRow}>
          <Pressable style={[styles.segment, mode === 'email' && styles.segmentActive]} onPress={() => setMode('email')}>
            <Text style={[styles.segmentText, mode === 'email' && styles.segmentTextActive]}>Email</Text>
          </Pressable>
          <Pressable style={[styles.segment, mode === 'guest' && styles.segmentActive]} onPress={() => setMode('guest')}>
            <Text style={[styles.segmentText, mode === 'guest' && styles.segmentTextActive]}>Guest</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Display name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Zavion" placeholderTextColor="#64748B" style={styles.input} />

        {mode === 'email' && (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#64748B" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          </>
        )}

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Next step</Text>
          <Text style={styles.noteBody}>Swap this local state flow with Convex Auth once we wire the real provider. The UI and copy can stay.</Text>
        </View>
      </Card>

      <Pressable style={[styles.cta, !canSubmit && styles.ctaDisabled]} onPress={handleSubmit} disabled={!canSubmit}>
        <Text style={styles.ctaText}>{mode === 'guest' ? 'Continue as guest' : 'Continue with email'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 4, marginBottom: 14 },
  backText: { color: theme.colors.accent, fontSize: 15, fontWeight: '600' },
  eyebrow: { color: theme.colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  sub: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginTop: 10, marginBottom: 20 },
  cardTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: 14 },
  segmentRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: theme.colors.surface2, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  segmentActive: { borderColor: theme.colors.accent, backgroundColor: '#13313A' },
  segmentText: { color: theme.colors.text, fontWeight: '700' },
  segmentTextActive: { color: '#D8FFFB' },
  label: { color: theme.colors.text, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  input: { backgroundColor: theme.colors.surface2, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, color: theme.colors.text, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border },
  noteBox: { marginTop: 6, padding: 14, borderRadius: 14, backgroundColor: '#101A2F', borderWidth: 1, borderColor: theme.colors.border },
  noteTitle: { color: theme.colors.accent2, fontSize: 13, fontWeight: '800', marginBottom: 6 },
  noteBody: { color: theme.colors.muted, fontSize: 14, lineHeight: 20 },
  cta: { backgroundColor: theme.colors.accent, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#081018', fontSize: 16, fontWeight: '800' },
});
