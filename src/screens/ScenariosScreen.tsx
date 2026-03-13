import { useMemo, useState } from 'react';
import { Text, StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';
import { scenarioCategories, scenarios } from '../data/scenarios';

type Props = {
  onBack: () => void;
  appState?: any;
  actions?: any;
};

export function ScenariosScreen({ onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);

  const filtered = useMemo(() => scenarios.filter((item) => item.category === selectedCategory), [selectedCategory]);
  const selectedScenario = filtered.find((item) => item.id === selectedScenarioId) || filtered[0];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>SCENARIOS</Text>
        <Text style={styles.title}>Practice real moments, not random exercises.</Text>
        <Text style={styles.sub}>This should help users train for the exact situations where they usually tense up or avoid speaking.</Text>

        <Card>
          <Text style={styles.cardTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {scenarioCategories.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    const first = scenarios.find((item) => item.category === category.id);
                    if (first) setSelectedScenarioId(first.id);
                  }}
                >
                  <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{category.title}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Scenario list</Text>
          {filtered.map((scenario) => {
            const active = scenario.id === selectedScenario?.id;
            return (
              <Pressable key={scenario.id} style={[styles.scenarioRow, active && styles.scenarioRowActive]} onPress={() => setSelectedScenarioId(scenario.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                  <Text style={styles.scenarioSummary}>{scenario.summary}</Text>
                </View>
                <View style={[styles.badge, scenario.difficulty === 'Hard' && styles.badgeHard, scenario.difficulty === 'Easy' && styles.badgeEasy]}>
                  <Text style={styles.badgeText}>{scenario.difficulty}</Text>
                </View>
              </Pressable>
            );
          })}
        </Card>

        {selectedScenario && (
          <Card>
            <Text style={styles.cardTitle}>{selectedScenario.title}</Text>
            <Text style={styles.detailLabel}>Starter line</Text>
            <Text style={styles.starter}>{selectedScenario.starter}</Text>
            <Text style={styles.detailLabel}>Why this matters</Text>
            <Text style={styles.scenarioSummary}>{selectedScenario.summary}</Text>
            <Pressable style={styles.cta}><Text style={styles.ctaText}>Start practice</Text></Pressable>
          </Card>
        )}
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
  cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border },
  categoryChipActive: { backgroundColor: '#123342', borderColor: theme.colors.accent2 },
  categoryText: { color: theme.colors.text, fontWeight: '700' },
  categoryTextActive: { color: '#D9EEFF' },
  scenarioRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 16, backgroundColor: theme.colors.surface2, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border },
  scenarioRowActive: { borderColor: theme.colors.accent },
  scenarioTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '800', marginBottom: 6 },
  scenarioSummary: { color: theme.colors.muted, fontSize: 14, lineHeight: 20 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#334155' },
  badgeEasy: { backgroundColor: '#064E3B' },
  badgeHard: { backgroundColor: '#7F1D1D' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  detailLabel: { color: theme.colors.accent2, fontSize: 13, fontWeight: '800', marginTop: 10, marginBottom: 6 },
  starter: { color: theme.colors.text, fontSize: 18, fontWeight: '700', lineHeight: 26 },
  cta: { backgroundColor: theme.colors.accent, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  ctaText: { color: '#081018', fontSize: 16, fontWeight: '800' },
});
