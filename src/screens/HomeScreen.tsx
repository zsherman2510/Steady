import { Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';

export function HomeScreen({ onBack, appState }: { onBack: () => void; appState?: any; actions?: any }) {
  return (
    <Screen>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.sub}>Steady MVP screen scaffold.</Text>
      <Card>
        <Text style={styles.cardTitle}>Welcome back{appState?.user?.name ? `, ${appState.user.name}` : ''}</Text>
        <Text style={styles.body}>Daily confidence score, quick practice, and recent wins.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 4, marginBottom: 14 },
  backText: { color: theme.colors.accent, fontSize: 15, fontWeight: '600' },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  sub: { color: theme.colors.muted, fontSize: 16, marginTop: 8, marginBottom: 20 },
  cardTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '700', marginBottom: 10 },
  body: { color: theme.colors.muted, fontSize: 15, lineHeight: 22 }
});
