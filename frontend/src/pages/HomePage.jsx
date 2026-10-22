import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  LayoutTemplate,
  Search,
  MoreVertical,
  Trash2,
  Copy,
  Clock,
  Upload,
  Presentation as PresIcon,
  Loader2,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { presentationService } from '../services/presentationService';
import { exportService } from '../services/exportService';
import { usePresentationStore } from '../store/presentationStore';
import { TemplateGalleryModal } from '../components/dialogs/TemplateGalleryModal';
import { AiGenerateModal } from '../components/dialogs/AiGenerateModal';
import { ConfirmDeleteModal } from '../components/dialogs/ConfirmDeleteModal';
import { Button } from '../components/ui/Button';
import { Dropdown } from '../components/ui/Dropdown';
import { Modal } from '../components/ui/Modal';

export const HomePage = () => {
  const navigate = useNavigate();
  const { setPresentation } = usePresentationStore();

  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt'); // 'updatedAt' | 'title'
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [renameModal, setRenameModal] = useState({ isOpen: false, id: '', title: '' });
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.presentation-menu-container')) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchPresentations = async () => {
    try {
      setIsLoading(true);
      const data = await presentationService.getAll(searchQuery);
      setPresentations(data || []);
    } catch (err) {
      console.error('Error fetching presentations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, [searchQuery]);

  const handleCreateBlank = async () => {
    try {
      const created = await presentationService.create({ title: 'Untitled Presentation' });
      setPresentation(created);
      navigate(`/editor/${created._id}`);
    } catch (err) {
      console.error('Error creating presentation:', err);
    }
  };

  const handleDuplicate = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await presentationService.duplicate(id);
      await fetchPresentations();
    } catch (err) {
      console.error('Error duplicating:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    const idToDelete = deleteTargetId;
    if (!idToDelete) return;
    try {
      setDeleteTargetId(null);
      await presentationService.delete(idToDelete);
      await fetchPresentations();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleRenameConfirm = async (e) => {
    if (e) e.preventDefault();
    if (!renameModal.id || !renameModal.title.trim()) return;
    try {
      await presentationService.update(renameModal.id, { title: renameModal.title.trim() });
      setRenameModal({ isOpen: false, id: '', title: '' });
      await fetchPresentations();
    } catch (err) {
      console.error('Error renaming:', err);
    }
  };

  const handleImportJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsedData = await exportService.importFromJson(file);
      const created = await presentationService.create(parsedData);
      setPresentation(created);
      navigate(`/editor/${created._id}`);
    } catch (err) {
      alert(`Invalid presentation file: ${err.message}`);
    }
  };

  // Sort presentations
  const sortedPresentations = [...presentations].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <div className="min-h-screen bg-[#080612] text-purple-100 flex flex-col select-none">
      {/* Top Navbar */}
      <header className="h-16 bg-[#0e0b1f] border-b border-[#2a1f56] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-glow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 bg-clip-text text-transparent">
              SlideForge AI
            </h1>
            <p className="text-[11px] text-[#a79fc4] font-medium">Dark Violet Presentation Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Import JSON button */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a1f56] hover:bg-[#1a1438] text-xs font-semibold text-purple-200 cursor-pointer transition-colors bg-[#15102d]">
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <Button
            variant="secondary"
            size="sm"
            icon={LayoutTemplate}
            onClick={() => setIsTemplateModalOpen(true)}
            className="text-xs font-semibold"
          >
            <span className="hidden sm:inline">Templates</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => setIsAiModalOpen(true)}
            className="text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-glow"
          >
            Create with AI
          </Button>
        </div>
      </header>

      {/* Hero Action Section */}
      <section className="bg-[#0e0b1f] border-b border-[#2a1f56] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Start a new presentation
          </h2>
          <p className="text-sm text-[#a79fc4] mb-6">
            Create from scratch, start with designer dark templates, or let AI generate your entire deck in seconds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Blank Presentation */}
            <button
              onClick={handleCreateBlank}
              className="group p-5 rounded-2xl border-2 border-[#2a1f56] hover:border-purple-500 bg-[#15102d] hover:bg-[#1a1438] transition-all text-left flex items-start gap-4 shadow-sm hover:shadow-glow cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1438] border border-[#2a1f56] group-hover:border-purple-400 group-hover:text-purple-300 flex items-center justify-center text-purple-400 shadow-xs shrink-0 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                  Blank Canvas
                </h3>
                <p className="text-xs text-[#a79fc4] mt-1 leading-relaxed">
                  Start with a dark 16:9 blank slide and design freely with rich shapes, images & typography.
                </p>
              </div>
            </button>

            {/* AI Generator */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="group p-5 rounded-2xl border-2 border-purple-500/50 hover:border-purple-500 bg-gradient-to-br from-purple-950/40 via-[#15102d] to-fuchsia-950/40 hover:from-purple-950/60 transition-all text-left flex items-start gap-4 shadow-glow hover:shadow-purple-500/30 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-glow shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  Generate with AI
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold px-2 py-0.5 rounded-full">
                    Magic
                  </span>
                </h3>
                <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
                  Turn a topic, brief, or meeting notes into a complete 5-10 slide presentation deck.
                </p>
              </div>
            </button>

            {/* Browse Templates */}
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="group p-5 rounded-2xl border-2 border-[#2a1f56] hover:border-purple-500 bg-[#15102d] hover:bg-[#1a1438] transition-all text-left flex items-start gap-4 shadow-sm hover:shadow-glow cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1a1438] border border-[#2a1f56] group-hover:border-purple-400 group-hover:text-purple-300 flex items-center justify-center text-purple-400 shadow-xs shrink-0 transition-colors">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                  Starter Templates
                </h3>
                <p className="text-xs text-[#a79fc4] mt-1 leading-relaxed">
                  Browse pitch decks, project proposals, tech architectures, and portfolios.
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Recent Presentations Grid */}
      <main className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-white">Recent Presentations</h3>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#6c6194] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presentations..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-[#15102d] border border-[#2a1f56] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-[#6c6194]"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-[#15102d] border border-[#2a1f56] rounded-xl p-1 text-xs text-[#a79fc4]">
              <button
                onClick={() => setSortBy('updatedAt')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'updatedAt' ? 'bg-[#241b4d] text-purple-300 font-bold' : 'hover:bg-[#1a1438]'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'title' ? 'bg-[#241b4d] text-purple-300 font-bold' : 'hover:bg-[#1a1438]'
                }`}
              >
                Alphabetical
              </button>
            </div>
          </div>
        </div>

        {/* Presentation Cards */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-[#a79fc4]">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
            <span className="text-xs font-medium">Loading presentations...</span>
          </div>
        ) : sortedPresentations.length === 0 ? (
          <div className="p-16 border-2 border-dashed border-[#2a1f56] rounded-2xl bg-[#0e0b1f] text-center">
            <div className="w-12 h-12 rounded-full bg-[#15102d] text-purple-400 flex items-center justify-center mx-auto mb-3">
              <PresIcon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No presentations found</h4>
            <p className="text-xs text-[#a79fc4] mt-1 max-w-sm mx-auto">
              {searchQuery ? `No presentations match "${searchQuery}". Try a different search term.` : 'Create your first presentation or choose from our starter templates!'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleCreateBlank}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-glow"
              >
                Create Presentation
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sortedPresentations.map((pres) => {
              const slideCount = pres.slides?.length || 1;
              const formattedDate = new Date(pres.updatedAt || pres.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={pres._id}
                  className={`group bg-[#0e0b1f] rounded-2xl border transition-all flex flex-col justify-between relative ${
                    activeMenuId === pres._id
                      ? 'border-purple-500 shadow-glow z-30'
                      : 'border-[#2a1f56] hover:border-purple-500/80 shadow-md hover:shadow-glow z-10'
                  }`}
                >
                  {/* Thumbnail Banner (Clickable to Open) */}
                  <div
                    onClick={() => {
                      setPresentation(pres);
                      navigate(`/editor/${pres._id}`);
                    }}
                    className="aspect-video bg-[#15102d] relative overflow-hidden rounded-t-2xl border-b border-[#2a1f56] flex items-center justify-center cursor-pointer"
                  >
                    {pres.thumbnail ? (
                      <img
                        src={pres.thumbnail}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-purple-400/60 group-hover:text-purple-400 transition-colors">
                        <PresIcon className="w-10 h-10 mb-1 stroke-1" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#a79fc4]">
                          {pres.theme?.name || 'Presentation'}
                        </span>
                      </div>
                    )}

                    {/* Slides Count Badge */}
                    <div className="absolute bottom-2 left-2 bg-[#080612]/80 backdrop-blur-xs text-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#2a1f56]">
                      {slideCount} {slideCount === 1 ? 'Slide' : 'Slides'}
                    </div>
                  </div>

                  {/* Card Content & Actions */}
                  <div className="p-3.5 flex items-start justify-between gap-2 relative">
                    <div
                      onClick={() => {
                        setPresentation(pres);
                        navigate(`/editor/${pres._id}`);
                      }}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <h4 className="font-bold text-white text-sm truncate group-hover:text-purple-300 transition-colors">
                        {pres.title || 'Untitled Presentation'}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#a79fc4] mt-1">
                        <Clock className="w-3 h-3 text-[#6c6194]" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* 3-Dots Context Menu Container */}
                    <div className="presentation-menu-container relative shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setActiveMenuId(activeMenuId === pres._id ? null : pres._id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          activeMenuId === pres._id
                            ? 'bg-purple-600 text-white border-purple-400 shadow-glow'
                            : 'text-[#a79fc4] hover:text-white bg-[#15102d] border-[#2a1f56] hover:bg-[#1a1438] hover:border-purple-400'
                        }`}
                        title="Presentation Options"
                        aria-label="More presentation options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Popup - positioned cleanly above button */}
                      {activeMenuId === pres._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-full mb-2 z-50 w-48 rounded-xl bg-[#15102d] text-purple-100 shadow-2xl shadow-purple-950/90 border border-purple-500/50 py-1 divide-y divide-[#2a1f56]/80 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div className="py-1">
                            {/* Open */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setPresentation(pres);
                                navigate(`/editor/${pres._id}`);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#241b4d] flex items-center gap-2.5 text-xs text-purple-200 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                              <span className="font-medium">Open in Editor</span>
                            </button>

                            {/* Rename */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setRenameModal({
                                  isOpen: true,
                                  id: pres._id,
                                  title: pres.title || 'Untitled Presentation'
                                });
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#241b4d] flex items-center gap-2.5 text-xs text-purple-200 hover:text-white transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                              <span className="font-medium">Rename</span>
                            </button>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                handleDuplicate(pres._id, e);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#241b4d] flex items-center gap-2.5 text-xs text-purple-200 hover:text-white transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-purple-400" />
                              <span className="font-medium">Duplicate</span>
                            </button>
                          </div>

                          {/* Delete Action */}
                          <div className="py-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setDeleteTargetId(pres._id);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-rose-950/70 flex items-center gap-2.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="font-medium">Delete Presentation</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      <TemplateGalleryModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Presentation"
        message="Are you sure you want to delete this presentation? It will be permanently removed."
      />

      {/* Rename Presentation Modal */}
      <Modal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, id: '', title: '' })}
        title="Rename Presentation"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setRenameModal({ isOpen: false, id: '', title: '' })}
              className="px-4 py-2 text-sm text-[#a79fc4] hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRenameConfirm}
              className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-glow transition-colors"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleRenameConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#a79fc4] mb-1.5">
              Presentation Title
            </label>
            <input
              type="text"
              value={renameModal.title}
              onChange={(e) => setRenameModal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Q3 Strategic AI Architecture"
              autoFocus
              className="w-full bg-[#1a1438] border border-[#2a1f56] focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-purple-100 placeholder-[#6c6194] outline-none transition-colors"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
