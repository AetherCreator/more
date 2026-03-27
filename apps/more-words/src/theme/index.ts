export interface Theme {
  name: string;
  colors: {
    background: string;
    surface: string;
    word: string;
    accent: string;
    secondary: string;
    muted: string;
    error: string;
    tabBar: string;
    tabBarBorder: string;
    tabActive: string;
    tabInactive: string;
    heartFilled: string;
    heartEmpty: string;
  };
  typography: {
    wordSize: number;
    definitionSize: number;
    pronunciationSize: number;
    etymologySize: number;
    exampleSize: number;
    usageSize: number;
    wordFamily: string;
    bodyFamily: string;
  };
}

export const midnight: Theme = {
  name: 'midnight',
  colors: {
    background: '#0d0d0f',
    surface: '#161618',
    word: '#f5f0e8',
    accent: '#c9a84c',
    secondary: '#8a8a8a',
    muted: '#555555',
    error: '#ff4444',
    tabBar: '#0d0d0d',
    tabBarBorder: '#1a1a1a',
    tabActive: '#d4af37',
    tabInactive: '#555555',
    heartFilled: '#c9a84c',
    heartEmpty: '#555555',
  },
  typography: {
    wordSize: 42,
    definitionSize: 18,
    pronunciationSize: 14,
    etymologySize: 14,
    exampleSize: 15,
    usageSize: 13,
    wordFamily: 'Georgia',
    bodyFamily: 'System',
  },
};

// Kid theme overrides — always bright regardless of adult theme
export const kidColors = {
  backgrounds: [
    '#1a3a5c', // deep blue
    '#2d4a3e', // forest green
    '#4a2d5c', // deep purple
    '#5c3a2d', // warm brown
    '#2d4a5c', // teal
    '#5c2d4a', // plum
  ],
  word: '#ffffff',
  accent: '#ffcc00',
  secondary: '#dddddd',
};

export function getKidBackground(category: string | null): string {
  if (!category) return kidColors.backgrounds[0];
  const idx =
    category.split('').reduce((a, c) => a + c.charCodeAt(0), 0) %
    kidColors.backgrounds.length;
  return kidColors.backgrounds[idx];
}

// Default theme for the app
export const defaultTheme = midnight;
