export type Scenario = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  summary: string;
  starter: string;
};

export const scenarioCategories = [
  { id: 'daily', title: 'Daily life', description: 'Low-stakes reps for everyday interactions.' },
  { id: 'school', title: 'School / work', description: 'Questions, introductions, and speaking up.' },
  { id: 'social', title: 'Social / dating', description: 'Starting conversations and staying in them.' },
  { id: 'phone', title: 'Phone calls', description: 'Pressure-heavy moments where blocking hits hard.' },
];

export const scenarios: Scenario[] = [
  {
    id: 'daily-order-food',
    title: 'Ordering food',
    category: 'daily',
    difficulty: 'Easy',
    summary: 'Practice getting through the first sentence with less dread at the counter.',
    starter: 'Hey, can I get the chicken bowl with no onions?'
  },
  {
    id: 'daily-ask-question',
    title: 'Ask a stranger a quick question',
    category: 'daily',
    difficulty: 'Medium',
    summary: 'Train the moment where you want to ask but freeze before the first word.',
    starter: 'Hey, do you know what time they close today?'
  },
  {
    id: 'school-class-comment',
    title: 'Speak up in class',
    category: 'school',
    difficulty: 'Hard',
    summary: 'Practice raising a point or asking a question without spiraling first.',
    starter: 'I had a question about the last part you explained.'
  },
  {
    id: 'work-intro',
    title: 'Introduce yourself at work',
    category: 'school',
    difficulty: 'Medium',
    summary: 'Get smoother at short intros in professional settings.',
    starter: 'Hey, I’m Zavion. I’m working on the product side.'
  },
  {
    id: 'social-meet-someone',
    title: 'Start a conversation with someone new',
    category: 'social',
    difficulty: 'Hard',
    summary: 'Lower the pressure of that first approach and get words moving faster.',
    starter: 'Hey, I wanted to come say hi.'
  },
  {
    id: 'phone-call-basic',
    title: 'Make a simple phone call',
    category: 'phone',
    difficulty: 'Hard',
    summary: 'Practice opening a call without mentally crashing before hello.',
    starter: 'Hey, I’m calling to ask about your hours today.'
  },
];
