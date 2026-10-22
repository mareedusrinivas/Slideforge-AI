import React, { useState } from 'react';
import { Upload, Link2, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { uploadService } from '../../services/uploadService';
import { aiService } from '../../services/aiService';
import { usePresentationStore } from '../../store/presentationStore';

export const ImageUploadModal = ({ isOpen, onClose }) => {
  const {
    activeSlideId,
    selectedElementIds,
    addElement,
    updateElement,
    presentation
  } = usePresentationStore();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'ai'
  const [imageUrl, setImageUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeSlide = presentation?.slides?.find(s => s.id === activeSlideId);
  const selectedElement = activeSlide?.elements?.find(e => e.id === selectedElementIds[0]);
  const isReplacing = selectedElement?.type === 'image';

  const handleApplyImage = (url) => {
    if (!url) return;

    if (isReplacing && selectedElement) {
      updateElement(activeSlideId, selectedElement.id, {
        content: url
      });
    } else {
      addElement(activeSlideId, {
        type: 'image',
        x: 460,
        y: 200,
        width: 1000,
        height: 600,
        content: url,
        style: {
          borderRadius: 16,
          objectFit: 'cover'
        }
      });
    }

    onClose();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg('');
      const data = await uploadService.uploadFile(file);
      if (data?.url) {
        handleApplyImage(data.url);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    handleApplyImage(imageUrl.trim());
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    try {
      setIsUploading(true);
      setErrorMsg('');
      const data = await aiService.generateImage(aiPrompt.trim());
      if (data?.url) {
        handleApplyImage(data.url);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Image generation failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isReplacing ? "Replace Image" : "Add Image to Slide"}
      subtitle="Upload a local image, paste a web link, or generate with AI"
      maxWidth="max-w-lg"
    >
      {/* Tab Nav */}
      <div className="flex border-b border-[#2a1f56] mb-5">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-[#a79fc4] hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        <button
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'url'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-[#a79fc4] hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-[#a79fc4] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Visual Prompt</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-xs text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Tab 1: Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#2a1f56] hover:border-purple-500 rounded-2xl bg-[#15102d] hover:bg-[#1a1438] cursor-pointer transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                <span className="text-xs font-medium text-purple-200">Uploading and processing...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-purple-950/80 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-white">Click to upload an image</span>
                <span className="text-xs text-[#a79fc4] mt-1">PNG, JPG, WebP, GIF, or SVG (up to 10MB)</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Tab 2: URL */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">
              Web Image URL (HTTPS)
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs p-2.5 rounded-lg border border-[#2a1f56] focus:outline-none focus:ring-1 focus:ring-purple-500 bg-[#15102d] text-white placeholder:text-[#6c6194]"
            />
          </div>

          <button
            type="submit"
            disabled={!imageUrl.trim()}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-glow transition-colors disabled:opacity-50"
          >
            Insert Image from URL
          </button>
        </form>
      )}

      {/* Tab 3: AI Generation */}
      {activeTab === 'ai' && (
        <form onSubmit={handleAiGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">
              Describe the image you need for your slide
            </label>
            <textarea
              rows={3}
              required
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Modern minimalist server room with glowing violet fiber optic cables, cinematic lighting..."
              className="w-full text-xs p-2.5 rounded-lg border border-[#2a1f56] focus:outline-none focus:ring-1 focus:ring-purple-500 bg-[#15102d] text-white placeholder:text-[#6c6194] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!aiPrompt.trim() || isUploading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-glow transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating visual...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate & Insert Visual</span>
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
};
