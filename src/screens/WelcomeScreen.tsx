import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { Screen } from '../../components/Screen';
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

const goalDescriptions: Record<string, string> = {
  'Start conversations more easily': 'Less pressure at the first sentence, especially in everyday moments.',
  'Ask questions without freezing': 'Cleaner follow-up questions when your mind blanks or tightens up.',
  'Handle school or work speaking': 'Practice for the places where being stuck feels visible and high-stakes.',
  'Feel calmer talking to strangers': 'Build comfort in unpredictable conversations without forcing perfection.',
};

const confidenceDescriptions: Record<number, string> = {
  1: 'We start extremely gently and focus on easier first words.',
  2: 'We keep reps short, practical, and low-pressure.',
  3: 'We can push a bit more without making the app feel punishing.',
  4: 'We focus on polish, consistency, and tougher scenarios.',
};

export function WelcomeScreen({ onBack, appState, actions }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(appState.user?.primaryGoal || speakingGoals[0]);
  const [selected, setSelected] = useState<string[]>(appState.user?.speakingSituations || []);
  const [confidence, setConfidence] = useState(appState.user?.confidenceLevel || 2);
  const [plan, setPlan] = useState<SubscriptionPlan>(appState.selectedPlan || 'yearly');

  const slide = onboardingSlides[step];
  const progress = ((step + 1) / onboardingSlides.length) * 100;
  const confidenceLabel = confidenceLevels.find((item) => item.value === confidence)?.label ?? confidenceLevels[1].label;
  const selectedPlan = paywallPlans.find((item) => item.id === plan) ?? paywallPlans[0];

  const canContinue = (() => {
    switch (slide.kind) {
      case 'situations':
        return selected.length > 0;
      case 'goal':
        return Boolean(goal);
      case 'confidence':
        return Boolean(confidence);
      case 'paywall':
        return Boolean(plan);
      default:
        return true;
    }
  })();

  const summaryChips = useMemo(() => {
    return [
      selected[0] || 'Everyday speaking',
      goal,
      confidenceLabel,
    ];
  }, [confidenceLabel, goal, selected]);

  const toggleSituation = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setStep((prev) => prev - 1);
  };

  const finish = () => {
    actions.finishOnboarding({
      primaryGoal: goal,
      speakingSituations: selected,
      confidenceLevel: confidence,
    }, plan);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>{step === 0 ? 'Exit' : 'Back'}</Text>
          </Pressable>
          <Text style={styles.progressLabel}>Step {step + 1} of {onboardingSlides.length}</Text>
        </View>

        <Text style={styles.eyebrow}>STEADY</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.sub}>{slide.body}</Text>
          <View style={styles.summaryRow}>
            {summaryChips.map((item) => (
              <View key={item} style={styles.summaryChip}>
                <Text style={styles.summaryChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {slide.kind === 'story' && (
          <>
            <Card>
              <Text style={styles.cardTitle}>What Steady is actually for</Text>
              <Text style={styles.body}>
                Starting sentences. Asking questions. Talking to strangers. Class. Work. Dating. The moments that matter when your body locks up before the words come out.
              </Text>
            </Card>
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>1</Text>
                <Text style={styles.metricLabel}>small daily rep</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>3</Text>
                <Text style={styles.metricLabel}>hard moments tracked</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>0</Text>
                <Text style={styles.metricLabel}>public pressure</Text>
              </View>
            </View>
          </>
        )}

        {slide.kind === 'situations' && (
          <>
            <Card>
              <View style={styles.sectionHeader}>
                <Text style={styles.cardTitle}>Pick your hardest moments</Text>
                <Text style={styles.selectionCount}>{selected.length}/3</Text>
              </View>
              <Text style={styles.body}>Choose up to three. Fewer is better if you want the plan to feel focused.</Text>
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

            {selected.length > 0 && (
              <Card>
                <Text style={styles.cardTitle}>What we heard</Text>
                <Text style={styles.body}>You want reps for {selected.join(', ')} without turning practice into another stressful performance.</Text>
              </Card>
            )}
          </>
        )}

        {slide.kind === 'goal' && (
          <Card>
            <Text style={styles.cardTitle}>Choose the change you care about most</Text>
            {speakingGoals.map((item) => {
              const active = goal === item;
              return (
                <Pressable key={item} style={[styles.choice, active && styles.choiceActive]} onPress={() => setGoal(item)}>
                  <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{item}</Text>
                  <Text style={[styles.choiceSubtext, active && styles.choiceSubtextActive]}>{goalDescriptions[item]}</Text>
                </Pressable>
              );
            })}
          </Card>
        )}

        {slide.kind === 'confidence' && (
          <>
            <Card>
              <Text style={styles.cardTitle}>How heavy does speaking feel right now?</Text>
              <View style={styles.scaleRail}>
                {confidenceLevels.map((item) => {
                  const active = confidence === item.value;
                  return <View key={item.value} style={[styles.scaleDot, active && styles.scaleDotActive]} />;
                })}
              </View>
              {confidenceLevels.map((item) => {
                const active = confidence === item.value;
                return (
                  <Pressable key={item.value} style={[styles.choice, active && styles.choiceActive]} onPress={() => setConfidence(item.value)}>
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{item.label}</Text>
                    <Text style={[styles.choiceSubtext, active && styles.choiceSubtextActive]}>{confidenceDescriptions[item.value]}</Text>
                  </Pressable>
                );
              })}
            </Card>
          </>
        )}

        {slide.kind === 'plan' && (
          <>
            <Card>
              <Text style={styles.cardTitle}>Your first week inside Steady</Text>
              <View style={styles.checklist}>
                <View style={styles.checkRow}>
                  <View style={styles.checkBullet} />
                  <Text style={styles.checkText}>Sentence rewrites for easier starts when your mind knows what to say but your body hesitates.</Text>
                </View>
                <View style={styles.checkRow}>
                  <View style={styles.checkBullet} />
                  <Text style={styles.checkText}>Scenario reps for {selected[0] || 'real-life speaking'} so practice matches the moments you avoid.</Text>
                </View>
                <View style={styles.checkRow}>
                  <View style={styles.checkBullet} />
                  <Text style={styles.checkText}>Daily confidence reps matched to a starting point that feels {confidenceLabel.toLowerCase()}.</Text>
                </View>
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Why this plan fits</Text>
              <Text style={styles.body}>
                You said the real win is <Text style={styles.bodyStrong}>{goal.toLowerCase()}</Text>. So we start with smaller wins first, then build toward more exposed speaking moments.
              </Text>
            </Card>
          </>
        )}

        {slide.kind === 'paywall' && (
          <>
            <Card>
              <Text style={styles.paywallTitle}>Unlock your private speaking coach</Text>
              <Text style={styles.body}>
                This should feel like a serious commitment to calmer speaking, not another app you forget by Tuesday.
              </Text>

              <View style={styles.reviewBox}>
                <Text style={styles.reviewTitle}>Your plan in one glance</Text>
                <Text style={styles.reviewText}>Hardest moments: {selected.join(', ') || 'Everyday speaking'}</Text>
                <Text style={styles.reviewText}>Primary goal: {goal}</Text>
                <Text style={styles.reviewText}>Current starting point: {confidenceLabel}</Text>
              </View>

              <View style={styles.planList}>
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

            <Text style={styles.paywallFinePrint}>
              Includes sentence rewrites, daily speaking reps, scenario practice, and progress tracking. Selected plan: {selectedPlan.title}.
            </Text>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerNote}>Private by default. No public posting. No pressure to sound perfect.</Text>
          <View style={styles.footerButtons}>
            <Pressable style={styles.secondaryButton} onPress={handleBack}>
              <Text style={styles.secondaryButtonText}>{step === 0 ? 'Leave' : 'Previous'}</Text>
            </Pressable>
            <Pressable
              style={[styles.cta, !canContinue && styles.ctaDisabled]}
              disabled={!canContinue}
              onPress={() => step === onboardingSlides.length - 1 ? finish() : setStep((prev) => prev + 1)}
            >
              <Text style={styles.ctaText}>{step === onboardingSlides.length - 1 ? 'Continue to account' : 'Continue'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  backButton: { paddingVertical: 8 },
  backText: { color: theme.colors.accent, fontSize: 15, fontWeight: '700' },
  progressLabel: { color: theme.colors.accent2, fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  eyebrow: { color: theme.colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 12 },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: theme.colors.surface2, overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: theme.colors.accent },
  hero: { marginTop: 18, marginBottom: 18, padding: 22, borderRadius: 24, backgroundColor: '#0F1830', borderWidth: 1, borderColor: '#1D3354' },
  title: { color: theme.colors.text, fontSize: 31, fontWeight: '800', lineHeight: 38 },
  sub: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginTop: 12 },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  summaryChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#16233D', borderWidth: 1, borderColor: '#27436B' },
  summaryChipText: { color: '#D9EEFF', fontSize: 12, fontWeight: '700' },
  cardTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '700', marginBottom: 10 },
  body: { color: theme.colors.muted, fontSize: 16, lineHeight: 24 },
  bodyStrong: { color: theme.colors.text, fontWeight: '700' },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metricCard: { flex: 1, borderRadius: 18, padding: 16, backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border },
  metricValue: { color: theme.colors.accent, fontSize: 26, fontWeight: '800' },
  metricLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: '700', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  selectionCount: { color: theme.colors.accent2, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  tag: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 999, backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border },
  tagActive: { backgroundColor: '#123342', borderColor: theme.colors.accent2 },
  tagText: { color: theme.colors.text, fontSize: 14, fontWeight: '700' },
  tagTextActive: { color: '#D9EEFF' },
  choice: { backgroundColor: theme.colors.surface2, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  choiceActive: { borderColor: theme.colors.accent, backgroundColor: '#13313A' },
  choiceText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  choiceTextActive: { color: '#D8FFFB' },
  choiceSubtext: { color: theme.colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  choiceSubtextActive: { color: '#A7F3D0' },
  scaleRail: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, paddingHorizontal: 6 },
  scaleDot: { width: 16, height: 16, borderRadius: 999, backgroundColor: theme.colors.surface2, borderWidth: 2, borderColor: theme.colors.border },
  scaleDotActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  checklist: { gap: 14, marginTop: 4 },
  checkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  checkBullet: { width: 10, height: 10, borderRadius: 999, backgroundColor: theme.colors.success, marginTop: 7 },
  checkText: { flex: 1, color: theme.colors.text, fontSize: 15, lineHeight: 22 },
  paywallTitle: { color: theme.colors.text, fontSize: 24, fontWeight: '800', marginBottom: 10 },
  reviewBox: { marginTop: 18, padding: 16, borderRadius: 18, backgroundColor: '#101A2F', borderWidth: 1, borderColor: theme.colors.border },
  reviewTitle: { color: theme.colors.accent2, fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  reviewText: { color: theme.colors.text, fontSize: 14, lineHeight: 21, marginBottom: 4 },
  planList: { marginTop: 16 },
  planCard: { backgroundColor: theme.colors.surface2, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  planCardActive: { borderColor: theme.colors.accent, backgroundColor: '#122B33' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
  badge: { color: '#081018', backgroundColor: theme.colors.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontSize: 11, fontWeight: '800' },
  planPrice: { color: theme.colors.text, fontSize: 24, fontWeight: '800', marginTop: 10 },
  planSub: { color: theme.colors.muted, fontSize: 14, marginTop: 6 },
  paywallFinePrint: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 2, marginBottom: 18 },
  footer: { marginTop: 4 },
  footerNote: { color: theme.colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  footerButtons: { flexDirection: 'row', gap: 12 },
  secondaryButton: { flex: 1, borderRadius: 18, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 },
  secondaryButtonText: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
  cta: { flex: 1.4, backgroundColor: theme.colors.accent, borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#081018', fontSize: 16, fontWeight: '800' },
});
