import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Wand2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { aiService } from '../../services/aiService';
import { usePresentationStore } from '../../store/presentationStore';
import { THEME_PRESETS } from '../../utils/themePresets';

export const AiGenerateModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setPresentation } = usePresentationStore();

  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [tone, setTone] = useState('Professional');
  const [selectedThemeKey, setSelectedThemeKey] = useState('obsidianViolet');
  const [aiStatus, setAiStatus] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const TONES = ['Professional', 'Creative', 'Executive', 'Educational', 'Startup Pitch'];

  useEffect(() => {
    if (isOpen) {
      aiService.getStatus()
        .then(status => setAiStatus(status))
        .catch(() => setAiStatus({ isConfigured: false, mode: 'demo' }));
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (isGenerating) {
      setElapsed(0);
      timer = setInterval(() => setElapsed(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setIsGenerating(true);
      setErrorMsg('');

      const newPresentation = await aiService.generatePresentation({
        topic: topic.trim(),
        slideCount: parseInt(slideCount, 10),
        tone,
        style: selectedThemeKey
      });

      setPresentation(newPresentation);
      onClose();
      navigate(`/editor/${newPresentation._id}`);
    } catch (err) {
      console.error('Generation error:', err);
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        'Failed to generate presentation. Please check backend/.env.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Presentation with Google Gemini"
      subtitle="Craft structured, high-definition slides, layouts, and talking points powered by Google Gemini AI"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 text-sm text-[#a79fc4] hover:text-white font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-glow disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Generating ({elapsed}s)...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Generate Presentation</span>
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleGenerate} className="space-y-4">
        {/* Backend Environment Status Badge */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#15102d] border border-[#2a1f56] text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-purple-200">AI Engine:</span>
          </div>

          {aiStatus?.isConfigured ? (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Live Gemini API (.env active)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Demo Mode (.env key optional)
            </span>
          )}
        </div>

        {isGenerating && (
          <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2.5 animate-pulse">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Google Gemini is crafting {slideCount} bespoke slides ({elapsed}s elapsed)...
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-semibold block mb-0.5">Generation Error</span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-semibold text-purple-200 mb-1">
            Presentation Topic or Outline
          </label>
          <textarea
            required
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. Next-Generation Cloud AI Architecture: Scale, Security, and Edge Execution"
            className="w-full text-xs p-3 rounded-xl border border-[#2a1f56] focus:outline-none focus:ring-1 focus:ring-purple-500 bg-[#15102d] text-white placeholder:text-[#6c6194] resize-none leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Slide Count Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-purple-200 mb-1">
            <span>Number of Slides</span>
            <span className="text-purple-400 font-bold">{slideCount} Slides</span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            value={slideCount}
            disabled={isGenerating}
            onChange={(e) => setSlideCount(parseInt(e.target.value, 10))}
            className="w-full accent-purple-500 cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-[#a79fc4] mt-0.5">
            <span>3 (Quick Overview)</span>
            <span>5 (Standard Deck)</span>
            <span>10 (Comprehensive)</span>
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-purple-200 mb-1.5">
            Presentation Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                type="button"
                key={t}
                disabled={isGenerating}
                onClick={() => setTone(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all disabled:opacity-50 ${
                  tone === t
                    ? 'bg-[#241b4d] border-purple-500 text-purple-300 font-bold shadow-glow'
                    : 'bg-[#15102d] border-[#2a1f56] text-purple-300 hover:bg-[#1a1438]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Preset Selector */}
        <div>
          <label className="block text-xs font-semibold text-purple-200 mb-1.5">
            Visual Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(THEME_PRESETS).map(([key, t]) => (
              <button
                type="button"
                key={key}
                disabled={isGenerating}
                onClick={() => setSelectedThemeKey(key)}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all disabled:opacity-50 ${
                  selectedThemeKey === key
                    ? 'bg-[#241b4d] border-purple-500 ring-2 ring-purple-500/30'
                    : 'bg-[#15102d] border-[#2a1f56] hover:border-[#4c3891]'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: t.primary }}
                />
                <span className="text-xs font-medium text-purple-200 truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
