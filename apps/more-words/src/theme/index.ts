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

export const paper: Theme = {
  name: 'paper',
  colors: {
    background: '#f5f0e8',
    surface: '#ede8dd',
    word: '#1a1a1a',
    accent: '#8b4513',
    secondary: '#666666',
    muted: '#999999',
    error: '#cc3333',
    tabBar: '#f5f0e8',
    tabBarBorder: '#ddd8cc',
    tabActive: '#8b4513',
    tabInactive: '#999999',
    heartFilled: '#8b4513',
    heartEmpty: '#cccccc',
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

export const bloom: Theme = {
  name: 'bloom',
  colors: {
    background: '#1a0a2e',
    surface: '#241440',
    word: '#e8d5f5',
    accent: '#c084fc',
    secondary: '#9d7bb0',
    muted: '#6b4f80',
    error: '#ff5577',
    tabBar: '#1a0a2e',
    tabBarBorder: '#2a1a40',
    tabActive: '#c084fc',
    tabInactive: '#6b4f80',
    heartFilled: '#c084fc',
    heartEmpty: '#6b4f80',
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

export const themes: Record<string, Theme> = {midnight, paper, bloom};

export function getTheme(name: string): Theme {
  return themes[name] ?? midnight;
}

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
