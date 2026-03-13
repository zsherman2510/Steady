import { useMemo, useState } from 'react';
import { Text, StyleSheet, Pressable, View, ScrollView } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';
import { onboardingSlides, speakingGoals, speakingSituations } from '../data/onboarding';
import type { AppState, UserProfile } from '../state/appState';

type Props = {
  onBack: () => void;
  appState: AppState;
  actions: {
    finishOnboarding: (profile: Pick<UserProfile, 'primaryGoal' | 'speakingSituations'>) => void;
  };
};

export function WelcomeScreen({ onBack, appState, actions }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(appState.user?.primaryGoal || speakingGoals[0]);
  const [selected, setSelected] = useState<string[]>(appState.user?.speakingSituations || []);

  const isLast = step === onboardingSlides.length;
  const canContinue = useMemo(() => {
    if (step < onboardingSlides.length) return true;
    return Boolean(goal) && selected.length > 0;
  }, [goal, selected, step]);

  const toggleSituation = (value: string) => {
    setSelected((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>WELCOME</Text>
        <Text style={styles.title}>Let’s make speaking feel less heavy.</Text>
        <Text style={styles.sub}>A quick setup so Steady can help with the moments that actually trip you up.</Text>

        {!isLast ? (
          <Card>
            <Text style={styles.step}>Step {step + 1} of {onboardingSlides.length + 1}</Text>
            <Text style={styles.cardTitle}>{onboardingSlides[step].title}</Text>
            <Text style={styles.body}>{onboardingSlides[step].body}</Text>
          </Card>
        ) : (
          <>
            <Card>
              <Text style={styles.step}>Step {onboardingSlides.length + 1} of {onboardingSlides.length + 1}</Text>
              <Text style={styles.cardTitle}>What do you want help with first?</Text>
              {speakingGoals.map((item) => (
                <Pressable key={item} style={[styles.choice, goal === item && styles.choiceActive]} onPress={() => setGoal(item)}>
                  <Text style={[styles.choiceText, goal === item && styles.choiceTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Which situations matter most right now?</Text>
              <Text style={styles.helper}>Pick at least one. These shape your first practice drills.</Text>
              <View style={styles.tagsWrap}>
                {speakingSituations.map((item) => {
                  const active = selected.includes(item);
                  return (
                    <Pressable key={item} style={[styles.tag, active && styles.tagActive]} onPress={() => toggleSituation(item)}>
                      <Text style={[styles.tagText, active && styles.tagTextActive]}>{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          </>
        )}

        <Pressable
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          disabled={!canContinue}
          onPress={() => {
            if (!isLast) return setStep((prev) => prev + 1);
            actions.finishOnboarding({ primaryGoal: goal, speakingSituations: selected });
          }}
        >
          <Text style={styles.ctaText}>{isLast ? 'Finish setup' : 'Continue'}</Text>
        </Pressable>
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
  step: { color: theme.colors.accent2, fontSize: 13, fontWeight: '700', marginBottom: 12 },
  cardTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: 10 },
  body: { color: theme.colors.muted, fontSize: 16, lineHeight: 24 },
  helper: { color: theme.colors.muted, fontSize: 14, marginBottom: 14 },
  choice: { backgroundColor: theme.colors.surface2, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border },
  choiceActive: { borderColor: theme.colors.accent, backgroundColor: '#13313A' },
  choiceText: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  choiceTextActive: { color: '#D8FFFB' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border },
  tagActive: { backgroundColor: '#123342', borderColor: theme.colors.accent2 },
  tagText: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  tagTextActive: { color: '#D9EEFF' },
  cta: { backgroundColor: theme.colors.accent, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#081018', fontSize: 16, fontWeight: '800' },
});
