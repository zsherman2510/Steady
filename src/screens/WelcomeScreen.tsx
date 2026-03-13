import { useState } from 'react';
import { Text, StyleSheet, Pressable, View, ScrollView } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { theme } from '../../lib/theme';
import { confidenceLevels, onboardingSlides, paywallPlans, speakingGoals, speakingSituations } from '../data/onboarding';
import type { AppState, SubscriptionPlan, UserProfile } from '../state/appState';

type Props = {
  onBack: () => void;
  appState: AppState;
  actions: {
    finishOnboarding: (profile: Pick<UserProfile, 'primaryGoal' | 'speakingSituations' | 'confidenceLevel'>, plan: SubscriptionPlan) => void;
  };
};

export function WelcomeScreen({ onBack, appState, actions }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(appState.user?.primaryGoal || speakingGoals[0]);
  const [selected, setSelected] = useState<string[]>(appState.user?.speakingSituations || []);
  const [confidence, setConfidence] = useState(appState.user?.confidenceLevel || 2);
  const [plan, setPlan] = useState<SubscriptionPlan>(appState.selectedPlan || 'yearly');

  const slide = onboardingSlides[step];

  const toggleSituation = (value: string) => {
    setSelected((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  };

  const canContinue = (() => {
    switch (slide.kind) {
      case 'situations': return selected.length > 0;
      case 'goal': return Boolean(goal);
      case 'confidence': return Boolean(confidence);
      case 'paywall': return Boolean(plan);
      default: return true;
    }
  })();

  const finish = () => {
    actions.finishOnboarding({
      primaryGoal: goal,
      speakingSituations: selected,
      confidenceLevel: confidence,
    }, plan);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <Pressable onPress={onBack} style={styles.back}><Text style={styles.backText}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>STEADY</Text>
        <Text style={styles.progress}>Step {step + 1} of {onboardingSlides.length}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.sub}>{slide.body}</Text>

        {slide.kind === 'story' && (
          <Card>
            <Text style={styles.cardTitle}>What Steady helps with</Text>
            <Text style={styles.body}>Starting sentences. Asking questions. Talking to strangers. Class. Work. Dating. The stuff that actually matters when the fear kicks in.</Text>
          </Card>
        )}

        {slide.kind === 'situations' && (
          <Card>
            <Text style={styles.cardTitle}>Your hardest moments</Text>
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
        )}

        {slide.kind === 'goal' && (
          <Card>
            <Text style={styles.cardTitle}>Primary goal</Text>
            {speakingGoals.map((item) => (
              <Pressable key={item} style={[styles.choice, goal === item && styles.choiceActive]} onPress={() => setGoal(item)}>
                <Text style={[styles.choiceText, goal === item && styles.choiceTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </Card>
        )}

        {slide.kind === 'confidence' && (
          <Card>
            <Text style={styles.cardTitle}>Current confidence</Text>
            {confidenceLevels.map((item) => (
              <Pressable key={item.value} style={[styles.choice, confidence === item.value && styles.choiceActive]} onPress={() => setConfidence(item.value)}>
                <Text style={[styles.choiceText, confidence === item.value && styles.choiceTextActive]}>{item.label}</Text>
              </Pressable>
            ))}
          </Card>
        )}

        {slide.kind === 'plan' && (
          <>
            <Card>
              <Text style={styles.cardTitle}>Your practice path</Text>
              <Text style={styles.body}>Based on what you picked, Steady will start with:</Text>
              <Text style={styles.bullet}>• sentence rewrites for easier starts</Text>
              <Text style={styles.bullet}>• scenario reps for {selected[0] || 'real-life speaking'}</Text>
              <Text style={styles.bullet}>• calmer daily speaking challenges</Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>What changes</Text>
              <Text style={styles.body}>Less dread before speaking. Better first words. More reps in the moments you usually avoid.</Text>
            </Card>
          </>
        )}

        {slide.kind === 'paywall' && (
          <>
            <Card>
              <Text style={styles.paywallTitle}>Unlock your private speaking coach</Text>
              <Text style={styles.body}>This is a hard paywall flow. The point is to sell the transformation, not let people wander around for free and forget why they came.</Text>
              <View style={{ marginTop: 16 }}>
                {paywallPlans.map((item) => {
                  const active = plan === item.id;
                  return (
                    <Pressable key={item.id} style={[styles.planCard, active && styles.planCardActive]} onPress={() => setPlan(item.id as SubscriptionPlan)}>
                      <View style={styles.planHeader}>
                        <Text style={[styles.planTitle, active && styles.choiceTextActive]}>{item.title}</Text>
                        <Text style={styles.badge}>{item.badge}</Text>
                      </View>
                      <Text style={[styles.planPrice, active && styles.choiceTextActive]}>{item.price}</Text>
                      <Text style={styles.planSub}>{item.subtitle}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
            <Text style={styles.paywallFinePrint}>Includes sentence rewrites, daily speaking reps, scenario practice, and progress tracking.</Text>
          </>
        )}

        <Pressable
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          disabled={!canContinue}
          onPress={() => step === onboardingSlides.length - 1 ? finish() : setStep((prev) => prev + 1)}
        >
          <Text style={styles.ctaText}>{step === onboardingSlides.length - 1 ? 'Continue to account' : 'Continue'}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 4, marginBottom: 14 },
  backText: { color: theme.colors.accent, fontSize: 15, fontWeight: '600' },
  eyebrow: { color: theme.colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  progress: { color: theme.colors.accent2, fontSize: 13, fontWeight: '700', marginTop: 14 },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  sub: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginTop: 10, marginBottom: 20 },
  cardTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: 10 },
  body: { color: theme.colors.muted, fontSize: 16, lineHeight: 24 },
  bullet: { color: theme.colors.text, fontSize: 15, marginTop: 10 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border },
  tagActive: { backgroundColor: '#123342', borderColor: theme.colors.accent2 },
  tagText: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  tagTextActive: { color: '#D9EEFF' },
  choice: { backgroundColor: theme.colors.surface2, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border },
  choiceActive: { borderColor: theme.colors.accent, backgroundColor: '#13313A' },
  choiceText: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  choiceTextActive: { color: '#D8FFFB' },
  paywallTitle: { color: theme.colors.text, fontSize: 24, fontWeight: '800', marginBottom: 10 },
  planCard: { backgroundColor: theme.colors.surface2, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  planCardActive: { borderColor: theme.colors.accent, backgroundColor: '#122B33' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
  badge: { color: '#081018', backgroundColor: theme.colors.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '800' },
  planPrice: { color: theme.colors.text, fontSize: 24, fontWeight: '800', marginTop: 10 },
  planSub: { color: theme.colors.muted, fontSize: 14, marginTop: 6 },
  paywallFinePrint: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4, marginBottom: 14 },
  cta: { backgroundColor: theme.colors.accent, borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#081018', fontSize: 16, fontWeight: '800' },
});
