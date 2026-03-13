import { Text, StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';
import type { AppState } from '../state/appState';

type Props = {
  onBack: () => void;
  appState?: AppState;
  actions?: any;
};

export function HomeScreen({ onBack, appState }: Props) {
  const user = appState?.user;
  const confidenceMap: Record<number, string> = {
    1: 'Very hard right now',
    2: 'Pretty hard',
    3: 'Manageable some days',
    4: 'Mostly needs polish',
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>HOME</Text>
        <Text style={styles.title}>Welcome back{user?.name ? `, ${user.name}` : ''}.</Text>
        <Text style={styles.sub}>This should feel like a calm command center, not a shame dashboard.</Text>

        <Card>
          <Text style={styles.cardTitle}>Your current focus</Text>
          <Text style={styles.bigMetric}>{user?.primaryGoal || 'Start conversations more easily'}</Text>
          <Text style={styles.helper}>Steady uses this to prioritize the kind of reps you get first.</Text>
        </Card>

        <View style={styles.row}>
          <View style={styles.col}>
            <Card>
              <Text style={styles.statLabel}>Confidence</Text>
              <Text style={styles.statValue}>{confidenceMap[user?.confidenceLevel || 2]}</Text>
            </Card>
          </View>
          <View style={styles.col}>
            <Card>
              <Text style={styles.statLabel}>Plan</Text>
              <Text style={styles.statValue}>{appState?.selectedPlan === 'yearly' ? 'Yearly Pro' : appState?.selectedPlan === 'weekly' ? 'Weekly Pro' : 'Not chosen'}</Text>
            </Card>
          </View>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Your hardest situations</Text>
          <View style={styles.tagsWrap}>
            {(user?.speakingSituations?.length ? user.speakingSituations : ['Ordering food', 'Phone calls']).map((item) => (
              <View key={item} style={styles.tag}><Text style={styles.tagText}>{item}</Text></View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Quick actions</Text>
          <Pressable style={styles.action}><Text style={styles.actionText}>Rewrite a sentence</Text></Pressable>
          <Pressable style={styles.action}><Text style={styles.actionText}>Start a scenario rep</Text></Pressable>
          <Pressable style={styles.action}><Text style={styles.actionText}>Do today’s confidence challenge</Text></Pressable>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 4, marginBottom: 14 },
  backText: { color: theme.colors.accent, fontSize: 15, fontWeight: '600' },
  eyebrow: { color: theme.colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  sub: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginTop: 10, marginBottom: 20 },
  cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  bigMetric: { color: theme.colors.text, fontSize: 24, fontWeight: '800', lineHeight: 30 },
  helper: { color: theme.colors.muted, fontSize: 14, lineHeight: 20, marginTop: 10 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  statLabel: { color: theme.colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  statValue: { color: theme.colors.text, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { backgroundColor: theme.colors.surface2, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: theme.colors.border },
  tagText: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  action: { backgroundColor: theme.colors.surface2, borderRadius: 14, padding: 14, marginBottom: 10 },
  actionText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
});
