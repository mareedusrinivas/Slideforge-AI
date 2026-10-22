import { create } from 'zustand';
import { presentationService } from '../services/presentationService';
import { THEME_PRESETS } from '../utils/themePresets';

const MAX_HISTORY_STEPS = 30;

// Helper to push history
const recordHistory = (state) => {
  if (!state.presentation) return state.historyPast;
  const snapshot = JSON.parse(JSON.stringify(state.presentation));
  const newPast = [...state.historyPast, snapshot];
  if (newPast.length > MAX_HISTORY_STEPS) {
    newPast.shift();
  }
  return newPast;
};

let saveDebounceTimer = null;

export const usePresentationStore = create((set, get) => ({
  presentation: null,
  activeSlideId: null,
  selectedElementIds: [],
  zoom: 'fit',
  snapToGrid: false,
  isSaving: false,
  saveStatus: 'saved', // 'saved' | 'saving' | 'error' | 'offline'
  saveError: null,
  isAiOpen: true,
  isSidebarOpen: true,
  historyPast: [],
  historyFuture: [],
  clipboard: null,
  activeGuides: { x: null, y: null },

  // Set Guides for snapping lines
  setActiveGuides: (guides) => set({ activeGuides: guides }),

  // Set entire presentation
  setPresentation: (presentation) => {
    const firstSlideId = presentation?.slides?.[0]?.id || null;
    set({
      presentation,
      activeSlideId: firstSlideId,
      selectedElementIds: [],
      historyPast: [],
      historyFuture: [],
      saveStatus: 'saved'
    });
  },

  // Set active slide
  setActiveSlideId: (slideId) => {
    set({
      activeSlideId: slideId,
      selectedElementIds: [],
      activeGuides: { x: null, y: null }
    });
  },

  // Selection
  selectElement: (elementId, isMulti = false) => {
    const current = get().selectedElementIds;
    if (isMulti) {
      if (current.includes(elementId)) {
        set({ selectedElementIds: current.filter(id => id !== elementId) });
      } else {
        set({ selectedElementIds: [...current, elementId] });
      }
    } else {
      set({ selectedElementIds: [elementId] });
    }
  },

  clearSelection: () => {
    set({ selectedElementIds: [] });
  },

  // Update presentation title
  updateTitle: (newTitle) => {
    const { presentation } = get();
    if (!presentation) return;

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: { ...presentation, title: newTitle }
    });
    get().triggerAutosave();
  },

  // Update presentation theme
  updateTheme: (newTheme) => {
    const { presentation } = get();
    if (!presentation) return;

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: { ...presentation, theme: newTheme }
    });
    get().triggerAutosave();
  },

  // Slide Operations
  addSlide: (layout = 'title-content', insertIndex = null) => {
    const { presentation, activeSlideId } = get();
    if (!presentation) return;

    const theme = presentation.theme || THEME_PRESETS.obsidianViolet;
    const newSlideId = 'slide_' + Math.random().toString(36).substr(2, 9);
    
    // Construct default elements for chosen layout
    const elements = [];
    if (layout === 'title') {
      elements.push({
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'heading',
        x: 200,
        y: 340,
        width: 1520,
        height: 180,
        content: 'New Presentation Title',
        style: { fontFamily: theme.fontHeading || 'Inter', fontSize: 72, fontWeight: 800, textAlign: 'center', color: theme.primary }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'text',
        x: 300,
        y: 540,
        width: 1320,
        height: 80,
        content: 'Add an engaging subtitle for your audience',
        style: { fontFamily: theme.fontBody || 'Inter', fontSize: 28, fontWeight: 400, textAlign: 'center', color: theme.mutedText || '#6b7280' }
      });
    } else if (layout === 'two-column') {
      elements.push({
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'heading',
        x: 120,
        y: 100,
        width: 1680,
        height: 90,
        content: 'Two Column Comparison',
        style: { fontFamily: theme.fontHeading || 'Inter', fontSize: 48, fontWeight: 700, color: theme.text }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'shape',
        x: 120,
        y: 220,
        width: 800,
        height: 720,
        content: 'rectangle',
        style: { backgroundColor: theme.cardBackground || '#f8fafc', borderColor: '#e2e8f0', borderWidth: 2, borderRadius: 16 }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'text',
        x: 160,
        y: 260,
        width: 720,
        height: 640,
        content: '• Left column topic point 1\n• Left column topic point 2\n• Supporting detail and notes',
        style: { fontFamily: theme.fontBody || 'Inter', fontSize: 26, color: theme.text, lineHeight: 1.8 }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'shape',
        x: 1000,
        y: 220,
        width: 800,
        height: 720,
        content: 'rectangle',
        style: { backgroundColor: theme.cardBackground || '#f8fafc', borderColor: '#e2e8f0', borderWidth: 2, borderRadius: 16 }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'text',
        x: 1040,
        y: 260,
        width: 720,
        height: 640,
        content: '• Right column comparison 1\n• Right column comparison 2\n• Key metrics and takeaways',
        style: { fontFamily: theme.fontBody || 'Inter', fontSize: 26, color: theme.text, lineHeight: 1.8 }
      });
    } else if (layout === 'image-text') {
      elements.push({
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'heading',
        x: 120,
        y: 100,
        width: 1680,
        height: 90,
        content: 'Visual Focus & Core Narrative',
        style: { fontFamily: theme.fontHeading || 'Inter', fontSize: 48, fontWeight: 700, color: theme.text }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'image',
        x: 120,
        y: 220,
        width: 820,
        height: 720,
        content: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        style: { borderRadius: 16, objectFit: 'cover' }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'text',
        x: 1000,
        y: 240,
        width: 800,
        height: 680,
        content: 'Pairing striking visual elements with concise, high-impact statements commands your audience’s full attention.\n\n• Point 1: Highlight key metric or insight\n• Point 2: Reinforce with user quote or research\n• Point 3: Outline next concrete action',
        style: { fontFamily: theme.fontBody || 'Inter', fontSize: 26, color: theme.text, lineHeight: 1.8 }
      });
    } else if (layout === 'blank') {
      // Empty
    } else {
      // Title and Content default
      elements.push({
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'heading',
        x: 120,
        y: 100,
        width: 1680,
        height: 90,
        content: 'Slide Title Here',
        style: { fontFamily: theme.fontHeading || 'Inter', fontSize: 48, fontWeight: 700, color: theme.text }
      }, {
        id: 'el_' + Math.random().toString(36).substr(2, 9),
        type: 'text',
        x: 120,
        y: 240,
        width: 1680,
        height: 680,
        content: '• First key strategic point goes here\n• Supporting evidence, metrics, or rationale\n• Actionable insight or recommendation\n• Long-term impact on user delight and operational velocity',
        style: { fontFamily: theme.fontBody || 'Inter', fontSize: 28, color: theme.text, lineHeight: 2.0 }
      });
    }

    const newSlide = {
      id: newSlideId,
      layout,
      background: { type: 'color', value: theme.slideBackground || '#ffffff', opacity: 1 },
      notes: '',
      elements
    };

    const currentSlides = [...(presentation.slides || [])];
    let targetIndex = currentSlides.length;
    if (insertIndex !== null) {
      targetIndex = insertIndex;
    } else if (activeSlideId) {
      const activeIdx = currentSlides.findIndex(s => s.id === activeSlideId);
      if (activeIdx !== -1) targetIndex = activeIdx + 1;
    }

    currentSlides.splice(targetIndex, 0, newSlide);

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: {
        ...presentation,
        slides: currentSlides,
        slideOrder: currentSlides.map(s => s.id)
      },
      activeSlideId: newSlideId,
      selectedElementIds: []
    });

    get().triggerAutosave();
  },

  duplicateSlide: (slideId) => {
    const { presentation } = get();
    if (!presentation) return;

    const currentSlides = [...presentation.slides];
    const index = currentSlides.findIndex(s => s.id === slideId);
    if (index === -1) return;

    const original = currentSlides[index];
    const newSlideId = 'slide_' + Math.random().toString(36).substr(2, 9);

    const clonedElements = (original.elements || []).map(el => ({
      ...JSON.parse(JSON.stringify(el)),
      id: 'el_' + Math.random().toString(36).substr(2, 9)
    }));

    const duplicatedSlide = {
      ...JSON.parse(JSON.stringify(original)),
      id: newSlideId,
      elements: clonedElements
    };

    currentSlides.splice(index + 1, 0, duplicatedSlide);

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: {
        ...presentation,
        slides: currentSlides,
        slideOrder: currentSlides.map(s => s.id)
      },
      activeSlideId: newSlideId,
      selectedElementIds: []
    });

    get().triggerAutosave();
  },

  deleteSlide: (slideId) => {
    const { presentation, activeSlideId } = get();
    if (!presentation || presentation.slides.length <= 1) return; // Keep at least 1 slide

    const currentSlides = presentation.slides.filter(s => s.id !== slideId);
    let newActiveId = activeSlideId;
    if (activeSlideId === slideId) {
      newActiveId = currentSlides[0]?.id || null;
    }

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: {
        ...presentation,
        slides: currentSlides,
        slideOrder: currentSlides.map(s => s.id)
      },
      activeSlideId: newActiveId,
      selectedElementIds: []
    });

    get().triggerAutosave();
  },

  reorderSlides: (sourceIndex, destinationIndex) => {
    const { presentation } = get();
    if (!presentation || sourceIndex === destinationIndex) return;

    const slides = [...presentation.slides];
    const [moved] = slides.splice(sourceIndex, 1);
    slides.splice(destinationIndex, 0, moved);

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: {
        ...presentation,
        slides,
        slideOrder: slides.map(s => s.id)
      }
    });

    get().triggerAutosave();
  },

  updateSlideBackground: (slideId, background) => {
    const { presentation } = get();
    if (!presentation) return;

    const slides = presentation.slides.map(slide => {
      if (slide.id === slideId) {
        return { ...slide, background: { ...slide.background, ...background } };
      }
      return slide;
    });

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: { ...presentation, slides }
    });

    get().triggerAutosave();
  },

  updateSlideNotes: (slideId, notes) => {
    const { presentation } = get();
    if (!presentation) return;

    const slides = presentation.slides.map(slide => {
      if (slide.id === slideId) {
        return { ...slide, notes };
      }
      return slide;
    });

    set({
      presentation: { ...presentation, slides }
    });

    get().triggerAutosave();
  },

  // Element Operations
  addElement: (slideId, elementData) => {
    const { presentation } = get();
    if (!presentation) return;

    const targetSlideId = slideId || get().activeSlideId;
    const newElementId = elementData.id || 'el_' + Math.random().toString(36).substr(2, 9);
    const newElement = {
      ...elementData,
      id: newElementId,
      rotation: elementData.rotation || 0,
      opacity: elementData.opacity ?? 1,
      zIndex: elementData.zIndex || 1
    };

    const slides = presentation.slides.map(slide => {
      if (slide.id === targetSlideId) {
        return {
          ...slide,
          elements: [...(slide.elements || []), newElement]
        };
      }
      return slide;
    });

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: { ...presentation, slides },
      selectedElementIds: [newElementId]
    });

    get().triggerAutosave();
  },

  updateElement: (slideId, elementId, updates, recordToHistory = true) => {
    const { presentation } = get();
    if (!presentation) return;

    const targetSlideId = slideId || get().activeSlideId;

    const slides = presentation.slides.map(slide => {
      if (slide.id === targetSlideId) {
        const elements = (slide.elements || []).map(el => {
          if (el.id === elementId) {
            return {
              ...el,
              ...updates,
              style: {
                ...(el.style || {}),
                ...(updates.style || {})
              }
            };
          }
          return el;
        });
        return { ...slide, elements };
      }
      return slide;
    });

    set({
      ...(recordToHistory ? { historyPast: recordHistory(get()), historyFuture: [] } : {}),
      presentation: { ...presentation, slides }
    });

    get().triggerAutosave();
  },

  deleteElements: (slideId, elementIdsToDelete = null) => {
    const { presentation, selectedElementIds, activeSlideId } = get();
    if (!presentation) return;

    const targetSlideId = slideId || activeSlideId;
    const targetIds = elementIdsToDelete || selectedElementIds;
    if (!targetIds || targetIds.length === 0) return;

    const slides = presentation.slides.map(slide => {
      if (slide.id === targetSlideId) {
        return {
          ...slide,
          elements: (slide.elements || []).filter(el => !targetIds.includes(el.id))
        };
      }
      return slide;
    });

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: { ...presentation, slides },
      selectedElementIds: []
    });

    get().triggerAutosave();
  },

  duplicateElements: (slideId, elementIdsToDuplicate = null) => {
    const { presentation, selectedElementIds, activeSlideId } = get();
    if (!presentation) return;

    const targetSlideId = slideId || activeSlideId;
    const targetIds = elementIdsToDuplicate || selectedElementIds;
    if (!targetIds || targetIds.length === 0) return;

    const newSelectedIds = [];
    const slides = presentation.slides.map(slide => {
      if (slide.id === targetSlideId) {
        const newElements = [...(slide.elements || [])];
        slide.elements.forEach(el => {
          if (targetIds.includes(el.id)) {
            const clonedId = 'el_' + Math.random().toString(36).substr(2, 9);
            newSelectedIds.push(clonedId);
            newElements.push({
              ...JSON.parse(JSON.stringify(el)),
              id: clonedId,
              x: el.x + 30,
              y: el.y + 30,
              zIndex: (el.zIndex || 1) + 1
            });
          }
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });

    set({
      historyPast: recordHistory(get()),
      historyFuture: [],
      presentation: { ...presentation, slides },
      selectedElementIds: newSelectedIds
    });

    get().triggerAutosave();
  },

  // Z-Order Operations
  bringForward: (slideId, elementId) => {
    const { presentation, activeSlideId } = get();
    if (!presentation) return;
    const targetSlideId = slideId || activeSlideId;

    const slides = presentation.slides.map(slide => {
      if (slide.id === targetSlideId) {
        const elements = [...(slide.elements || [])];
        const idx = elements.findIndex(e => e.id === elementId);
        if (idx !== -1 && idx < elements.length - 1) {
          const item = elements.splice(idx, 1)[0];
          elements.splice(idx + 1, 0, item);
        }
        return { ...slide, elements };
      }
      return slide;
    });

    set({
      historyPast: recordHistory(get()),
      presentation: { ...presentation, slides }
    });
    get().triggerAutosave();
  },

  sendBackward: (slideId, elementId) => {
    const { presentation, activeSlideId } = get();
    if (!presentation) return;
    const targetSlideId = slideId || activeSlideId;

    const slides = presentation.slides.map(slide => {
      if (slide.id === targetSlideId) {
        const elements = [...(slide.elements || [])];
        const idx = elements.findIndex(e => e.id === elementId);
        if (idx > 0) {
          const item = elements.splice(idx, 1)[0];
          elements.splice(idx - 1, 0, item);
        }
        return { ...slide, elements };
      }
      return slide;
    });

    set({
      historyPast: recordHistory(get()),
      presentation: { ...presentation, slides }
    });
    get().triggerAutosave();
  },

  // Undo / Redo
  undo: () => {
    const { historyPast, historyFuture, presentation } = get();
    if (historyPast.length === 0 || !presentation) return;

    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);
    const newFuture = [JSON.parse(JSON.stringify(presentation)), ...historyFuture];

    set({
      presentation: previous,
      historyPast: newPast,
      historyFuture: newFuture
    });

    get().triggerAutosave();
  },

  redo: () => {
    const { historyPast, historyFuture, presentation } = get();
    if (historyFuture.length === 0 || !presentation) return;

    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    const newPast = [...historyPast, JSON.parse(JSON.stringify(presentation))];

    set({
      presentation: next,
      historyPast: newPast,
      historyFuture: newFuture
    });

    get().triggerAutosave();
  },

  // Apply AI action directly to presentation state
  applyAiAction: (action) => {
    const { type } = action;
    const { presentation, activeSlideId } = get();
    if (!presentation) return;

    logger_apply: {
      if (type === 'UPDATE_ELEMENT') {
        const { slideId, elementId, updates } = action;
        get().updateElement(slideId || activeSlideId, elementId, updates);
      } else if (type === 'ADD_ELEMENT') {
        const { slideId, element } = action;
        get().addElement(slideId || activeSlideId, element);
      } else if (type === 'DELETE_ELEMENT') {
        const { slideId, elementId } = action;
        get().deleteElements(slideId || activeSlideId, [elementId]);
      } else if (type === 'REDESIGN_SLIDE') {
        const { slideId, layout, elements, background } = action;
        const targetId = slideId || activeSlideId;
        const slides = presentation.slides.map(slide => {
          if (slide.id === targetId) {
            return {
              ...slide,
              ...(layout ? { layout } : {}),
              ...(background ? { background } : {}),
              ...(elements ? { elements } : {})
            };
          }
          return slide;
        });
        set({
          historyPast: recordHistory(get()),
          historyFuture: [],
          presentation: { ...presentation, slides }
        });
        get().triggerAutosave();
      } else if (type === 'ADD_SLIDE') {
        const { slide } = action;
        const currentSlides = [...presentation.slides, slide];
        set({
          historyPast: recordHistory(get()),
          historyFuture: [],
          presentation: {
            ...presentation,
            slides: currentSlides,
            slideOrder: currentSlides.map(s => s.id)
          },
          activeSlideId: slide.id
        });
        get().triggerAutosave();
      } else if (type === 'UPDATE_THEME') {
        get().updateTheme(action.theme);
      }
    }
  },

  // Viewport & UI state
  setZoom: (zoom) => set({ zoom }),
  toggleSnapToGrid: () => set(state => ({ snapToGrid: !state.snapToGrid })),
  toggleAiPanel: () => set(state => ({ isAiOpen: !state.isAiOpen })),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Debounced Autosave
  triggerAutosave: () => {
    const { presentation } = get();
    if (!presentation || !presentation._id) return;

    set({ saveStatus: 'saving' });

    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
    }

    saveDebounceTimer = setTimeout(async () => {
      try {
        const currentPres = get().presentation;
        if (!currentPres || !currentPres._id) return;

        await presentationService.update(currentPres._id, currentPres);
        set({ saveStatus: 'saved', saveError: null });
      } catch (err) {
        console.warn('Autosave temporary failure:', err.message);
        set({ saveStatus: 'error', saveError: err.message });
      }
    }, 1200); // 1.2s debounce
  }
}));
