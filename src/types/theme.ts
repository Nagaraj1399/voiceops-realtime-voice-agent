export type AppTheme = 'light' | 'obsidian' | 'midnight' | 'slate' | 'oled';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  tagline: string;
  bgColor: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  previewColor: string;
  ambientGradient: string;
}

export const THEME_CONFIGS: Record<AppTheme, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Clean Pure White (Default)',
    tagline: 'High-contrast, crisp white daytime enterprise workspace',
    bgColor: '#ffffff',
    cardBg: '#ffffff',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    previewColor: '#4f46e5',
    ambientGradient: 'none',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Space',
    tagline: 'Deep space dark with soft indigo glow',
    bgColor: '#08090d',
    cardBg: '#111218',
    border: '#232634',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    previewColor: '#6366f1',
    ambientGradient: 'radial-gradient(circle at 50% -10%, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 80%)',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Navy',
    tagline: 'Deep enterprise navy with cobalt glow',
    bgColor: '#0b1120',
    cardBg: '#0f172a',
    border: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    previewColor: '#38bdf8',
    ambientGradient: 'radial-gradient(circle at 50% -10%, rgba(56, 189, 248, 0.15) 0%, rgba(30, 58, 138, 0.1) 45%, transparent 80%)',
  },
  slate: {
    id: 'slate',
    name: 'Cyber Slate',
    tagline: 'Modern graphite slate with emerald teal accents',
    bgColor: '#0f172a',
    cardBg: '#1e293b',
    border: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    previewColor: '#14b8a6',
    ambientGradient: 'radial-gradient(circle at 50% -10%, rgba(20, 184, 166, 0.13) 0%, rgba(51, 65, 85, 0.12) 45%, transparent 80%)',
  },
  oled: {
    id: 'oled',
    name: 'OLED Pure Black',
    tagline: 'True #000000 black for maximum mobile battery & contrast',
    bgColor: '#000000',
    cardBg: '#0a0a0a',
    border: '#262626',
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    previewColor: '#a855f7',
    ambientGradient: 'none',
  },
};
