import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexReactClient, useConvexAuth, useMutation, useQuery } from 'convex/react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from './components/Card';
import { Screen } from './components/Screen';
import { authClient } from './lib/authClient';
import { theme } from './lib/theme';
import { api } from './convex/_generated/api';
import { ChallengeScreen } from './src/screens/ChallengeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PracticeScreen } from './src/screens/PracticeScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { RewriteScreen } from './src/screens/RewriteScreen';
import { ScenariosScreen } from './src/screens/ScenariosScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { initialAppState, type AppState, type SubscriptionPlan, type UserProfile } from './src/state/appState';

type ScreenKey = 'menu' | 'welcome' | 'auth' | 'home' | 'scenarios' | 'rewrite' | 'practice' | 'challenge' | 'progress';

type PendingOnboarding = {
  primaryGoal: string;
  speakingSituations: string[];
  confidenceLevel: number;
  selectedPlan: Exclude<SubscriptionPlan, null>;
} | null;

const screenMap = {
  welcome: WelcomeScreen,
  auth: AuthScreen,
  home: HomeScreen,
  scenarios: ScenariosScreen,
  rewrite: RewriteScreen,
  practice: PracticeScreen,
  challenge: ChallengeScreen,
  progress: ProgressScreen,
};

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convexSiteUrl = process.env.EXPO_PUBLIC_CONVEX_SITE_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function App() {
  if (!convexUrl || !convexSiteUrl || !convexClient) {
    return (
      <Screen>
        <Card>
          <Text style={styles.cardTitle}>Missing auth configuration</Text>
          <Text style={styles.sub}>
            Set `EXPO_PUBLIC_CONVEX_URL` and `EXPO_PUBLIC_CONVEX_SITE_URL` in `.env.local` before starting the app.
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <ConvexBetterAuthProvider client={convexClient} authClient={authClient}>
      <SteadyApp />
    </ConvexBetterAuthProvider>
  );
}

function SteadyApp() {
  const [screen, setScreen] = useState<ScreenKey>('menu');
  const [pendingOnboarding, setPendingOnboarding] = useState<PendingOnboarding>(null);
  const [sessionSyncState, setSessionSyncState] = useState<'idle' | 'syncing' | 'ready' | 'error'>('idle');
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.profiles.getViewerState, isAuthenticated ? {} : 'skip');
  const ensureCurrentProfile = useMutation(api.profiles.ensureCurrentProfile);
  const saveOnboarding = useMutation(api.profiles.saveOnboarding);

  useEffect(() => {
    if (!isAuthenticated) {
      setSessionSyncState('idle');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || sessionSyncState !== 'idle') {
      return;
    }

    let cancelled = false;
    setSessionSyncState('syncing');

    void (async () => {
      try {
        await ensureCurrentProfile({});

        if (pendingOnboarding) {
          await saveOnboarding(pendingOnboarding);
        }

        if (!cancelled) {
          setPendingOnboarding(null);
          setSessionSyncState('ready');
          if (screen === 'auth') {
            setScreen('home');
          }
        }
      } catch (error) {
        console.error('Failed to synchronize the authenticated profile.', error);
        if (!cancelled) {
          setSessionSyncState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ensureCurrentProfile, isAuthenticated, isLoading, pendingOnboarding, saveOnboarding, screen, sessionSyncState]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated && screen === 'home') {
      setScreen('auth');
    }

    if (isAuthenticated && screen === 'auth' && sessionSyncState === 'ready') {
      setScreen('home');
    }
  }, [isAuthenticated, isLoading, screen, sessionSyncState]);

  const appState = useMemo<AppState>(() => {
    const profile = viewer?.profile;
    const authUser = viewer?.user;
    const role = authUser?.role === 'admin' ? 'admin' : 'user';

    const hasUserContext = Boolean(
      authUser?.name ||
      authUser?.email ||
      profile?.primaryGoal ||
      pendingOnboarding
    );

    const user: UserProfile | null = hasUserContext ? {
      name: profile?.name ?? authUser?.name ?? '',
      email: profile?.email ?? authUser?.email ?? '',
      role,
      primaryGoal: profile?.primaryGoal ?? pendingOnboarding?.primaryGoal ?? 'Start conversations more easily',
      speakingSituations: profile?.speakingSituations?.length
        ? profile.speakingSituations
        : pendingOnboarding?.speakingSituations ?? [],
      confidenceLevel: profile?.confidenceLevel ?? pendingOnboarding?.confidenceLevel ?? 2,
    } : null;

    return {
      ...initialAppState,
      hasOnboarded: profile?.onboardingCompleted ?? Boolean(pendingOnboarding),
      isAuthenticated,
      hasUnlockedPaywall: Boolean(profile?.selectedPlan ?? pendingOnboarding?.selectedPlan),
      selectedPlan: profile?.selectedPlan ?? pendingOnboarding?.selectedPlan ?? null,
      user,
    };
  }, [isAuthenticated, pendingOnboarding, viewer]);

  const actions = useMemo(() => ({
    finishOnboarding(profile: Pick<UserProfile, 'primaryGoal' | 'speakingSituations' | 'confidenceLevel'>, plan: SubscriptionPlan) {
      if (!plan) {
        return;
      }
      setPendingOnboarding({
        ...profile,
        selectedPlan: plan,
      });
      setSessionSyncState('idle');
      setScreen(isAuthenticated ? 'home' : 'auth');
    },
    async signOut() {
      await authClient.signOut();
      setPendingOnboarding(null);
      setSessionSyncState('idle');
      setScreen('auth');
    },
  }), [isAuthenticated]);

  if (isLoading || (isAuthenticated && (sessionSyncState === 'syncing' || viewer === undefined))) {
    return (
      <Screen>
        <Card>
          <ActivityIndicator color={theme.colors.accent} size="large" />
          <Text style={styles.cardTitle}>Securing your session</Text>
          <Text style={styles.sub}>Steady is validating your account and loading the data you’re allowed to access.</Text>
        </Card>
      </Screen>
    );
  }

  if (screen !== 'menu') {
    const Active = screenMap[screen as keyof typeof screenMap];
    return <Active onBack={() => setScreen('menu')} appState={appState} actions={actions} />;
  }

  const links: { key: ScreenKey; label: string }[] = [
    { key: 'welcome', label: 'Welcome' },
    { key: 'auth', label: 'Auth' },
    { key: 'home', label: 'Home' },
    { key: 'scenarios', label: 'Scenarios' },
    { key: 'rewrite', label: 'Rewrite My Sentence' },
    { key: 'practice', label: 'AI Practice' },
    { key: 'challenge', label: 'Daily Challenge' },
    { key: 'progress', label: 'Progress' },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.eyebrow}>STEADY</Text>
        <Text style={styles.title}>A calm place to practice speaking.</Text>
        <Text style={styles.sub}>Authentication is live. Authorization now runs through Convex backend guards instead of local screen state.</Text>
        <Card>
          <Text style={styles.cardTitle}>Current state</Text>
          <Text style={styles.stateText}>Onboarded: {appState.hasOnboarded ? 'Yes' : 'No'}</Text>
          <Text style={styles.stateText}>Signed in: {appState.isAuthenticated ? 'Yes' : 'No'}</Text>
          <Text style={styles.stateText}>Role: {appState.user?.role ?? 'Not set yet'}</Text>
          <Text style={styles.stateText}>User: {appState.user?.name || appState.user?.email || 'Not set yet'}</Text>
        </Card>
        {sessionSyncState === 'error' && (
          <Card>
            <Text style={styles.cardTitle}>Profile sync issue</Text>
            <Text style={styles.sub}>The session is valid, but the app profile could not be synchronized. Check the Convex backend logs.</Text>
          </Card>
        )}
        <Card>
          <Text style={styles.cardTitle}>MVP Navigation</Text>
          {links.map((item) => (
            <Pressable
              key={item.key}
              style={[styles.button, item.key === 'home' && !appState.isAuthenticated && styles.buttonDisabled]}
              disabled={item.key === 'home' && !appState.isAuthenticated}
              onPress={() => setScreen(item.key)}
            >
              <Text style={styles.buttonText}>{item.label}</Text>
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: theme.colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 8 },
  title: { color: theme.colors.text, fontSize: 34, fontWeight: '800', marginTop: 12 },
  sub: { color: theme.colors.muted, fontSize: 16, lineHeight: 24, marginTop: 10, marginBottom: 24 },
  cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '700', marginBottom: 14 },
  stateText: { color: theme.colors.muted, fontSize: 15, marginBottom: 6 },
  button: { backgroundColor: theme.colors.surface2, padding: 14, borderRadius: 14, marginBottom: 10 },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
});
