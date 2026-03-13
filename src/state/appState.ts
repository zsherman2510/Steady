export type UserProfile = {
  name: string;
  email: string;
  primaryGoal: string;
  speakingSituations: string[];
  confidenceLevel: number;
};

export type SubscriptionPlan = 'yearly' | 'weekly' | null;

export type AppState = {
  hasOnboarded: boolean;
  isAuthenticated: boolean;
  hasUnlockedPaywall: boolean;
  selectedPlan: SubscriptionPlan;
  user: UserProfile | null;
};

export const initialAppState: AppState = {
  hasOnboarded: false,
  isAuthenticated: false,
  hasUnlockedPaywall: false,
  selectedPlan: null,
  user: null,
};
