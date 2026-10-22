import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  CheckCircle2,
  Undo2,
  Trash2,
  Loader2,
  ChevronRight,
  Layers,
  Wand2,
  Lightbulb,
  Maximize2
} from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { aiService } from '../../services/aiService';

const SUGGESTED_PROMPTS = [
  'Make this slide more modern and visually appealing',
  'Change this slide into a two-column layout',
  'Rewrite the selected text in simple English',
  'Add three supporting bullet points',
  'Generate a suitable image for this slide',
  'Summarize this slide',
  'Apply Midnight Dark theme'
];

export const AiAssistantPanel = ({
  onOpenAiDeckModal
}) => {
  const {
    presentation,
    activeSlideId,
    selectedElementIds,
    applyAiAction,
    undo,
    isAiOpen,
    toggleAiPanel
  } = usePresentationStore();

  const [inputMessage, setInputMessage] = useState('');
  const [scope, setScope] = useState('current_slide'); // 'selected_element' | 'current_slide' | 'entire_presentation'
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [aiStatus, setAiStatus] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hi! I'm your SlideForge AI Co-Pilot powered by Google Gemini. I can generate full decks, redesign slides, rewrite copy, and add rich visual elements.",
      actions: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch AI backend status
    aiService.getStatus()
      .then(status => setAiStatus(status))
      .catch(() => setAiStatus({ mode: 'demo', provider: 'demo', isConfigured: false }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Adjust default scope when an element is selected
  useEffect(() => {
    if (selectedElementIds.length > 0) {
      setScope('selected_element');
    } else {
      setScope('current_slide');
    }
  }, [selectedElementIds]);

  if (!isAiOpen) return null;

  const activeSlide = presentation?.slides?.find(s => s.id === activeSlideId);
  const selectedElement = activeSlide?.elements?.find(e => e.id === selectedElementIds[0]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setLoadingStep(aiStatus?.isConfigured ? 'Consulting Google Gemini...' : 'Analyzing slide intent...');

    try {
      setTimeout(() => setLoadingStep('Synthesizing structured canvas edits...'), 500);

      const context = {
        presentation: {
          title: presentation?.title,
          theme: presentation?.theme,
          slideCount: presentation?.slides?.length
        },
        currentSlide: activeSlide ? {
          id: activeSlide.id,
          layout: activeSlide.layout,
          elements: activeSlide.elements
        } : null,
        selectedElement: selectedElement || null
      };

      const response = await aiService.chat(text, context, scope);

      const assistantMessage = {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: response.message || "I've processed your request.",
        actions: response.actions || [],
        suggestedFollowUps: response.suggestedFollowUps || [],
        applied: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Automatically apply actions to canvas state immediately
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach(action => {
          applyAiAction(action);
        });
        assistantMessage.applied = true;
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage = {
        id: 'msg_' + Date.now(),
        sender: 'assistant',
        text: `⚠️ ${err.response?.data?.message || err.message || 'Error executing AI action.'}`,
        actions: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Conversation cleared. How can I assist you with your presentation?",
        actions: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <aside className="w-80 md:w-96 bg-[#0e0b1f] border-l border-[#2a1f56] flex flex-col h-full shrink-0 select-none z-20 shadow-xs text-purple-100">
      {/* Header */}
      <div className="p-3 border-b border-[#2a1f56] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              Gemini Co-Pilot
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                aiStatus?.isConfigured
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
              }`}>
                {aiStatus?.isConfigured ? 'Live Gemini AI' : 'Demo Mode'}
              </span>
            </h3>
            <p className="text-[10px] text-[#a79fc4]">Context-aware Google AI assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-purple-400 hover:text-white rounded-md hover:bg-[#1a1438] transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleAiPanel}
            className="p-1.5 text-purple-400 hover:text-white rounded-md hover:bg-[#1a1438] transition-colors"
            title="Collapse AI Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scope Selector */}
      <div className="px-3 py-2 bg-[#15102d] border-b border-[#2a1f56] flex items-center gap-1 text-[11px]">
        <span className="text-[#a79fc4] font-medium shrink-0 mr-1">Target:</span>
        <button
          onClick={() => setScope('selected_element')}
          disabled={!selectedElement}
          className={`px-2 py-1 rounded-md font-medium transition-colors ${
            scope === 'selected_element'
              ? 'bg-purple-600 text-white shadow-glow font-bold'
              : 'text-purple-300 hover:bg-[#1a1438] disabled:opacity-30 disabled:hover:bg-transparent'
          }`}
        >
          Selected Item
        </button>
        <button
          onClick={() => setScope('current_slide')}
          className={`px-2 py-1 rounded-md font-medium transition-colors ${
            scope === 'current_slide'
              ? 'bg-purple-600 text-white shadow-glow font-bold'
              : 'text-purple-300 hover:bg-[#1a1438]'
          }`}
        >
          Current Slide
        </button>
        <button
          onClick={() => setScope('entire_presentation')}
          className={`px-2 py-1 rounded-md font-medium transition-colors ${
            scope === 'entire_presentation'
              ? 'bg-purple-600 text-white shadow-glow font-bold'
              : 'text-purple-300 hover:bg-[#1a1438]'
          }`}
        >
          Entire Deck
        </button>
      </div>

      {/* Full Deck Generator Banner */}
      <div className="mx-3 mt-2.5 p-2.5 bg-gradient-to-r from-purple-950/70 to-fuchsia-950/70 rounded-xl border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="text-[11px]">
            <p className="font-semibold text-white">Gemini Deck Generator</p>
            <p className="text-purple-300/80">Generate full multi-slide deck</p>
          </div>
        </div>
        <button
          onClick={onOpenAiDeckModal}
          className="text-[11px] font-semibold text-white bg-purple-600 hover:bg-purple-700 px-2.5 py-1 rounded-lg shadow-glow transition-colors shrink-0"
        >
          Generate
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-xs'
                  : 'bg-[#15102d] text-purple-100 rounded-bl-xs border border-[#2a1f56]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px]">
                {msg.sender === 'user' ? (
                  <>
                    <span>You</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span>Gemini Co-Pilot</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Action summary badge if operations were performed */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Applied {msg.actions.length} canvas update{msg.actions.length > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => undo()}
                    className="flex items-center gap-1 text-purple-300 hover:text-white underline text-[10px]"
                    title="Undo this action"
                  >
                    <Undo2 className="w-3 h-3" />
                    Undo
                  </button>
                </div>
              )}
            </div>

            {/* Suggested Follow-up Prompts */}
            {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {msg.suggestedFollowUps.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] bg-[#1a1438] hover:bg-[#241b4d] text-purple-200 border border-[#2a1f56] px-2 py-1 rounded-lg transition-colors flex items-center gap-1 text-left"
                  >
                    <Lightbulb className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <span className="truncate">{prompt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-purple-300 bg-[#15102d] border border-[#2a1f56] rounded-2xl p-3 w-fit animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span className="text-xs">{loadingStep || 'Thinking...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="px-3 py-1.5 border-t border-[#2a1f56] bg-[#0e0b1f] overflow-x-auto whitespace-nowrap flex gap-1.5 text-[10px]">
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2 py-1 bg-[#15102d] hover:bg-[#1a1438] text-purple-300 rounded-md border border-[#2a1f56] transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 border-t border-[#2a1f56] bg-[#0e0b1f]">
        <div className="flex items-center gap-2 bg-[#15102d] border border-[#2a1f56] rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-purple-500">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              scope === 'selected_element'
                ? 'Ask Gemini to rewrite or format selected item...'
                : 'Ask Gemini to redesign slide, add bullets...'
            }
            disabled={isLoading}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-[#6c6194] outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-1.5 text-purple-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};
