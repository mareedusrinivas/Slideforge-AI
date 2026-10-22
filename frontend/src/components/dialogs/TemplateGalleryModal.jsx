import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutTemplate, Sparkles, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { presentationService } from '../../services/presentationService';
import { usePresentationStore } from '../../store/presentationStore';

export const TemplateGalleryModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setPresentation } = usePresentationStore();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      presentationService.getTemplates()
        .then(data => {
          setTemplates(data || []);
          if (data && data.length > 0) setSelectedTemplate(data[0]);
        })
        .catch(err => console.error('Error fetching templates:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      setIsApplying(true);
      const newPresentation = await presentationService.useTemplate(selectedTemplate.id, selectedTemplate.title);
      setPresentation(newPresentation);
      onClose();
      navigate(`/editor/${newPresentation._id}`);
    } catch (err) {
      console.error('Error applying template:', err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Presentation Template Gallery"
      subtitle="Start from a designer-crafted presentation deck with realistic sample content"
      maxWidth="max-w-4xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#a79fc4] hover:text-white font-medium"
          >
            Cancel
          </button>
          <button
            disabled={!selectedTemplate || isApplying}
            onClick={handleUseTemplate}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-glow disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying Template...</span>
              </>
            ) : (
              <>
                <span>Use This Template</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-[#a79fc4]">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-purple-400" />
          <span>Loading starter decks...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="md:col-span-1 space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedTemplate?.id === tpl.id
                    ? 'bg-[#241b4d] border-purple-500 ring-2 ring-purple-500/30'
                    : 'bg-[#15102d] border-[#2a1f56] hover:border-[#4c3891]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-purple-400 tracking-wider">
                    {tpl.category}
                  </span>
                  {selectedTemplate?.id === tpl.id && (
                    <Check className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div className="font-bold text-white text-sm mt-1">{tpl.title}</div>
                <div className="text-xs text-[#a79fc4] mt-1 line-clamp-1">{tpl.description}</div>
              </button>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="md:col-span-2 bg-[#15102d] rounded-2xl border border-[#2a1f56] p-5 flex flex-col justify-between">
            {selectedTemplate ? (
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-md border border-[#2a1f56] mb-4 bg-[#080612]">
                  <img
                    src={selectedTemplate.thumbnail}
                    alt={selectedTemplate.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#080612]/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full font-medium border border-[#2a1f56]">
                    {selectedTemplate.slides?.length || 3} Slides Included
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{selectedTemplate.title}</h4>
                <p className="text-sm text-[#a79fc4] mb-4 leading-relaxed">{selectedTemplate.description}</p>

                <div className="flex items-center gap-4 text-xs text-[#a79fc4] pt-3 border-t border-[#2a1f56]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block"
                      style={{ backgroundColor: selectedTemplate.theme?.primary || '#a855f7' }}
                    />
                    {selectedTemplate.theme?.name || 'Modern Theme'}
                  </span>
                  <span>• Aspect Ratio 16:9</span>
                  <span>• Fully Editable</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Modal>
  );
};
