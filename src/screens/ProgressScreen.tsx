import { Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';

export function ProgressScreen({ onBack }: { onBack: () => void }) {
  return (
    <Screen>
      <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.sub}>Steady MVP screen scaffold.</Text>
      <Card>
        <Text style={styles.cardTitle}>What belongs here</Text>
        <Text style={styles.body}>Progress, streaks, wins, and confidence tracking.</Text>
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
