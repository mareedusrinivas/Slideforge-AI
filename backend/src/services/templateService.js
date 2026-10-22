const { v4: uuidv4 } = require('uuid');
const { THEME_PRESETS } = require('../utils/canvasDefaults');

const STARTER_TEMPLATES = [
  {
    id: 'business-pitch-deck',
    title: 'Business Pitch Deck',
    category: 'Business',
    description: 'A venture-ready pitch deck covering problem, solution, market size, business model, and traction.',
    theme: THEME_PRESETS.modernIndigo,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'title',
        background: { type: 'color', value: '#0f172a', opacity: 1 },
        notes: 'Introduce company name, vision statement, and speaker title.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 300,
            width: 1600,
            height: 160,
            content: 'NexusAI: Enterprise Intelligence',
            style: { fontFamily: 'Outfit', fontSize: 68, fontWeight: 800, color: '#f8fafc', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 240,
            y: 480,
            width: 1440,
            height: 80,
            content: 'Transforming enterprise data into autonomous executive decisions • Series A Pitch',
            style: { fontFamily: 'Inter', fontSize: 26, fontWeight: 400, color: '#94a3b8', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'shape',
            x: 885,
            y: 590,
            width: 150,
            height: 6,
            content: 'rectangle',
            style: { backgroundColor: '#6366f1', borderRadius: 3 }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'two-column',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Highlight existing market friction vs our paradigm shift.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 90,
            width: 1680,
            height: 80,
            content: 'The Problem vs Our Solution',
            style: { fontFamily: 'Inter', fontSize: 44, fontWeight: 800, color: '#0f172a', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'shape',
            x: 120,
            y: 200,
            width: 800,
            height: 740,
            content: 'rectangle',
            style: { backgroundColor: '#fef2f2', borderColor: '#fca5a5', borderWidth: 2, borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 240,
            width: 720,
            height: 60,
            content: 'The Friction: Data Silos & Delay',
            style: { fontFamily: 'Inter', fontSize: 30, fontWeight: 700, color: '#dc2626', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 160,
            y: 320,
            width: 720,
            height: 580,
            content: '• Fortune 500 enterprises spend 6.5 hours/day aggregating fragmented reports\n• Critical executive decisions lag behind market shifts by 14 to 28 days\n• Legacy BI tools require specialized queries and produce static charts\n• Resulting in $4.2B in annual missed market opportunities',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#334155', textAlign: 'left', lineHeight: 1.8 }
          },
          {
            id: uuidv4(),
            type: 'shape',
            x: 1000,
            y: 200,
            width: 800,
            height: 740,
            content: 'rectangle',
            style: { backgroundColor: '#f0fdf4', borderColor: '#86efac', borderWidth: 2, borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 1040,
            y: 240,
            width: 720,
            height: 60,
            content: 'The Nexus Advantage: Real-time Autonomy',
            style: { fontFamily: 'Inter', fontSize: 30, fontWeight: 700, color: '#16a34a', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 1040,
            y: 320,
            width: 720,
            height: 580,
            content: '• Unified neural memory layer bridges SQL, SaaS, and unstructured logs in 1-click\n• Continuous predictive modeling delivers instant scenario simulation\n• Conversational AI agent proactively alerts executives to emerging risk\n• 10x faster time-to-insight with zero data team overhead',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#334155', textAlign: 'left', lineHeight: 1.8 }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'title-content',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Key traction metrics demonstrating rapid product-market fit.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 90,
            width: 1680,
            height: 80,
            content: 'Traction & Exponential Growth',
            style: { fontFamily: 'Inter', fontSize: 44, fontWeight: 800, color: '#0f172a', textAlign: 'left' }
          },
          // Stat Card 1
          {
            id: uuidv4(),
            type: 'shape',
            x: 120,
            y: 220,
            width: 520,
            height: 320,
            content: 'rectangle',
            style: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 150,
            y: 260,
            width: 460,
            height: 80,
            content: '$3.8M',
            style: { fontFamily: 'Inter', fontSize: 64, fontWeight: 800, color: '#4f46e5', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 150,
            y: 360,
            width: 460,
            height: 140,
            content: 'Annual Recurring Revenue\n310% YoY Growth with 142% Net Retention',
            style: { fontFamily: 'Inter', fontSize: 22, fontWeight: 500, color: '#475569', textAlign: 'center', lineHeight: 1.5 }
          },
          // Stat Card 2
          {
            id: uuidv4(),
            type: 'shape',
            x: 700,
            y: 220,
            width: 520,
            height: 320,
            content: 'rectangle',
            style: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 730,
            y: 260,
            width: 460,
            height: 80,
            content: '48+',
            style: { fontFamily: 'Inter', fontSize: 64, fontWeight: 800, color: '#06b6d4', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 730,
            y: 360,
            width: 460,
            height: 140,
            content: 'Global Enterprise Customers\nIncluding 4 Fortune 100 technology leaders',
            style: { fontFamily: 'Inter', fontSize: 22, fontWeight: 500, color: '#475569', textAlign: 'center', lineHeight: 1.5 }
          },
          // Stat Card 3
          {
            id: uuidv4(),
            type: 'shape',
            x: 1280,
            y: 220,
            width: 520,
            height: 320,
            content: 'rectangle',
            style: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 1310,
            y: 260,
            width: 460,
            height: 80,
            content: '99.4%',
            style: { fontFamily: 'Inter', fontSize: 64, fontWeight: 800, color: '#10b981', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 1310,
            y: 360,
            width: 460,
            height: 140,
            content: 'Prediction Accuracy Rate\nValidated across 12M+ production decisions',
            style: { fontFamily: 'Inter', fontSize: 22, fontWeight: 500, color: '#475569', textAlign: 'center', lineHeight: 1.5 }
          },
          // Bottom Summary Banner
          {
            id: uuidv4(),
            type: 'shape',
            x: 120,
            y: 590,
            width: 1680,
            height: 350,
            content: 'rectangle',
            style: { backgroundColor: '#f1f5f9', borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 630,
            width: 1600,
            height: 60,
            content: 'Strategic Milestones for Next 18 Months',
            style: { fontFamily: 'Inter', fontSize: 32, fontWeight: 700, color: '#1e293b', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 160,
            y: 710,
            width: 1600,
            height: 200,
            content: '• Expansion into EMEA and APAC financial institutions\n• Launch of autonomous compliance governance agent for HIPAA & SOC2\n• Expansion of partner integrations with Snowflake, Databricks, and Salesforce\n• Raising $12M Series A to accelerate enterprise sales & R&D',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#334155', textAlign: 'left', lineHeight: 1.8 }
          }
        ]
      }
    ]
  },
  {
    id: 'project-proposal',
    title: 'Project Proposal',
    category: 'Product & Engineering',
    description: 'Comprehensive project kickoff outlining scope, technical architecture, deliverables, and timeline.',
    theme: THEME_PRESETS.emeraldTech,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'title',
        background: { type: 'color', value: '#064e3b', opacity: 1 },
        notes: 'Project kickoff title slide.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 320,
            width: 1600,
            height: 140,
            content: 'Project Titan: Next-Gen Core Platform',
            style: { fontFamily: 'Space Grotesk', fontSize: 64, fontWeight: 800, color: '#ffffff', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 240,
            y: 490,
            width: 1440,
            height: 70,
            content: 'Architecture Migration & Scalability Roadmap • Q3-Q4 Execution Plan',
            style: { fontFamily: 'Inter', fontSize: 28, fontWeight: 400, color: '#a7f3d0', textAlign: 'center' }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'title-content',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Overview of deliverables and target milestones.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 100,
            width: 1680,
            height: 90,
            content: 'Project Objectives & Core Deliverables',
            style: { fontFamily: 'Space Grotesk', fontSize: 46, fontWeight: 700, color: '#064e3b', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 120,
            y: 240,
            width: 1680,
            height: 680,
            content: '1. Modular Micro-Frontend Architecture: Decouple presentation layer into isolated micro-apps for zero-downtime deployments.\n2. Sub-Second Global Response Times: Deploy edge caching with Cloudflare Workers to drop P99 latency below 120ms.\n3. Automated Quality Gateways: Achieve 90%+ integration test coverage and enforce semantic versioning across 14 services.\n4. SOC2 Type II Certification: Complete infrastructure hardening and automated audit trail logging.',
            style: { fontFamily: 'Inter', fontSize: 26, fontWeight: 400, color: '#1f2937', textAlign: 'left', lineHeight: 2.1 }
          }
        ]
      }
    ]
  },
  {
    id: 'technology-overview',
    title: 'Technology Overview',
    category: 'Engineering',
    description: 'Deep dive into modern cloud architecture, microservices, AI pipelines, and resilience.',
    theme: THEME_PRESETS.midnightDark,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'title',
        background: { type: 'color', value: '#0f172a', opacity: 1 },
        notes: 'Technology deep-dive introduction.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 320,
            width: 1600,
            height: 140,
            content: 'Distributed AI Infrastructure',
            style: { fontFamily: 'Outfit', fontSize: 64, fontWeight: 800, color: '#f8fafc', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 240,
            y: 480,
            width: 1440,
            height: 70,
            content: 'Building High-Throughput Inference Engines with Low Latency',
            style: { fontFamily: 'Inter', fontSize: 28, fontWeight: 400, color: '#38bdf8', textAlign: 'center' }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'image-text',
        background: { type: 'color', value: '#1e293b', opacity: 1 },
        notes: 'System architecture diagram and technical specifications.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 90,
            width: 1680,
            height: 80,
            content: 'Multi-Tenant Inference Pipeline',
            style: { fontFamily: 'Outfit', fontSize: 44, fontWeight: 700, color: '#f8fafc', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'image',
            x: 120,
            y: 210,
            width: 820,
            height: 740,
            content: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
            style: { borderRadius: 16, objectFit: 'cover' }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 1000,
            y: 230,
            width: 800,
            height: 60,
            content: 'High-Concurrency Event Loop',
            style: { fontFamily: 'Outfit', fontSize: 32, fontWeight: 700, color: '#38bdf8', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 1000,
            y: 310,
            width: 800,
            height: 620,
            content: '• Asynchronous job worker pools handle bursty GPU request queues\n• Vector embeddings cached at memory tier with Redis clusters\n• Token streaming delivered over WebSockets with progressive hydration\n• Dynamic fallback routing between Claude, GPT, and fine-tuned open-source LLMs\n• Sub-50ms TTFT (Time To First Token) for interactive editing operations',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#cbd5e1', textAlign: 'left', lineHeight: 1.9 }
          }
        ]
      }
    ]
  },
  {
    id: 'educational-presentation',
    title: 'Educational Presentation',
    category: 'Education',
    description: 'Structured classroom lecture template with concept breakdown, case studies, and summary.',
    theme: THEME_PRESETS.cleanMinimalist,
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'title',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Lecture title slide.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 320,
            width: 1600,
            height: 140,
            content: 'Introduction to Modern Human-AI Interaction',
            style: { fontFamily: 'Inter', fontSize: 60, fontWeight: 800, color: '#09090b', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 240,
            y: 490,
            width: 1440,
            height: 70,
            content: 'Design Patterns, Cognitive Ergonomics & Future Paradigms',
            style: { fontFamily: 'Inter', fontSize: 28, fontWeight: 400, color: '#71717a', textAlign: 'center' }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'two-column',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Comparing direct manipulation vs conversational interfaces.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 90,
            width: 1680,
            height: 80,
            content: 'Direct Manipulation vs Conversational Agents',
            style: { fontFamily: 'Inter', fontSize: 44, fontWeight: 800, color: '#09090b', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'shape',
            x: 120,
            y: 200,
            width: 800,
            height: 740,
            content: 'rectangle',
            style: { backgroundColor: '#f4f4f5', borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 240,
            width: 720,
            height: 60,
            content: 'Direct Manipulation',
            style: { fontFamily: 'Inter', fontSize: 30, fontWeight: 700, color: '#18181b', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 160,
            y: 320,
            width: 720,
            height: 580,
            content: '• Visual representation of task objects\n• Physical actions (drag, resize, drop) replace commands\n• Immediate feedback with reversible operations\n• High user locus of control and spatial memory retention',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#27272a', textAlign: 'left', lineHeight: 1.8 }
          },
          {
            id: uuidv4(),
            type: 'shape',
            x: 1000,
            y: 200,
            width: 800,
            height: 740,
            content: 'rectangle',
            style: { backgroundColor: '#eff6ff', borderRadius: 16 }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 1040,
            y: 240,
            width: 720,
            height: 60,
            content: 'Generative AI Co-Pilot',
            style: { fontFamily: 'Inter', fontSize: 30, fontWeight: 700, color: '#2563eb', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 1040,
            y: 320,
            width: 720,
            height: 580,
            content: '• Intent-based semantic instructions in plain language\n• Synthesis of multifaceted operations in a single step\n• Context-aware generation of content, structure, and styles\n• SlideForge combines both paradigms for maximum creative speed',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#1e3a8a', textAlign: 'left', lineHeight: 1.8 }
          }
        ]
      }
    ]
  },
  {
    id: 'portfolio',
    title: 'Creative Portfolio',
    category: 'Design & Creative',
    description: 'Visual showcase for designers, agencies, and artists with large imagery and elegant typography.',
    theme: THEME_PRESETS.warmEditorial,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'title',
        background: { type: 'color', value: '#fefce8', opacity: 1 },
        notes: 'Portfolio title slide.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 320,
            width: 1600,
            height: 140,
            content: 'Studio Aurum • Selected Works',
            style: { fontFamily: 'Playfair Display', fontSize: 68, fontWeight: 800, color: '#7c2d12', textAlign: 'center' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 240,
            y: 480,
            width: 1440,
            height: 70,
            content: 'Digital Product Design, Brand Strategy & Creative Direction • 2024-2026',
            style: { fontFamily: 'Inter', fontSize: 26, fontWeight: 400, color: '#78716c', textAlign: 'center' }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'image-text',
        background: { type: 'color', value: '#fffbeb', opacity: 1 },
        notes: 'Featured design case study.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 90,
            width: 1680,
            height: 80,
            content: 'Case Study: Lumina Smart Audio',
            style: { fontFamily: 'Playfair Display', fontSize: 44, fontWeight: 800, color: '#7c2d12', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'image',
            x: 120,
            y: 200,
            width: 840,
            height: 740,
            content: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
            style: { borderRadius: 16, objectFit: 'cover' }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 1020,
            y: 220,
            width: 780,
            height: 60,
            content: 'Acoustic Precision Meets Tactile Luxury',
            style: { fontFamily: 'Playfair Display', fontSize: 34, fontWeight: 700, color: '#b45309', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 1020,
            y: 310,
            width: 780,
            height: 600,
            content: 'We reimagined consumer audio hardware interfaces with an obsession for tactile minimalism. By removing screens in favor of calibrated haptic dials and warm ambient LED indicators, Lumina creates calm, focused listening.\n\n• Red Dot Design Award 2024 Winner\n• Featured in Wallpaper* and Fast Company\n• 45,000 units sold out within 72 hours of launch',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#44403c', textAlign: 'left', lineHeight: 1.8 }
          }
        ]
      }
    ]
  },
  {
    id: 'personal-intro',
    title: 'Personal Introduction',
    category: 'Personal',
    description: 'Clean personal intro for interviews, conferences, onboarding, and networking.',
    theme: THEME_PRESETS.modernIndigo,
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'image-text',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Speaker background and introduction.',
        elements: [
          {
            id: uuidv4(),
            type: 'image',
            x: 120,
            y: 160,
            width: 600,
            height: 760,
            content: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
            style: { borderRadius: 20, objectFit: 'cover' }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 780,
            y: 200,
            width: 1020,
            height: 90,
            content: 'Hello, I’m Alex Rivera',
            style: { fontFamily: 'Inter', fontSize: 52, fontWeight: 800, color: '#111827', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'heading',
            x: 780,
            y: 300,
            width: 1020,
            height: 50,
            content: 'Product Architect & Creative Technologist',
            style: { fontFamily: 'Inter', fontSize: 28, fontWeight: 600, color: '#4f46e5', textAlign: 'left' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 780,
            y: 380,
            width: 1020,
            height: 520,
            content: 'Over the past decade, I’ve led product engineering teams at high-growth startups and venture studios. My passion lies at the intersection of developer productivity, generative artificial intelligence, and delightful human-computer interfaces.\n\n• Built & scaled platforms to 2M+ active creators\n• Open source contributor & technical speaker\n• Advocate for accessible, resilient software architecture',
            style: { fontFamily: 'Inter', fontSize: 24, fontWeight: 400, color: '#374151', textAlign: 'left', lineHeight: 1.8 }
          }
        ]
      }
    ]
  },
  {
    id: 'minimalist-presentation',
    title: 'Minimalist Presentation',
    category: 'Minimalist',
    description: 'High-impact minimalist deck prioritizing whitespace, stark typography, and crisp messaging.',
    theme: THEME_PRESETS.cleanMinimalist,
    thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    slides: [
      {
        id: uuidv4(),
        layout: 'title',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Opening slide with strong contrast.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 160,
            y: 340,
            width: 1600,
            height: 140,
            content: 'Simplicity at Scale',
            style: { fontFamily: 'Inter', fontSize: 72, fontWeight: 900, color: '#09090b', textAlign: 'center', letterSpacing: -2 }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 240,
            y: 500,
            width: 1440,
            height: 60,
            content: 'Less, but better. Focus on what truly moves the needle.',
            style: { fontFamily: 'Inter', fontSize: 26, fontWeight: 400, color: '#71717a', textAlign: 'center' }
          }
        ]
      },
      {
        id: uuidv4(),
        layout: 'title-content',
        background: { type: 'color', value: '#ffffff', opacity: 1 },
        notes: 'Three core principles.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 100,
            width: 1680,
            height: 80,
            content: 'Three Guiding Principles',
            style: { fontFamily: 'Inter', fontSize: 48, fontWeight: 800, color: '#09090b', textAlign: 'left', letterSpacing: -1 }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 120,
            y: 260,
            width: 1680,
            height: 640,
            content: '01. Ruthless Prioritization: Eliminate every feature that does not directly solve the user’s primary pain point.\n\n02. Transparent Architecture: Complex problems do not require convoluted abstractions. Strive for clarity over cleverness.\n\n03. Uncompromising Craft: Every pixel, animation curve, and millisecond of latency communicates respect for the user.',
            style: { fontFamily: 'Inter', fontSize: 28, fontWeight: 400, color: '#27272a', textAlign: 'left', lineHeight: 2.1 }
          }
        ]
      }
    ]
  }
];

const getTemplates = () => STARTER_TEMPLATES;

const getTemplateById = (id) => STARTER_TEMPLATES.find(t => t.id === id) || null;

const createPresentationFromTemplate = (templateId, customTitle = '') => {
  const template = getTemplateById(templateId);
  if (!template) return null;

  // Clone slides with fresh UUIDs so instances don't share IDs
  const clonedSlides = template.slides.map(slide => {
    const newSlideId = uuidv4();
    const clonedElements = slide.elements.map(el => ({
      ...el,
      id: uuidv4()
    }));

    return {
      ...slide,
      id: newSlideId,
      elements: clonedElements
    };
  });

  return {
    title: customTitle || template.title,
    description: template.description,
    theme: template.theme,
    slideOrder: clonedSlides.map(s => s.id),
    slides: clonedSlides,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    thumbnail: template.thumbnail
  };
};

module.exports = {
  STARTER_TEMPLATES,
  getTemplates,
  getTemplateById,
  createPresentationFromTemplate
};
