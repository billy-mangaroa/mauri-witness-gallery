import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DOMAIN_METRICS, DOMAIN_NARRATIVES } from '../constants.ts';
import { DomainType } from '../types.ts';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ImpactChatbotProps {
  activeDomain: DomainType;
}

const ImpactChatbot: React.FC<ImpactChatbotProps> = ({ activeDomain }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Kia ora. Ask me about the impact dashboards, recent measures, or where to explore next.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantNote, setAssistantNote] = useState<string | null>(null);
  const [botInstructions, setBotInstructions] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feedRef.current) return;
    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages]);

  const loadInstructions = () => {
    return fetch(`/BotInstructions.txt?ts=${Date.now()}`, { cache: 'no-store' })
      .then(response => response.text())
      .then(text => {
        setBotInstructions(text.trim());
      })
      .catch(() => {
        setBotInstructions('');
      });
  };

  useEffect(() => {
    let isActive = true;
    loadInstructions().catch(() => null);
    const onFocus = () => {
      if (isActive) loadInstructions().catch(() => null);
    };
    window.addEventListener('focus', onFocus);
    return () => {
      isActive = false;
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowSpeechBubble(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const suggestions = useMemo(() => {
    if (activeDomain === 'Earth') {
      return [
        'Summarise the Earth snapshot',
        'What does Predator Free track?',
        'How should I read seasonal capture pulse?'
      ];
    }
    if (activeDomain === 'People') {
      return [
        'Summarise the People snapshot',
        'What is the community contribution programme?',
        'Show recent events highlights'
      ];
    }
    if (activeDomain === 'Network') {
      return [
        'Summarise the Network snapshot',
        'How do organisations connect?',
        'How do I use the network map?'
      ];
    }
    return [
      'Summarise the dashboard',
      'How is impact measured?',
      'Where should I explore next?'
    ];
  }, [activeDomain]);

  const buildMetricSources = () => {
    const metrics = DOMAIN_METRICS[activeDomain] || [];
    return metrics.map((metric, index) => ({
      id: `M${index + 1}`,
      label: metric.label,
      result: metric.result,
      description: metric.description
    }));
  };

  const buildPrompt = (text: string) => {
    const narrative = DOMAIN_NARRATIVES[activeDomain];
    const sources = buildMetricSources();
    const sourceLines = sources
      .map(source => `${source.id}: ${source.label} — ${source.result}${source.description ? ` (${source.description})` : ''}`)
      .join('\n');
    const constraints: string[] = [];
    if (/150\s*-\s*200\s*words/i.test(botInstructions)) {
      constraints.push('Length: 150-200 words.');
    }
    if (/paragraph/i.test(botInstructions)) {
      constraints.push('Use short paragraphs, avoid bullet lists.');
    }
    if (/te\s*reo/i.test(botInstructions)) {
      constraints.push('Include 1-2 te reo Maori words (examples: kai, whanau, mahi, whenua, wairua, kaitiaki).');
    }
    if (/local|neighbour|neighbor|yarn/i.test(botInstructions)) {
      constraints.push('Voice: friendly, local, down-to-earth.');
    }

    return [
      `DOMAIN: ${activeDomain}`,
      narrative ? `DOMAIN NARRATIVE: ${narrative.subheading}\n${narrative.intro.join(' ')}` : '',
      sources.length ? `METRIC SOURCES:\n${sourceLines}` : 'METRIC SOURCES: None',
      constraints.length ? `CONSTRAINTS:\n${constraints.join('\n')}` : '',
      'RESPONSE RULES: Use citations in square brackets that map to the metric sources, e.g., [M1]. If no metric applies, respond without citations.',
      `USER QUESTION: ${text}`
    ].filter(Boolean).join('\n\n');
  };

  const callGemini = async (text: string) => {
    const chatEndpoint = (import.meta as any).env?.PROD
      ? '/.netlify/functions/chat'
      : '/api/chat';
    const response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: buildPrompt(text),
        system: botInstructions
      })
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    const data = await response.json();
    const textResponse = data?.text;
    return typeof textResponse === 'string' && textResponse.trim().length > 0
      ? textResponse.trim()
      : 'I could not generate a response yet. Please try again.';
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setAssistantNote(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await callGemini(trimmed);
      const sources = buildMetricSources();
      const hasCitation = /\[M\d+\]/.test(reply);
      const sourcesBlock = sources.length
        ? `\n\nSources: ${sources.map(source => `[${source.id}] ${source.label}: ${source.result}`).join(' · ')}`
        : '';
      const response: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: hasCitation ? `${reply}${sourcesBlock}` : reply
      };
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setAssistantNote('The assistant is temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-[120] w-[92vw] max-w-[380px]">
      {!isOpen && (
        <div className="flex flex-col items-end gap-3">
          {showSpeechBubble && (
            <div className="bg-white/90 border border-[#E5E1DD] text-[11px] text-[#555] rounded-2xl px-4 py-3 shadow-lg max-w-[260px]">
              Kia ora — feel free to ask about our living impact.
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-[#2D4F2D] text-white flex items-center justify-center shadow-2xl hover:bg-black transition-all animate-[pulse_2.5s_ease-in-out_infinite]"
            aria-label="Open impact guide"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v9a2 2 0 0 1-2 2H9l-5 4V6z" />
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <section className="bg-white border border-[#E5E1DD] rounded-[24px] p-4 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2D4F2D]">Impact Guide</span>
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#A5A19D]">{activeDomain}</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full border border-[#E5E1DD] text-[#666] flex items-center justify-center hover:border-[#2D4F2D]/40 hover:text-[#2D4F2D] transition-colors"
                aria-label="Close impact guide"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={feedRef} className="max-h-[240px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[12px] leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#2D4F2D] text-white'
                      : 'bg-[#F9F8F6] text-[#1A1A1A]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2.5 text-[12px] bg-[#F9F8F6] text-[#888]">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {assistantNote && (
            <div className="text-[10px] text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-2">
              {assistantNote}
            </div>
          )}

          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!isLoading) handleSend(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about metrics or stories"
              className="flex-1 border border-[#E5E1DD] rounded-full px-4 py-2 text-[12px] bg-white focus:outline-none focus:border-[#2D4F2D]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#2D4F2D] text-white text-[9px] uppercase tracking-widest font-black rounded-full hover:bg-black transition-all disabled:opacity-60"
            >
              Ask
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="text-left text-[10px] border border-[#E5E1DD] rounded-full px-3 py-1.5 hover:border-[#2D4F2D]/40 hover:text-[#2D4F2D] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ImpactChatbot;
