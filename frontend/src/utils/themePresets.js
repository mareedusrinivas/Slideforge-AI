export const THEME_PRESETS = {
  obsidianViolet: {
    id: 'obsidianViolet',
    name: 'Obsidian Violet',
    primary: '#a855f7',
    secondary: '#c084fc',
    accent: '#f43f5e',
    background: '#090714',
    slideBackground: '#0d0a1b',
    text: '#f8fafc',
    mutedText: '#a1a1aa',
    cardBackground: '#17122e',
    fontHeading: 'Outfit',
    fontBody: 'Inter'
  },
  midnightDark: {
    id: 'midnightDark',
    name: 'Midnight Dark',
    primary: '#818cf8',
    secondary: '#38bdf8',
    accent: '#ec4899',
    background: '#0b0914',
    slideBackground: '#120d24',
    text: '#f8fafc',
    mutedText: '#94a3b8',
    cardBackground: '#1a1333',
    fontHeading: 'Outfit',
    fontBody: 'Inter'
  },
  modernIndigo: {
    id: 'modernIndigo',
    name: 'Modern Violet-Indigo',
    primary: '#9333ea',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    background: '#0a0817',
    slideBackground: '#130e26',
    text: '#f8fafc',
    mutedText: '#9ca3af',
    cardBackground: '#1c1538',
    fontHeading: 'Inter',
    fontBody: 'Inter'
  },
  cleanMinimalist: {
    id: 'cleanMinimalist',
    name: 'Clean Minimalist',
    primary: '#c084fc',
    secondary: '#71717a',
    accent: '#a855f7',
    background: '#090712',
    slideBackground: '#0e0b1c',
    text: '#f8fafc',
    mutedText: '#a1a1aa',
    cardBackground: '#16112c',
    fontHeading: 'Inter',
    fontBody: 'Inter'
  },
  warmEditorial: {
    id: 'warmEditorial',
    name: 'Warm Editorial',
    primary: '#d97706',
    secondary: '#c084fc',
    accent: '#a855f7',
    background: '#0a0814',
    slideBackground: '#140f28',
    text: '#fefce8',
    mutedText: '#a8a29e',
    cardBackground: '#1f163d',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter'
  },
  emeraldTech: {
    id: 'emeraldTech',
    name: 'Emerald Tech',
    primary: '#10b981',
    secondary: '#a855f7',
    accent: '#f59e0b',
    background: '#06110e',
    slideBackground: '#0c1a16',
    text: '#f0fdf4',
    mutedText: '#6ee7b7',
    cardBackground: '#132822',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter'
  }
};

export const SLIDE_LAYOUT_OPTIONS = [
  { id: 'title', label: 'Title Slide', icon: 'Heading1', description: 'Impactful title, subtitle and violet accent bar' },
  { id: 'title-content', label: 'Title & Content', icon: 'LayoutList', description: 'Header with bulleted content cards' },
  { id: 'two-column', label: 'Two Columns', icon: 'Columns2', description: 'Side-by-side comparison or cards' },
  { id: 'image-text', label: 'Image with Text', icon: 'Image', description: 'Visual showcase paired with narrative' },
  { id: 'full-image', label: 'Full Image', icon: 'Maximize2', description: 'Edge-to-edge photography overlay' },
  { id: 'section-divider', label: 'Section Divider', icon: 'Bookmark', description: 'Chapter break with vertical bar' },
  { id: 'blank', label: 'Blank Slide', icon: 'Square', description: 'Completely blank canvas' }
];

export const FONT_OPTIONS = [
  { name: 'Inter', label: 'Inter (Modern Sans)' },
  { name: 'Outfit', label: 'Outfit (Geometric Clean)' },
  { name: 'Playfair Display', label: 'Playfair Display (Editorial Serif)' },
  { name: 'Poppins', label: 'Poppins (Friendly Sans)' },
  { name: 'Space Grotesk', label: 'Space Grotesk (Tech Monospace)' },
  { name: 'Roboto', label: 'Roboto (Neutral)' }
];
