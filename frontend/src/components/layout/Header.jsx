import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Undo2,
  Redo2,
  Play,
  Download,
  Palette,
  Check,
  Cloud,
  CloudOff,
  Loader2,
  ZoomIn,
  Home,
  Bot,
  PanelLeftClose,
  PanelLeft,
  LayoutTemplate
} from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { THEME_PRESETS } from '../../utils/themePresets';
import { Dropdown } from '../ui/Dropdown';
import { Button } from '../ui/Button';

export const Header = ({
  onOpenExport,
  onOpenTemplates,
  onOpenAiModal
}) => {
  const navigate = useNavigate();
  const {
    presentation,
    updateTitle,
    updateTheme,
    historyPast,
    historyFuture,
    undo,
    redo,
    zoom,
    setZoom,
    saveStatus,
    saveError,
    isAiOpen,
    toggleAiPanel,
    isSidebarOpen,
    toggleSidebar
  } = usePresentationStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(presentation?.title || 'Untitled Presentation');

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== presentation?.title) {
      updateTitle(titleInput.trim());
    } else {
      setTitleInput(presentation?.title || 'Untitled Presentation');
    }
  };

  const currentTheme = presentation?.theme || THEME_PRESETS.obsidianViolet;

  return (
    <header className="h-14 bg-[#0e0b1f] border-b border-[#2a1f56] px-3 md:px-4 flex items-center justify-between shrink-0 select-none z-30 text-purple-100">
      {/* Left: Brand + Title + Save Indicator */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Home / Back Button */}
        <button
          onClick={() => navigate('/')}
          className="p-1.5 text-purple-300 hover:text-white hover:bg-[#1a1438] rounded-lg transition-colors"
          title="Back to All Presentations"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Brand Logo & Name */}
        <div className="hidden lg:flex items-center gap-2 font-bold tracking-tight mr-1">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-glow">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent">
            SlideForge
          </span>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-[#1a1438] transition-colors ${
            !isSidebarOpen ? 'bg-[#1a1438] text-white' : ''
          }`}
          title={isSidebarOpen ? 'Collapse Slide Sidebar' : 'Expand Slide Sidebar'}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-[#2a1f56] hidden sm:block" />

        {/* Editable Title */}
        <div className="relative max-w-[140px] sm:max-w-[220px] md:max-w-xs truncate">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              autoFocus
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                  setTitleInput(presentation?.title || '');
                }
              }}
              className="text-sm font-semibold text-white bg-[#1a1438] border border-purple-500 rounded px-2 py-0.5 outline-none w-full shadow-inner"
            />
          ) : (
            <span
              onClick={() => {
                setTitleInput(presentation?.title || '');
                setIsEditingTitle(true);
              }}
              title="Click to rename presentation"
              className="text-sm font-semibold text-white hover:text-purple-300 hover:bg-[#1a1438] px-2 py-1 rounded cursor-pointer transition-colors block truncate"
            >
              {presentation?.title || 'Untitled Presentation'}
            </span>
          )}
        </div>

        {/* Save Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-purple-300">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-purple-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden md:inline">Saving...</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-purple-300/80" title="All changes saved to storage">
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Saved</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 text-rose-400" title={saveError || 'Save failed'}>
              <CloudOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Save failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Center: Undo/Redo & Zoom Controls */}
      <div className="flex items-center gap-1">
        {/* Undo */}
        <button
          onClick={undo}
          disabled={historyPast.length === 0}
          title="Undo (Ctrl+Z)"
          className="p-1.5 text-purple-300 hover:text-white hover:bg-[#1a1438] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={historyFuture.length === 0}
          title="Redo (Ctrl+Y)"
          className="p-1.5 text-purple-300 hover:text-white hover:bg-[#1a1438] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#2a1f56] mx-1 hidden sm:block" />

        {/* Zoom Controls */}
        <Dropdown
          trigger={
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-200 hover:bg-[#1a1438] rounded-lg border border-[#2a1f56] bg-[#15102d]">
              <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
              <span>{typeof zoom === 'number' ? `${Math.round(zoom * 100)}%` : 'Fit'}</span>
            </div>
          }
          width="w-32"
          align="center"
        >
          <div className="py-1 text-xs bg-[#15102d] text-purple-100">
            <button
              onClick={() => setZoom('fit')}
              className={`w-full text-left px-3 py-1.5 hover:bg-[#241b4d] flex items-center justify-between ${zoom === 'fit' ? 'font-semibold text-purple-400' : 'text-purple-200'}`}
            >
              Fit Screen {zoom === 'fit' && <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setZoom(0.5)}
              className={`w-full text-left px-3 py-1.5 hover:bg-[#241b4d] flex items-center justify-between ${zoom === 0.5 ? 'font-semibold text-purple-400' : 'text-purple-200'}`}
            >
              50% {zoom === 0.5 && <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setZoom(0.75)}
              className={`w-full text-left px-3 py-1.5 hover:bg-[#241b4d] flex items-center justify-between ${zoom === 0.75 ? 'font-semibold text-purple-400' : 'text-purple-200'}`}
            >
              75% {zoom === 0.75 && <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setZoom(1.0)}
              className={`w-full text-left px-3 py-1.5 hover:bg-[#241b4d] flex items-center justify-between ${zoom === 1.0 ? 'font-semibold text-purple-400' : 'text-purple-200'}`}
            >
              100% {zoom === 1.0 && <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setZoom(1.25)}
              className={`w-full text-left px-3 py-1.5 hover:bg-[#241b4d] flex items-center justify-between ${zoom === 1.25 ? 'font-semibold text-purple-400' : 'text-purple-200'}`}
            >
              125% {zoom === 1.25 && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </Dropdown>
      </div>

      {/* Right: Theme Selector, Present, Export, AI Assistant Button */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Template Gallery Trigger */}
        <Button
          variant="ghost"
          size="sm"
          icon={LayoutTemplate}
          onClick={onOpenTemplates}
          className="hidden md:inline-flex text-xs font-semibold text-purple-200 hover:text-white"
          title="Browse Presentation Templates"
        >
          Templates
        </Button>

        {/* Theme Preset Selector */}
        <Dropdown
          trigger={
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#2a1f56] hover:border-purple-500 bg-[#15102d] text-xs font-medium text-purple-200 transition-colors"
              title="Change Presentation Theme"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xl:inline">{currentTheme.name}</span>
            </div>
          }
          width="w-56"
          align="right"
        >
          <div className="p-2 bg-[#15102d] text-purple-100">
            <div className="text-[11px] font-semibold text-[#a79fc4] uppercase tracking-wider px-2 py-1">
              Select Deck Theme
            </div>
            {Object.values(THEME_PRESETS).map((t) => (
              <button
                key={t.id}
                onClick={() => updateTheme(t)}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  currentTheme.id === t.id ? 'bg-[#241b4d] font-semibold text-purple-300' : 'hover:bg-[#1a1438] text-purple-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: t.primary }}
                  />
                  <span>{t.name}</span>
                </div>
                {currentTheme.id === t.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Export Button */}
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={onOpenExport}
          className="text-xs"
          title="Export to PDF, PPTX or JSON"
        >
          <span className="hidden sm:inline">Export</span>
        </Button>

        {/* Present Button */}
        <Button
          variant="primary"
          size="sm"
          icon={Play}
          onClick={() => navigate(`/present/${presentation?._id || 'temp'}`)}
          className="text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-glow"
          title="Start Fullscreen Presentation"
        >
          <span className="hidden sm:inline">Present</span>
        </Button>

        {/* AI Assistant Toggle Button */}
        <Button
          variant={isAiOpen ? 'primary' : 'secondary'}
          size="sm"
          icon={Bot}
          onClick={toggleAiPanel}
          className={`text-xs font-semibold ${isAiOpen ? 'bg-purple-600 text-white shadow-glow' : 'text-purple-300 border-[#2a1f56]'}`}
          title="Toggle AI Assistant Panel"
        >
          <span className="hidden sm:inline">AI Co-Pilot</span>
        </Button>
      </div>
    </header>
  );
};
