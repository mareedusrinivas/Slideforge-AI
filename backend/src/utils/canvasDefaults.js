const { v4: uuidv4 } = require('uuid');

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

const THEME_PRESETS = {
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
  modernIndigo: {
    id: 'modernIndigo',
    name: 'Modern Indigo',
    primary: '#4f46e5',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    background: '#ffffff',
    slideBackground: '#ffffff',
    text: '#111827',
    mutedText: '#6b7280',
    cardBackground: '#f8fafc',
    fontHeading: 'Inter',
    fontBody: 'Inter'
  },
  midnightDark: {
    id: 'midnightDark',
    name: 'Midnight Dark',
    primary: '#6366f1',
    secondary: '#38bdf8',
    accent: '#ec4899',
    background: '#0f172a',
    slideBackground: '#1e293b',
    text: '#f8fafc',
    mutedText: '#94a3b8',
    cardBackground: '#334155',
    fontHeading: 'Outfit',
    fontBody: 'Inter'
  },
  cleanMinimalist: {
    id: 'cleanMinimalist',
    name: 'Clean Minimalist',
    primary: '#18181b',
    secondary: '#71717a',
    accent: '#2563eb',
    background: '#fafafa',
    slideBackground: '#ffffff',
    text: '#09090b',
    mutedText: '#71717a',
    cardBackground: '#f4f4f5',
    fontHeading: 'Inter',
    fontBody: 'Inter'
  },
  warmEditorial: {
    id: 'warmEditorial',
    name: 'Warm Editorial',
    primary: '#7c2d12',
    secondary: '#b45309',
    accent: '#0284c7',
    background: '#fffbeb',
    slideBackground: '#fefce8',
    text: '#292524',
    mutedText: '#78716c',
    cardBackground: '#fef3c7',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter'
  },
  emeraldTech: {
    id: 'emeraldTech',
    name: 'Emerald Tech',
    primary: '#059669',
    secondary: '#0d9488',
    accent: '#f59e0b',
    background: '#f0fdf4',
    slideBackground: '#ffffff',
    text: '#064e3b',
    mutedText: '#047857',
    cardBackground: '#ecfdf5',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter'
  }
};

const createSlideFromLayout = (layout = 'title-content', theme = THEME_PRESETS.obsidianViolet, customTitle = '') => {
  const slideId = uuidv4();
  const elements = [];

  const defaultTextColor = theme.text || '#111827';
  const defaultPrimary = theme.primary || '#4f46e5';
  const defaultMuted = theme.mutedText || '#6b7280';
  const defaultFont = theme.fontHeading || 'Inter';

  switch (layout) {
    case 'title':
      elements.push(
        {
          id: uuidv4(),
          type: 'heading',
          x: 200,
          y: 340,
          width: 1520,
          height: 180,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: customTitle || 'Your Presentation Title',
          style: {
            fontFamily: defaultFont,
            fontSize: 72,
            fontWeight: 800,
            textAlign: 'center',
            color: defaultPrimary,
            lineHeight: 1.1,
            letterSpacing: -1
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 300,
          y: 540,
          width: 1320,
          height: 80,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: 'A powerful, compelling subtitle that engages your audience',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 28,
            fontWeight: 400,
            textAlign: 'center',
            color: defaultMuted,
            lineHeight: 1.4
          }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 860,
          y: 650,
          width: 200,
          height: 6,
          rotation: 0,
          opacity: 0.9,
          zIndex: 1,
          content: 'rectangle',
          style: {
            backgroundColor: defaultPrimary,
            borderRadius: 3
          }
        }
      );
      break;

    case 'two-column':
      elements.push(
        {
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 100,
          width: 1680,
          height: 90,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: customTitle || 'Comparing Key Strategic Initiatives',
          style: {
            fontFamily: defaultFont,
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'left',
            color: defaultTextColor
          }
        },
        // Column 1 card
        {
          id: uuidv4(),
          type: 'shape',
          x: 120,
          y: 220,
          width: 800,
          height: 720,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: 'rectangle',
          style: {
            backgroundColor: theme.cardBackground || '#f8fafc',
            borderColor: '#e2e8f0',
            borderWidth: 2,
            borderRadius: 16
          }
        },
        {
          id: uuidv4(),
          type: 'heading',
          x: 160,
          y: 260,
          width: 720,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: 'Option A: Foundation & Scale',
          style: {
            fontFamily: defaultFont,
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'left',
            color: defaultPrimary
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 160,
          y: 340,
          width: 720,
          height: 540,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: '• Accelerate product development with modular architecture\n• Streamline cloud infrastructure costs by 35%\n• Foster high developer velocity with automated CI/CD\n• Ensure 99.99% availability across all regions',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 24,
            fontWeight: 400,
            textAlign: 'left',
            color: defaultTextColor,
            lineHeight: 1.8
          }
        },
        // Column 2 card
        {
          id: uuidv4(),
          type: 'shape',
          x: 1000,
          y: 220,
          width: 800,
          height: 720,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: 'rectangle',
          style: {
            backgroundColor: theme.cardBackground || '#f8fafc',
            borderColor: '#e2e8f0',
            borderWidth: 2,
            borderRadius: 16
          }
        },
        {
          id: uuidv4(),
          type: 'heading',
          x: 1040,
          y: 260,
          width: 720,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: 'Option B: Innovation & Growth',
          style: {
            fontFamily: defaultFont,
            fontSize: 32,
            fontWeight: 700,
            textAlign: 'left',
            color: theme.secondary || '#06b6d4'
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 1040,
          y: 340,
          width: 720,
          height: 540,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: '• Integrate generative AI workflows across user touchpoints\n• Unlock new revenue models through data-driven insights\n• Deliver real-time collaboration experiences\n• Expand reach into enterprise and international markets',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 24,
            fontWeight: 400,
            textAlign: 'left',
            color: defaultTextColor,
            lineHeight: 1.8
          }
        }
      );
      break;

    case 'image-text':
      elements.push(
        {
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 100,
          width: 1680,
          height: 90,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: customTitle || 'Visualizing Modern Architecture',
          style: {
            fontFamily: defaultFont,
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'left',
            color: defaultTextColor
          }
        },
        {
          id: uuidv4(),
          type: 'image',
          x: 120,
          y: 220,
          width: 820,
          height: 720,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          style: {
            borderRadius: 16,
            objectFit: 'cover'
          }
        },
        {
          id: uuidv4(),
          type: 'heading',
          x: 1000,
          y: 240,
          width: 800,
          height: 70,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: 'Engineered for Performance & Scale',
          style: {
            fontFamily: defaultFont,
            fontSize: 34,
            fontWeight: 700,
            textAlign: 'left',
            color: defaultPrimary
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 1000,
          y: 330,
          width: 800,
          height: 580,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: 'State-of-the-art systems demand intelligent architectural cohesion. By decoupling data streams and caching frequently referenced operations, SlideForge provides latency under 50ms across global edge nodes.\n\n• Resilient offline editing capabilities\n• Instant bidirectional canvas synchronization\n• GPU-accelerated canvas rendering for buttery 60 FPS transitions',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 24,
            fontWeight: 400,
            textAlign: 'left',
            color: defaultTextColor,
            lineHeight: 1.7
          }
        }
      );
      break;

    case 'full-image':
      elements.push(
        {
          id: uuidv4(),
          type: 'image',
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
          style: {
            objectFit: 'cover'
          }
        },
        {
          id: uuidv4(),
          type: 'shape',
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          rotation: 0,
          opacity: 0.55,
          zIndex: 2,
          content: 'rectangle',
          style: {
            backgroundColor: '#000000'
          }
        },
        {
          id: uuidv4(),
          type: 'heading',
          x: 200,
          y: 400,
          width: 1520,
          height: 140,
          rotation: 0,
          opacity: 1,
          zIndex: 3,
          content: customTitle || 'The Future of AI-Powered Design',
          style: {
            fontFamily: defaultFont,
            fontSize: 64,
            fontWeight: 800,
            textAlign: 'center',
            color: '#ffffff'
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 300,
          y: 560,
          width: 1320,
          height: 80,
          rotation: 0,
          opacity: 1,
          zIndex: 3,
          content: 'Unlocking human potential through intelligent creative tools',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 28,
            fontWeight: 400,
            textAlign: 'center',
            color: '#e2e8f0'
          }
        }
      );
      break;

    case 'section-divider':
      elements.push(
        {
          id: uuidv4(),
          type: 'shape',
          x: 120,
          y: 350,
          width: 12,
          height: 220,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: 'rectangle',
          style: {
            backgroundColor: defaultPrimary,
            borderRadius: 6
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 160,
          y: 350,
          width: 1400,
          height: 40,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: 'PART TWO',
          style: {
            fontFamily: defaultFont,
            fontSize: 20,
            fontWeight: 700,
            textAlign: 'left',
            color: defaultPrimary,
            letterSpacing: 4
          }
        },
        {
          id: uuidv4(),
          type: 'heading',
          x: 160,
          y: 400,
          width: 1600,
          height: 120,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: customTitle || 'Deep Dive: Core Capabilities',
          style: {
            fontFamily: defaultFont,
            fontSize: 56,
            fontWeight: 800,
            textAlign: 'left',
            color: defaultTextColor
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 160,
          y: 520,
          width: 1400,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: 'Exploring real-world implementation, benchmarks, and roadmap',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 26,
            fontWeight: 400,
            textAlign: 'left',
            color: defaultMuted
          }
        }
      );
      break;

    case 'blank':
      // Intentionally empty
      break;

    case 'title-content':
    default:
      elements.push(
        {
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 100,
          width: 1680,
          height: 90,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: customTitle || 'Executive Summary & Key Takeaways',
          style: {
            fontFamily: defaultFont,
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'left',
            color: defaultTextColor
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 120,
          y: 240,
          width: 1680,
          height: 680,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: '• Rapid content generation accelerates presentation delivery by 4x\n• Adaptive visual themes maintain brand consistency without manual formatting\n• Real-time AI assistant rewrites, expands, or condenses complex bullet points\n• Seamless drag-and-drop canvas offers pixel-perfect control\n• Instant export to presentation-ready PDF, PPTX, or full-screen view',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 28,
            fontWeight: 400,
            textAlign: 'left',
            color: defaultTextColor,
            lineHeight: 2.0
          }
        }
      );
      break;
  }

  return {
    id: slideId,
    layout,
    background: {
      type: 'color',
      value: theme.slideBackground || '#ffffff',
      opacity: 1
    },
    notes: '',
    elements
  };
};

module.exports = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  THEME_PRESETS,
  createSlideFromLayout
};
