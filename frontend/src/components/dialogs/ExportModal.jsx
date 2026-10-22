import React, { useState } from 'react';
import { Download, FileText, Presentation, Code2, Loader2, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { exportService } from '../../services/exportService';
import { usePresentationStore } from '../../store/presentationStore';

export const ExportModal = ({ isOpen, onClose }) => {
  const { presentation } = usePresentationStore();
  const [selectedFormat, setSelectedFormat] = useState('pptx'); // 'pptx' | 'pdf' | 'json'
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    if (!presentation) return;
    try {
      setIsExporting(true);
      setExportComplete(false);

      if (selectedFormat === 'pptx') {
        await exportService.exportToPptx(presentation);
      } else if (selectedFormat === 'pdf') {
        await exportService.exportToPdf(presentation);
      } else if (selectedFormat === 'json') {
        exportService.exportToJson(presentation);
      }

      setExportComplete(true);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Presentation"
      subtitle="Export your slides into standard formats for presenting, sharing, or archiving"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#a79fc4] hover:text-white font-medium"
          >
            Cancel
          </button>
          <button
            disabled={isExporting}
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-glow disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{exportComplete ? 'Downloaded!' : 'Generating Presentation...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {/* PowerPoint (.pptx) */}
        <button
          onClick={() => setSelectedFormat('pptx')}
          className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
            selectedFormat === 'pptx'
              ? 'bg-[#241b4d] border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-[#15102d] border-[#2a1f56] hover:border-[#4c3891]'
          }`}
        >
          <div className="p-3 bg-purple-950/80 text-purple-400 border border-purple-500/30 rounded-xl shrink-0">
            <Presentation className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Microsoft PowerPoint (.pptx)</span>
              {selectedFormat === 'pptx' && <Check className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-[#a79fc4] mt-1 leading-relaxed">
              Standard vector PowerPoint presentation. Slide text, shapes, and layouts remain editable in Keynote, PowerPoint, and Google Slides.
            </p>
          </div>
        </button>

        {/* Adobe PDF (.pdf) */}
        <button
          onClick={() => setSelectedFormat('pdf')}
          className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
            selectedFormat === 'pdf'
              ? 'bg-[#241b4d] border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-[#15102d] border-[#2a1f56] hover:border-[#4c3891]'
          }`}
        >
          <div className="p-3 bg-purple-950/80 text-purple-400 border border-purple-500/30 rounded-xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Print / Display PDF (.pdf)</span>
              {selectedFormat === 'pdf' && <Check className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-[#a79fc4] mt-1 leading-relaxed">
              High-resolution 16:9 landscape document ideal for emailing, client delivery, offline viewing, or printing handouts.
            </p>
          </div>
        </button>

        {/* JSON Presentation Data (.slideforge.json) */}
        <button
          onClick={() => setSelectedFormat('json')}
          className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
            selectedFormat === 'json'
              ? 'bg-[#241b4d] border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-[#15102d] border-[#2a1f56] hover:border-[#4c3891]'
          }`}
        >
          <div className="p-3 bg-purple-950/80 text-purple-400 border border-purple-500/30 rounded-xl shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">SlideForge Document (.json)</span>
              {selectedFormat === 'json' && <Check className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-[#a79fc4] mt-1 leading-relaxed">
              Complete raw JSON model backup including themes, coordinates, elements, notes, and styles for 100% loss-free backup and re-importing.
            </p>
          </div>
        </button>
      </div>
    </Modal>
  );
};
