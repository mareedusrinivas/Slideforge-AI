const { v4: uuidv4 } = require('uuid');
const aiConfig = require('../config/ai.config');
const { THEME_PRESETS } = require('../utils/canvasDefaults');
const logger = require('../utils/logger');

// Curated high quality relevant images for fallback
const CURATED_DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
];

class AiService {
  getStatus() {
    const isConfigured = aiConfig.isConfigured;
    return {
      provider: isConfigured ? 'gemini' : 'demo',
      model: aiConfig.model,
      isConfigured,
      mode: isConfigured ? 'live' : 'demo',
      capabilities: [
        'gemini_presentation_generation',
        'gemini_chat_copilot',
        'outline_generation',
        'slide_redesign',
        'text_rewrite_and_summarize',
        'structured_canvas_actions',
        'image_generation_or_curation'
      ]
    };
  }

  /**
   * Helper to call Google Gemini REST API using GEMINI_API_KEY from .env
   */
  async _callGemini({ prompt, model = 'gemini-2.0-flash', jsonMode = true }) {
    const apiKey = aiConfig.apiKey;
    if (!apiKey) {
      throw new Error('Google Gemini API key not found in backend/.env. Please set GEMINI_API_KEY in your backend/.env file.');
    }

    const candidateModels = [
      aiConfig.model,
      'gemini-3.8-flash',
      'gemini-flash-lite-latest',
      'gemini-2.5-flash-lite',
      'gemini-flash-latest',
      'gemini-2.5-flash'
    ].filter(Boolean);
    const uniqueModels = [...new Set(candidateModels)];

    let lastError = null;

    for (const currentModel of uniqueModels) {
      try {
        const cleanModelName = currentModel.replace(/^models\//, '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModelName}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {})
          }
        };

        logger.info(`[Gemini API] Requesting ${cleanModelName}...`);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000)
        });

        if (!res.ok) {
          const errText = await res.text();
          let parsed;
          try { parsed = JSON.parse(errText); } catch (e) {}
          const errMsg = parsed?.error?.message || `Gemini API returned status ${res.status}: ${errText}`;
          logger.warn(`[Gemini API] Model ${cleanModelName} returned: ${errMsg}. Trying next available model...`);
          lastError = new Error(errMsg);
          continue;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Google Gemini returned an empty response.');
        }

        return rawText;
      } catch (err) {
        lastError = err;
        logger.warn(`[Gemini API Attempt] ${err.message}. Trying next candidate model...`);
      }
    }

    throw lastError || new Error('All candidate Gemini models failed.');
  }

  /**
   * Generate presentation via Google Gemini
   */
  async _callGeminiGeneratePresentation({ topic, slideCount, tone, style }) {
    logger.info(`[Gemini Presentation Generator] Generating "${topic}" (${slideCount} slides, ${tone})...`);

    const theme = THEME_PRESETS[style] || THEME_PRESETS.obsidianViolet;

    const prompt = `You are a world-class presentation designer and executive slide author.
Create a compelling, professional ${slideCount}-slide presentation deck on the topic: "${topic}".
Tone: ${tone}.
Visual Theme: ${theme.name}.

Requirements:
1. Provide exactly ${slideCount} slides.
2. The first slide MUST have layout: "title" (Title slide with title and punchy subtitle).
3. The remaining slides should have diverse, appropriate layouts chosen from:
   - "title-content": Classic layout with 3-4 bullet points detailing core concepts.
   - "two-column": Comparison or dual-focus slide with left and right topic points.
   - "metrics": Highlight slide with 3 impressive numerical metrics and labels.
   - "visual": Narrative slide with a compelling headline and supporting insights.
   - "conclusion": Final summary slide with key takeaways and call to action.
4. Provide comprehensive speaker notes for each slide.
5. Return ONLY a strict JSON object with this exact structure:
{
  "title": "${topic}",
  "slides": [
    {
      "title": "Punchy Headline (max 8 words)",
      "subtitle": "Subtitle or takeaway statement",
      "layout": "title | title-content | two-column | metrics | visual | conclusion",
      "bulletPoints": [
        "First specific strategic point with clear impact",
        "Second specific strategic point with actionable data",
        "Third specific strategic point highlighting next steps"
      ],
      "leftColumn": [
        "Left column point 1",
        "Left column point 2"
      ],
      "rightColumn": [
        "Right column point 1",
        "Right column point 2"
      ],
      "metrics": [
        { "value": "10x", "label": "Productivity Increase" },
        { "value": "99.9%", "label": "Reliability SLA" },
        { "value": "<50ms", "label": "Global Latency" }
      ],
      "speakerNotes": "Talking points for the presenter."
    }
  ]
}`;

    const jsonString = await this._callGemini({ prompt, jsonMode: true });
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      const cleaned = jsonString.replace(/```json/gi, '').replace(/```/gi, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const generatedSlides = parsed.slides || [];
    const slides = [];

    for (let i = 0; i < generatedSlides.length; i++) {
      const gSlide = generatedSlides[i];
      const slideId = uuidv4();
      const layout = gSlide.layout || (i === 0 ? 'title' : 'title-content');
      const elements = [];

      if (layout === 'title' || i === 0) {
        elements.push({
          id: uuidv4(),
          type: 'heading',
          x: 160,
          y: 280,
          width: 1600,
          height: 180,
          content: gSlide.title || topic,
          style: {
            fontFamily: theme.fontHeading || 'Outfit',
            fontSize: 64,
            fontWeight: 800,
            color: theme.primary,
            textAlign: 'center'
          }
        });

        if (gSlide.subtitle) {
          elements.push({
            id: uuidv4(),
            type: 'text',
            x: 200,
            y: 490,
            width: 1520,
            height: 100,
            content: gSlide.subtitle,
            style: {
              fontFamily: theme.fontBody || 'Inter',
              fontSize: 30,
              fontWeight: 400,
              color: theme.mutedText || '#a79fc4',
              textAlign: 'center'
            }
          });
        }
      } else if (layout === 'metrics' && gSlide.metrics && gSlide.metrics.length > 0) {
        elements.push({
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 90,
          width: 1680,
          height: 90,
          content: gSlide.title,
          style: {
            fontFamily: theme.fontHeading || 'Outfit',
            fontSize: 48,
            fontWeight: 700,
            color: theme.text || '#f8fafc',
            textAlign: 'left'
          }
        });

        const metrics = gSlide.metrics.slice(0, 3);
        const cardWidth = 520;
        const gap = 40;
        const startX = 120;

        metrics.forEach((m, mIdx) => {
          const cardX = startX + mIdx * (cardWidth + gap);
          elements.push({
            id: uuidv4(),
            type: 'shape',
            x: cardX,
            y: 240,
            width: cardWidth,
            height: 480,
            content: 'rounded',
            style: {
              backgroundColor: theme.cardBackground || '#15102d',
              borderColor: '#2a1f56',
              borderWidth: 1,
              borderRadius: 24
            }
          });

          elements.push({
            id: uuidv4(),
            type: 'heading',
            x: cardX + 30,
            y: 330,
            width: cardWidth - 60,
            height: 110,
            content: m.value,
            style: {
              fontFamily: theme.fontHeading || 'Outfit',
              fontSize: 72,
              fontWeight: 900,
              color: theme.primary,
              textAlign: 'center'
            }
          });

          elements.push({
            id: uuidv4(),
            type: 'text',
            x: cardX + 30,
            y: 470,
            width: cardWidth - 60,
            height: 120,
            content: m.label,
            style: {
              fontFamily: theme.fontBody || 'Inter',
              fontSize: 24,
              fontWeight: 600,
              color: theme.text || '#f8fafc',
              textAlign: 'center'
            }
          });
        });
      } else if (layout === 'two-column') {
        elements.push({
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 90,
          width: 1680,
          height: 90,
          content: gSlide.title,
          style: {
            fontFamily: theme.fontHeading || 'Outfit',
            fontSize: 48,
            fontWeight: 700,
            color: theme.text || '#f8fafc',
            textAlign: 'left'
          }
        });

        elements.push({
          id: uuidv4(),
          type: 'shape',
          x: 120,
          y: 220,
          width: 800,
          height: 720,
          content: 'rounded',
          style: {
            backgroundColor: theme.cardBackground || '#15102d',
            borderColor: '#2a1f56',
            borderWidth: 1,
            borderRadius: 20
          }
        });

        const leftText = (gSlide.leftColumn || gSlide.bulletPoints?.slice(0, 3) || []).map(b => `• ${b}`).join('\n\n');
        elements.push({
          id: uuidv4(),
          type: 'text',
          x: 160,
          y: 260,
          width: 720,
          height: 640,
          content: leftText || 'Key focus area 1',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 26,
            fontWeight: 400,
            color: theme.text || '#f8fafc',
            lineHeight: 1.8
          }
        });

        elements.push({
          id: uuidv4(),
          type: 'shape',
          x: 1000,
          y: 220,
          width: 800,
          height: 720,
          content: 'rounded',
          style: {
            backgroundColor: theme.cardBackground || '#15102d',
            borderColor: '#2a1f56',
            borderWidth: 1,
            borderRadius: 20
          }
        });

        const rightText = (gSlide.rightColumn || gSlide.bulletPoints?.slice(3) || []).map(b => `• ${b}`).join('\n\n');
        elements.push({
          id: uuidv4(),
          type: 'text',
          x: 1040,
          y: 260,
          width: 720,
          height: 640,
          content: rightText || 'Key focus area 2',
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 26,
            fontWeight: 400,
            color: theme.text || '#f8fafc',
            lineHeight: 1.8
          }
        });
      } else if (layout === 'visual') {
        elements.push({
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 90,
          width: 1680,
          height: 80,
          content: gSlide.title,
          style: {
            fontFamily: theme.fontHeading || 'Outfit',
            fontSize: 44,
            fontWeight: 700,
            color: theme.text || '#f8fafc',
            textAlign: 'left'
          }
        });

        const imgIndex = (i % CURATED_DEMO_IMAGES.length);
        elements.push({
          id: uuidv4(),
          type: 'image',
          x: 120,
          y: 210,
          width: 820,
          height: 740,
          content: CURATED_DEMO_IMAGES[imgIndex],
          style: { borderRadius: 16, objectFit: 'cover' }
        });

        const bulletText = (gSlide.bulletPoints || []).map(b => `• ${b}`).join('\n\n');
        elements.push({
          id: uuidv4(),
          type: 'text',
          x: 1000,
          y: 230,
          width: 800,
          height: 700,
          content: (gSlide.subtitle ? `${gSlide.subtitle}\n\n` : '') + (bulletText || 'Strategic narrative details.'),
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 24,
            fontWeight: 400,
            color: theme.text || '#f8fafc',
            lineHeight: 1.8
          }
        });
      } else {
        elements.push({
          id: uuidv4(),
          type: 'heading',
          x: 120,
          y: 90,
          width: 1680,
          height: 90,
          content: gSlide.title,
          style: {
            fontFamily: theme.fontHeading || 'Outfit',
            fontSize: 48,
            fontWeight: 700,
            color: theme.text || '#f8fafc',
            textAlign: 'left'
          }
        });

        const bulletText = (gSlide.bulletPoints || []).map(b => `• ${b}`).join('\n\n');
        elements.push({
          id: uuidv4(),
          type: 'text',
          x: 120,
          y: 220,
          width: 1680,
          height: 720,
          content: (gSlide.subtitle ? `${gSlide.subtitle}\n\n` : '') + (bulletText || 'Core details and key insights.'),
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 28,
            fontWeight: 400,
            color: theme.text || '#f8fafc',
            lineHeight: 1.9
          }
        });
      }

      slides.push({
        id: slideId,
        layout,
        background: { type: 'color', value: theme.slideBackground || '#0d0a1b', opacity: 1 },
        notes: gSlide.speakerNotes || `Talking points for: ${gSlide.title}`,
        elements
      });
    }

    return {
      title: parsed.title || topic,
      description: `Gemini AI-generated presentation on "${topic}" with ${slides.length} slides.`,
      theme,
      slideOrder: slides.map(s => s.id),
      slides,
      dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
      thumbnail: CURATED_DEMO_IMAGES[0]
    };
  }

  /**
   * Conversational AI Co-Pilot chat
   */
  async chat({ message, context = {}, scope = 'current_slide' }) {
    if (aiConfig.isConfigured) {
      try {
        return await this._callGeminiChat({ message, context, scope });
      } catch (err) {
        logger.warn(`Gemini chat call failed: ${err.message}. Falling back to intent engine.`);
      }
    }

    // Fallback: Smart local intent engine
    const { presentation, currentSlide, selectedElement } = context;
    const lower = (message || '').toLowerCase();

    if ((lower.includes('rewrite') || lower.includes('improve') || lower.includes('simple english')) && selectedElement) {
      const originalText = selectedElement.content || '';
      const rewrittenText = `Elevated Insight: ${originalText.replace(/•/g, '').trim()}\n• High-leverage execution\n• Measurable outcomes across key metrics`;

      return {
        message: `I've rewritten your selected text with polished phrasing.`,
        scope,
        actions: [
          {
            type: 'UPDATE_ELEMENT',
            slideId: currentSlide?.id,
            elementId: selectedElement.id,
            updates: { content: rewrittenText }
          }
        ],
        suggestedFollowUps: ['Make it more concise', 'Add bullet points']
      };
    }

    if (lower.includes('add slide') || lower.includes('new slide')) {
      const activeTheme = presentation?.theme || THEME_PRESETS.obsidianViolet;
      const newSlide = {
        id: uuidv4(),
        layout: 'title-content',
        background: { type: 'color', value: activeTheme.slideBackground || '#0d0a1b', opacity: 1 },
        notes: 'AI-generated slide.',
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 100,
            width: 1680,
            height: 90,
            content: 'Strategic Action Plan',
            style: { fontFamily: activeTheme.fontHeading || 'Outfit', fontSize: 48, fontWeight: 700, color: activeTheme.text || '#f8fafc' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 120,
            y: 240,
            width: 1680,
            height: 680,
            content: '• Priority 1: Align team on core deliverable objectives\n• Priority 2: Optimize velocity and minimize overhead\n• Priority 3: Monitor telemetry and iterate rapidly',
            style: { fontFamily: activeTheme.fontBody || 'Inter', fontSize: 28, color: activeTheme.text || '#f8fafc', lineHeight: 2.0 }
          }
        ]
      };

      return {
        message: `I've added a new slide focusing on "Strategic Action Plan".`,
        scope: 'entire_presentation',
        actions: [{ type: 'ADD_SLIDE', slide: newSlide }],
        suggestedFollowUps: ['Add metric card', 'Redesign into two columns']
      };
    }

    return {
      message: `I am your SlideForge AI Co-Pilot. Add your GEMINI_API_KEY in backend/.env to unlock real-time Gemini generation.`,
      scope,
      actions: [],
      suggestedFollowUps: ['Rewrite selected text', 'Add 3 supporting bullet points', 'Apply Obsidian Violet theme']
    };
  }

  /**
   * Gemini chat implementation
   */
  async _callGeminiChat({ message, context, scope }) {
    const { currentSlide, selectedElement } = context;

    const prompt = `You are the SlideForge AI Co-Pilot, an intelligent presentation editor assistant.
User Instruction: "${message}"
Context Scope: ${scope}
Current Slide Title: "${currentSlide?.elements?.find(e => e.type === 'heading')?.content || 'Slide'}"
Selected Element: ${selectedElement ? JSON.stringify({ type: selectedElement.type, content: selectedElement.content }) : 'None'}

You can modify the canvas using structured operations:
- UPDATE_ELEMENT: { type: "UPDATE_ELEMENT", slideId: "${currentSlide?.id}", elementId: "${selectedElement?.id}", updates: { content: "...", style: { ... } } }
- ADD_ELEMENT: { type: "ADD_ELEMENT", slideId: "${currentSlide?.id}", element: { id: "${uuidv4()}", type: "text|heading|shape|image", x: 200, y: 300, width: 600, height: 200, content: "...", style: { ... } } }
- ADD_SLIDE: { type: "ADD_SLIDE", slide: { ... } }

Return a strict JSON object:
{
  "message": "Clear explanation of what was changed or suggested",
  "scope": "${scope}",
  "actions": [ /* array of structured operations */ ],
  "suggestedFollowUps": ["Follow-up question 1", "Follow-up question 2"]
}`;

    const jsonStr = await this._callGemini({ prompt, jsonMode: true });
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      const cleaned = jsonStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return {
      message: parsed.message || 'Updated slide according to your instruction.',
      scope: parsed.scope || scope,
      actions: parsed.actions || [],
      suggestedFollowUps: parsed.suggestedFollowUps || []
    };
  }

  /**
   * Main presentation generator entry point
   */
  async generatePresentation({ topic = 'Modern Technology Strategy', slideCount = 5, tone = 'Professional', style = 'obsidianViolet' }) {
    if (aiConfig.isConfigured) {
      try {
        return await this._callGeminiGeneratePresentation({ topic, slideCount, tone, style });
      } catch (err) {
        logger.error(`[Gemini Generator Error] ${err.message}`);
        throw new Error(`Google Gemini Error: ${err.message}`);
      }
    }

    // Fallback: Demo presentation generator
    logger.info(`[Demo Mode Generator] Generating presentation for topic: "${topic}"`);
    const theme = THEME_PRESETS[style] || THEME_PRESETS.obsidianViolet;
    const slides = [];

    slides.push({
      id: uuidv4(),
      layout: 'title',
      background: { type: 'color', value: theme.slideBackground || '#0d0a1b', opacity: 1 },
      notes: `Introduce the topic: ${topic} and set the stage for the audience.`,
      elements: [
        {
          id: uuidv4(),
          type: 'heading',
          x: 160,
          y: 320,
          width: 1600,
          height: 160,
          content: topic.toUpperCase(),
          style: {
            fontFamily: theme.fontHeading || 'Outfit',
            fontSize: 64,
            fontWeight: 800,
            color: theme.primary,
            textAlign: 'center'
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          x: 200,
          y: 520,
          width: 1520,
          height: 80,
          content: `Strategic Vision & Executive Briefing • ${tone} Edition`,
          style: {
            fontFamily: theme.fontBody || 'Inter',
            fontSize: 28,
            fontWeight: 400,
            color: theme.mutedText || '#a79fc4',
            textAlign: 'center'
          }
        }
      ]
    });

    for (let s = 2; s <= slideCount; s++) {
      slides.push({
        id: uuidv4(),
        layout: 'title-content',
        background: { type: 'color', value: theme.slideBackground || '#0d0a1b', opacity: 1 },
        notes: `Slide ${s} speaker notes detailing milestones for ${topic}.`,
        elements: [
          {
            id: uuidv4(),
            type: 'heading',
            x: 120,
            y: 90,
            width: 1680,
            height: 90,
            content: `Core Pillar ${s - 1}: Strategic Imperatives`,
            style: { fontFamily: theme.fontHeading || 'Outfit', fontSize: 48, fontWeight: 700, color: theme.text || '#f8fafc' }
          },
          {
            id: uuidv4(),
            type: 'text',
            x: 120,
            y: 220,
            width: 1680,
            height: 720,
            content: `• Priority 1: Modernize existing workflows to support exponential scaling\n• Priority 2: Accelerate cycle time from ideation to delivery\n• Priority 3: Maintain rigorous governance, telemetry, and uptime standards`,
            style: { fontFamily: theme.fontBody || 'Inter', fontSize: 28, fontWeight: 400, color: theme.text || '#f8fafc', lineHeight: 2.0 }
          }
        ]
      });
    }

    return {
      title: topic,
      description: `Presentation on "${topic}" with ${slides.length} slides.`,
      theme,
      slideOrder: slides.map(s => s.id),
      slides,
      dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
      thumbnail: CURATED_DEMO_IMAGES[0]
    };
  }

  async editSlide({ slide, instruction, theme = THEME_PRESETS.obsidianViolet }) {
    return this.chat({
      message: instruction,
      context: { currentSlide: slide },
      scope: 'current_slide'
    });
  }

  async generateImage({ prompt, style = 'modern' }) {
    const randomImg = CURATED_DEMO_IMAGES[Math.floor(Math.random() * CURATED_DEMO_IMAGES.length)];
    return {
      url: randomImg,
      prompt,
      provider: 'demo',
      note: 'Returned high-resolution curated presentation photography.'
    };
  }
}

module.exports = new AiService();
