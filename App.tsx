import { useState } from 'react';
import { ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from './components/Screen';
import { Card } from './components/Card';
import { theme } from './lib/theme';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScenariosScreen } from './src/screens/ScenariosScreen';
import { RewriteScreen } from './src/screens/RewriteScreen';
import { PracticeScreen } from './src/screens/PracticeScreen';
import { ChallengeScreen } from './src/screens/ChallengeScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';

type ScreenKey = 'menu' | 'welcome' | 'auth' | 'home' | 'scenarios' | 'rewrite' | 'practice' | 'challenge' | 'progress';

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

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('menu');

  if (screen !== 'menu') {
    const Active = screenMap[screen as keyof typeof screenMap];
    return <Active onBack={() => setScreen('menu')} />;
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
        <Text style={styles.sub}>Built for real conversations, lower pressure, and confidence reps.</Text>
        <Card>
          <Text style={styles.cardTitle}>MVP Navigation</Text>
          {links.map((item) => (
            <Pressable key={item.key} style={styles.button} onPress={() => setScreen(item.key)}>
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
  button: { backgroundColor: theme.colors.surface2, padding: 14, borderRadius: 14, marginBottom: 10 },
  buttonText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' }
});
