import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../../components/Card';
import { Screen } from '../../components/Screen';
import { authClient } from '../../lib/authClient';
import { theme } from '../../lib/theme';
import type { AppState } from '../state/appState';

type Props = {
  onBack: () => void;
  appState: AppState;
  actions?: {
    signOut?: () => Promise<void> | void;
  };
};

type AuthMode = 'sign-in' | 'sign-up';

function getAuthErrorMessage(error: unknown) {
  if (!error) return 'Unable to complete the request.';
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    const value = error as {
      message?: string;
      statusText?: string;
      error?: { message?: string };
    };
    return value.message ?? value.error?.message ?? value.statusText ?? 'Unable to complete the request.';
  }
  return 'Unable to complete the request.';
}

export function AuthScreen({ onBack, appState, actions }: Props) {
  const [name, setName] = useState(appState.user?.name || '');
  const [email, setEmail] = useState(appState.user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('sign-up');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    const hasValidEmail = /^\S+@\S+\.\S+$/.test(email.trim());
    if (mode === 'sign-in') {
      return hasValidEmail && password.length >= 10;
    }
    return name.trim().length >= 2 && hasValidEmail && password.length >= 10 && password === confirmPassword;
  }, [confirmPassword, email, mode, name, password]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        'Missing info',
        mode === 'sign-in'
          ? 'Enter a valid email and a password with at least 10 characters.'
          : 'Enter your name, a valid email, and matching passwords with at least 10 characters.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: normalizedEmail,
          password,
        });

        if (result.error) {
          setErrorMessage(getAuthErrorMessage(result.error));
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email: normalizedEmail,
          password,
        });

        if (result.error) {
          setErrorMessage(getAuthErrorMessage(result.error));
          return;
        }
      }

      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
      <Text style={styles.eyebrow}>AUTH</Text>
      <Text style={styles.title}>Private, simple, no judgment.</Text>
      <Text style={styles.sub}>Real account auth is wired now with Convex and Better Auth. Authorization is enforced on the backend, not by screen state.</Text>

      <Card>
        <Text style={styles.cardTitle}>Secure account access</Text>
        <View style={styles.segmentRow}>
          <Pressable style={[styles.segment, mode === 'sign-up' && styles.segmentActive]} onPress={() => setMode('sign-up')}>
            <Text style={[styles.segmentText, mode === 'sign-up' && styles.segmentTextActive]}>Create account</Text>
          </Pressable>
          <Pressable style={[styles.segment, mode === 'sign-in' && styles.segmentActive]} onPress={() => setMode('sign-in')}>
            <Text style={[styles.segmentText, mode === 'sign-in' && styles.segmentTextActive]}>Sign in</Text>
          </Pressable>
        </View>

        {mode === 'sign-up' && (
          <>
            <Text style={styles.label}>Display name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Zavion" placeholderTextColor="#64748B" style={styles.input} />
          </>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#64748B" autoCapitalize="none" keyboardType="email-address" style={styles.input} />

        <Text style={styles.label}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} placeholder="At least 10 characters" placeholderTextColor="#64748B" secureTextEntry style={styles.input} />

        {mode === 'sign-up' && (
          <>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter your password" placeholderTextColor="#64748B" secureTextEntry style={styles.input} />
          </>
        )}

        {Boolean(errorMessage) && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Authorization model</Text>
          <Text style={styles.noteBody}>Profile writes are scoped to the signed-in user, and privileged actions are protected by server-side role checks.</Text>
        </View>
      </Card>

      <Pressable style={[styles.cta, (!canSubmit || isSubmitting) && styles.ctaDisabled]} onPress={() => void handleSubmit()} disabled={!canSubmit || isSubmitting}>
        <Text style={styles.ctaText}>{isSubmitting ? 'Securing session...' : mode === 'sign-up' ? 'Create secure account' : 'Sign in securely'}</Text>
      </Pressable>

      {appState.isAuthenticated && actions?.signOut && (
        <Pressable style={styles.secondaryCta} onPress={() => void actions.signOut?.()}>
          <Text style={styles.secondaryCtaText}>Sign out</Text>
        </Pressable>
      )}
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
  errorBox: { marginBottom: 14, padding: 12, borderRadius: 14, backgroundColor: '#2B1118', borderWidth: 1, borderColor: '#7F1D1D' },
  errorText: { color: '#FECACA', fontSize: 14, lineHeight: 20 },
  noteBox: { marginTop: 6, padding: 14, borderRadius: 14, backgroundColor: '#101A2F', borderWidth: 1, borderColor: theme.colors.border },
  noteTitle: { color: theme.colors.accent2, fontSize: 13, fontWeight: '800', marginBottom: 6 },
  noteBody: { color: theme.colors.muted, fontSize: 14, lineHeight: 20 },
  cta: { backgroundColor: theme.colors.accent, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#081018', fontSize: 16, fontWeight: '800' },
  secondaryCta: { borderRadius: 18, paddingVertical: 14, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 },
  secondaryCtaText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
});
