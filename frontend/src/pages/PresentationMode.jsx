import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  StickyNote,
  Clock,
  Play,
  Pause,
  RotateCcw,
  LayoutGrid,
  Zap,
  Sparkles
} from 'lucide-react';
import { usePresentationStore } from '../store/presentationStore';
import { presentationService } from '../services/presentationService';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/canvasMath';
import { ShapeRenderer } from '../components/editor/ShapeRenderer';
import { IconRenderer } from '../components/editor/IconRenderer';
import { SlideThumbnail } from '../components/slides/SlideThumbnail';

export const PresentationMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { presentation, setPresentation } = usePresentationStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showGridOverview, setShowGridOverview] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [transitionEffect, setTransitionEffect] = useState('fade'); // 'fade' | 'slide' | 'zoom' | 'flip'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'

  // Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Fetch presentation if loaded directly
  useEffect(() => {
    if (!presentation || presentation._id !== id) {
      presentationService.getById(id)
        .then(data => {
          setPresentation(data);
        })
        .catch(err => {
          console.error('Error fetching presentation for preview:', err);
        });
    }
  }, [id]);

  const slides = presentation?.slides || [];
  const currentSlide = slides[currentIndex];

  // Responsive scale to fill screen in 16:9
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / CANVAS_WIDTH;
      const scaleY = h / CANVAS_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer
  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };

  // Auto-hide controls & Laser tracker
  const handleMouseMove = (e) => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);

    if (isLaserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  const changeSlide = (newIndex, dir) => {
    if (newIndex === currentIndex) return;
    setDirection(dir);
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      changeSlide(currentIndex + 1, 'next');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      changeSlide(currentIndex - 1, 'prev');
    }
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    navigate(`/editor/${presentation?._id || id}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown', 'Enter'].includes(e.key)) {
        e.preventDefault();
        handleNext();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (showGridOverview) {
          setShowGridOverview(false);
        } else {
          handleExit();
        }
      } else if (e.key.toLowerCase() === 's') {
        setShowNotes(prev => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'g') {
        setShowGridOverview(prev => !prev);
      } else if (e.key.toLowerCase() === 'l') {
        setIsLaserActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length, showGridOverview, isLaserActive]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute CSS transition classes
  const getTransitionStyle = () => {
    if (!isTransitioning) return { opacity: 1, transform: `scale(${scale})` };

    if (transitionEffect === 'fade') {
      return {
        opacity: 0,
        transform: `scale(${scale})`,
        transition: 'opacity 0.3s ease-out'
      };
    }

    if (transitionEffect === 'zoom') {
      return {
        opacity: 0,
        transform: `scale(${scale * 0.94})`,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      };
    }

    if (transitionEffect === 'slide') {
      const offset = direction === 'next' ? '40px' : '-40px';
      return {
        opacity: 0,
        transform: `scale(${scale}) translateX(${offset})`,
        transition: 'all 0.3s ease-out'
      };
    }

    if (transitionEffect === 'flip') {
      return {
        opacity: 0,
        transform: `scale(${scale}) perspective(1000px) rotateY(${direction === 'next' ? '20deg' : '-20deg'})`,
        transition: 'all 0.35s ease-out'
      };
    }

    return { transform: `scale(${scale})` };
  };

  if (!currentSlide) {
    return (
      <div className="h-screen w-screen bg-[#080612] flex items-center justify-center text-violet-200">
        <Sparkles className="w-6 h-6 text-purple-400 animate-spin mr-3" />
        Loading presentation...
      </div>
    );
  }

  const bg = currentSlide.background || { type: 'color', value: '#0d0a1b' };
  const progressPercent = ((currentIndex + 1) / Math.max(1, slides.length)) * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="h-screen w-screen bg-[#080612] flex items-center justify-center relative overflow-hidden select-none cursor-default"
    >
      {/* Laser Pointer Dot */}
      {isLaserActive && (
        <div
          className="pointer-events-none fixed z-50 w-5 h-5 rounded-full bg-red-500 shadow-[0_0_15px_4px_rgba(239,68,68,0.9)] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
        />
      )}

      {/* Top Slide Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 16:9 Scaled Slide Screen */}
      <div
        className="relative overflow-hidden shadow-2xl shadow-purple-950/40 rounded-sm"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transformOrigin: 'center center',
          backgroundColor: bg.type === 'color' ? bg.value : '#0d0a1b',
          backgroundImage: bg.type === 'image' ? `url(${bg.value})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...getTransitionStyle()
        }}
      >
        {(currentSlide.elements || []).map((el) => {
          if (el.type === 'heading' || el.type === 'text') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  color: el.style?.color || '#f5f3ff',
                  fontFamily: el.style?.fontFamily || 'Inter',
                  fontSize: `${el.style?.fontSize || 28}px`,
                  fontWeight: el.style?.fontWeight || (el.type === 'heading' ? 700 : 400),
                  fontStyle: el.style?.fontStyle || 'normal',
                  textAlign: el.style?.textAlign || 'left',
                  textTransform: el.style?.textTransform || 'none',
                  textDecoration: el.style?.textDecoration || 'none',
                  lineHeight: el.style?.lineHeight || 1.4,
                  letterSpacing: el.style?.letterSpacing ? `${el.style?.letterSpacing}px` : undefined,
                  textShadow: el.style?.textShadow || (el.style?.hasGlow ? `0 0 15px ${el.style?.color || '#a855f7'}` : undefined),
                  whiteSpace: 'pre-wrap',
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              >
                {el.content}
              </div>
            );
          }

          if (el.type === 'image') {
            return (
              <img
                key={el.id}
                src={el.content}
                alt=""
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  objectFit: el.style?.objectFit || 'cover',
                  borderRadius: `${el.style?.borderRadius || 0}px`,
                  boxShadow: el.style?.boxShadow || (el.style?.hasGlow ? '0 0 25px rgba(168,85,247,0.5)' : undefined),
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              />
            );
          }

          if (el.type === 'shape') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              >
                <ShapeRenderer shapeType={el.content} style={el.style || {}} />
              </div>
            );
          }

          if (el.type === 'icon') {
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1
                }}
              >
                <IconRenderer iconName={el.content} style={el.style || {}} />
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Speaker Notes Overlay */}
      {showNotes && currentSlide.notes && (
        <div className="absolute top-6 left-6 max-w-md bg-[#0e0b1f]/95 backdrop-blur-md text-violet-100 p-5 rounded-2xl border border-violetDark-border shadow-2xl z-40 text-sm leading-relaxed animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-violetDark-border text-xs font-bold text-violet-400">
            <span>SPEAKER NOTES</span>
            <button onClick={() => setShowNotes(false)} className="text-violet-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="whitespace-pre-wrap">{currentSlide.notes}</p>
        </div>
      )}

      {/* Slide Grid Overview Drawer */}
      {showGridOverview && (
        <div className="fixed inset-0 z-50 bg-[#080612]/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2a1f56]">
            <div>
              <h2 className="text-xl font-bold text-white">Slide Navigator</h2>
              <p className="text-xs text-[#a79fc4]">Click any slide thumbnail to jump directly into it</p>
            </div>
            <button
              onClick={() => setShowGridOverview(false)}
              className="p-2 text-[#a79fc4] hover:text-white bg-[#1a1438] hover:bg-[#241b4d] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => {
                  changeSlide(idx, idx > currentIndex ? 'next' : 'prev');
                  setShowGridOverview(false);
                }}
                className={`flex flex-col p-2.5 rounded-xl border transition-all cursor-pointer group ${
                  idx === currentIndex
                    ? 'bg-[#1a1438] border-purple-500 ring-2 ring-purple-500/40 shadow-glow'
                    : 'bg-[#0e0b1f] border-[#2a1f56] hover:border-purple-500/60 hover:bg-[#15102d]'
                }`}
              >
                <SlideThumbnail slide={slide} width={220} />
                <div className="flex items-center justify-between mt-2 px-1 text-xs font-semibold">
                  <span className={idx === currentIndex ? 'text-purple-300' : 'text-[#a79fc4]'}>
                    Slide {idx + 1}
                  </span>
                  {idx === currentIndex && (
                    <span className="text-[10px] bg-purple-600/40 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Controls Bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0e0b1f]/95 backdrop-blur-md text-violet-100 px-5 py-2.5 rounded-full border border-violetDark-border shadow-2xl shadow-purple-950/70 flex items-center gap-3 transition-all duration-300 z-50 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        {/* Previous */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 hover:bg-violet-900/40 rounded-full disabled:opacity-30 transition-colors"
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slide Counter */}
        <span className="text-xs font-bold tracking-wider px-1 text-violet-200">
          {currentIndex + 1} / {slides.length}
        </span>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentIndex === slides.length - 1}
          className="p-1.5 hover:bg-violet-900/40 rounded-full disabled:opacity-30 transition-colors"
          title="Next Slide (Right Arrow or Space)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="h-4 w-px bg-violetDark-border" />

        {/* Transition Selector */}
        <select
          value={transitionEffect}
          onChange={(e) => setTransitionEffect(e.target.value)}
          className="bg-[#1a1438] text-purple-200 text-xs rounded-lg px-2 py-1 border border-[#2a1f56] outline-none"
          title="Slide Transition Effect"
        >
          <option value="fade">Fade Transition</option>
          <option value="slide">Slide Transition</option>
          <option value="zoom">Zoom Transition</option>
          <option value="flip">Flip 3D Transition</option>
          <option value="none">Instant</option>
        </select>

        <div className="h-4 w-px bg-violetDark-border" />

        {/* Timer Display & Controls */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-violet-300" title="Presentation Timer">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(elapsedSeconds)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 hover:text-white transition-colors"
            title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
          </button>
          <button
            onClick={() => setElapsedSeconds(0)}
            className="p-1 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <div className="h-4 w-px bg-violetDark-border" />

        {/* Laser Pointer Toggle */}
        <button
          onClick={() => setIsLaserActive(!isLaserActive)}
          className={`p-1.5 rounded-full transition-colors ${
            isLaserActive ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)]' : 'hover:bg-violet-900/40 text-violet-300'
          }`}
          title="Laser Pointer (L)"
        >
          <Zap className="w-4 h-4" />
        </button>

        {/* Grid Overview Toggle */}
        <button
          onClick={() => setShowGridOverview(!showGridOverview)}
          className={`p-1.5 rounded-full transition-colors ${
            showGridOverview ? 'bg-violet-600 text-white shadow-glow' : 'hover:bg-violet-900/40 text-violet-300'
          }`}
          title="All Slides Grid (G)"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Speaker Notes Toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`p-1.5 rounded-full transition-colors ${
            showNotes ? 'bg-violet-600 text-white shadow-glow' : 'hover:bg-violet-900/40 text-violet-300'
          }`}
          title="Toggle Speaker Notes (S)"
        >
          <StickyNote className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-violet-900/40 rounded-full transition-colors text-violet-300"
          title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-violetDark-border" />

        {/* Exit Presentation Mode */}
        <button
          onClick={handleExit}
          className="p-1.5 hover:bg-rose-600/80 rounded-full transition-colors text-white"
          title="Exit Presentation Mode (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
