import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Layers, Maximize2, Sparkles, Play, X } from 'lucide-react';
import { usePresentationStore } from '../store/presentationStore';
import { presentationService } from '../services/presentationService';

import { Header } from '../components/layout/Header';
import { SlideSidebar } from '../components/slides/SlideSidebar';
import { MainToolbar } from '../components/toolbar/MainToolbar';
import { PresentationCanvas } from '../components/editor/PresentationCanvas';
import { AiAssistantPanel } from '../components/ai-assistant/AiAssistantPanel';

import { NewSlideModal } from '../components/dialogs/NewSlideModal';
import { TemplateGalleryModal } from '../components/dialogs/TemplateGalleryModal';
import { ExportModal } from '../components/dialogs/ExportModal';
import { ImageUploadModal } from '../components/dialogs/ImageUploadModal';
import { IconPickerModal } from '../components/dialogs/IconPickerModal';
import { ConfirmDeleteModal } from '../components/dialogs/ConfirmDeleteModal';
import { AiGenerateModal } from '../components/dialogs/AiGenerateModal';
import { Button } from '../components/ui/Button';

export const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    presentation,
    setPresentation,
    deleteSlide
  } = usePresentationStore();

  const [isLoading, setIsLoading] = useState(!presentation || presentation._id !== id);
  const [loadError, setLoadError] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Mobile Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileAiOpen, setIsMobileAiOpen] = useState(false);

  // Modals
  const [isNewSlideOpen, setIsNewSlideOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);

  useEffect(() => {
    if (!presentation || presentation._id !== id) {
      setIsLoading(true);
      setLoadError(null);
      presentationService.getById(id)
        .then(data => {
          setPresentation(data);
        })
        .catch(err => {
          console.error('Failed to load presentation:', err);
          setLoadError(err.response?.data?.message || err.message || 'Presentation not found');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080612] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-14 h-14 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
          <Sparkles className="w-6 h-6 text-purple-400 absolute" />
        </div>
        <p className="text-sm font-semibold text-purple-200">Loading your presentation...</p>
        <p className="text-xs text-[#a79fc4] mt-1">Preparing high-definition 16:9 canvas</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#080612] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 shadow-lg shadow-rose-950/40">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Could Not Load Presentation</h2>
        <p className="text-sm text-[#a79fc4] max-w-md mb-6">{loadError}</p>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-glow"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#080612] text-purple-100 select-none">
      {/* 1. Top Navigation Bar */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTemplates={() => setIsTemplateOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* 2. Main 3-Panel Editor Body */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Desktop Left: Slide Sidebar (hidden on mobile, shown on md+) */}
        <div className="hidden md:flex h-full shrink-0">
          <SlideSidebar
            onOpenNewSlideModal={() => setIsNewSlideOpen(true)}
            onConfirmDeleteSlide={(slideId) => setSlideToDelete(slideId)}
          />
        </div>

        {/* Center: Presentation Canvas & Toolbars */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
          <MainToolbar
            onOpenImageModal={() => setIsImageOpen(true)}
            onOpenIconModal={() => setIsIconModalOpen(true)}
            onToggleNotes={() => setIsNotesOpen(!isNotesOpen)}
            isNotesOpen={isNotesOpen}
          />

          <PresentationCanvas
            isNotesOpen={isNotesOpen}
            onOpenImageModal={() => setIsImageOpen(true)}
            onOpenIconModal={() => setIsIconModalOpen(true)}
          />
        </div>

        {/* Desktop Right: Signature AI Assistant Panel (hidden on mobile, shown on lg+) */}
        <div className="hidden lg:flex h-full shrink-0">
          <AiAssistantPanel
            onOpenAiDeckModal={() => setIsAiModalOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on < md screens) */}
      <nav className="md:hidden h-14 bg-[#0e0b1f] border-t border-[#2a1f56] px-4 flex items-center justify-around shrink-0 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center justify-center text-[10px] font-semibold text-purple-300 hover:text-white gap-0.5"
        >
          <span className="p-1 rounded-lg bg-[#1a1438]">
            <Layers className="w-4 h-4 text-purple-400" />
          </span>
          <span>Slides</span>
        </button>

        <button
          onClick={() => {
            setIsMobileSidebarOpen(false);
            setIsMobileAiOpen(false);
          }}
          className="flex flex-col items-center justify-center text-[10px] font-semibold text-purple-300 gap-0.5"
        >
          <span className="p-1 rounded-lg bg-purple-600/30 border border-purple-500/40">
            <Maximize2 className="w-4 h-4 text-purple-300" />
          </span>
          <span>Canvas</span>
        </button>

        <button
          onClick={() => setIsMobileAiOpen(true)}
          className="flex flex-col items-center justify-center text-[10px] font-semibold text-purple-300 hover:text-white gap-0.5"
        >
          <span className="p-1 rounded-lg bg-[#1a1438]">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </span>
          <span>AI Co-Pilot</span>
        </button>
      </nav>

      {/* Mobile Slide Drawer */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#0e0b1f] border-r border-[#2a1f56] h-full flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-[#2a1f56] flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Slide Navigator</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-purple-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SlideSidebar
                onOpenNewSlideModal={() => {
                  setIsMobileSidebarOpen(false);
                  setIsNewSlideOpen(true);
                }}
                onConfirmDeleteSlide={(slideId) => {
                  setIsMobileSidebarOpen(false);
                  setSlideToDelete(slideId);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile AI Drawer */}
      {isMobileAiOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileAiOpen(false)}
          />
          <div className="relative w-80 sm:w-96 bg-[#0e0b1f] border-l border-[#2a1f56] h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-3 border-b border-[#2a1f56] flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">AI Co-Pilot</span>
              <button
                onClick={() => setIsMobileAiOpen(false)}
                className="p-1 text-purple-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AiAssistantPanel
                onOpenAiDeckModal={() => {
                  setIsMobileAiOpen(false);
                  setIsAiModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dialog Modals */}
      <NewSlideModal
        isOpen={isNewSlideOpen}
        onClose={() => setIsNewSlideOpen(false)}
      />

      <TemplateGalleryModal
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <ImageUploadModal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />

      <IconPickerModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
      />

      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(slideToDelete)}
        onClose={() => setSlideToDelete(null)}
        onConfirm={() => {
          if (slideToDelete) deleteSlide(slideToDelete);
          setSlideToDelete(null);
        }}
        title="Delete Slide"
        message="Are you sure you want to delete this slide? All elements on this slide will be permanently removed."
      />
    </div>
  );
};
