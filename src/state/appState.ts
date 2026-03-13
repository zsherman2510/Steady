export type UserProfile = {
  name: string;
  email: string;
  primaryGoal: string;
  speakingSituations: string[];
};

export type AppState = {
  hasOnboarded: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
};

export const initialAppState: AppState = {
  hasOnboarded: false,
  isAuthenticated: false,
  user: null,
};
