
import React, { useEffect } from 'react';
import { WitnessRecord } from '../types.ts';

interface RecordDetailProps {
  record: WitnessRecord;
  onClose: () => void;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ record, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#FDFCFB]/98 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-7xl h-full md:h-[90vh] overflow-hidden border border-[#E5E1DD] shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-8 duration-700">
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[110] w-12 h-12 border border-[#E5E1DD] bg-white flex items-center justify-center hover:bg-[#2D4F2D] hover:text-white transition-all rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media Block */}
        <div className="w-full md:w-1/2 bg-[#F9F8F6] overflow-y-auto border-b md:border-b-0 md:border-r border-[#E5E1DD] custom-scrollbar">
          {record.supporting_media_raw && record.supporting_media_raw.length > 0 ? (
            <div className="flex flex-col">
              {record.supporting_media_raw.map((file, i) => (
                <img key={i} src={file.url} alt="" className="w-full h-auto border-b border-[#E5E1DD] last:border-b-0 grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-20 text-center opacity-10">
               <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Reflection recorded as spoken word</p>
            </div>
          )}
        </div>

        {/* Content Block */}
        <div className="w-full md:w-1/2 p-12 md:p-24 overflow-y-auto custom-scrollbar flex flex-col">
          <header className="space-y-12 mb-20">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 border border-[#E5E1DD] text-[9px] uppercase tracking-[0.3em] font-bold text-[#2D4F2D]">
                {record.domain}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-20">{record.time_context} Context</span>
            </div>
            
            <h3 className="font-serif text-5xl md:text-8xl tracking-tighter leading-[0.9]">
              {record.activity_title}
            </h3>

            <h4 className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
               <span>Witnessed by {record.witness_names}</span>
               <span className="w-1.5 h-1.5 bg-[#2D4F2D] rounded-full" />
               <span>{new Date(record.date_added).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })}</span>
            </h4>
          </header>

          <article className="flex-1 space-y-20">
            <section className="relative">
              <p className="font-serif text-3xl md:text-5xl text-[#1A1A1A] leading-snug italic font-light">
                "{record.reflection_notes}"
              </p>
            </section>

            {/* Impact Details Sections */}
            <div className="space-y-16">
              {record.why_it_matters && (
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Why it matters</h4>
                  <p className="font-serif text-xl md:text-2xl text-[#555] leading-relaxed italic">{record.why_it_matters}</p>
                </div>
              )}

              {record.interconnectivity_potential && (
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Interconnectivity</h4>
                  <p className="font-serif text-xl md:text-2xl text-[#555] leading-relaxed italic">{record.interconnectivity_potential}</p>
                </div>
              )}

              {record.intentions_for_next_cycle && (
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Intentions for next cycle</h4>
                  <p className="font-serif text-xl md:text-2xl text-[#555] leading-relaxed italic">{record.intentions_for_next_cycle}</p>
                </div>
              )}

              {record.org_title && (
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Related Organisation</h4>
                  {record.org_link ? (
                    <a 
                      href={record.org_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-serif text-xl md:text-2xl text-[#2D4F2D] border-b border-[#2D4F2D]/20 hover:border-[#2D4F2D] transition-all italic"
                    >
                      {record.org_title} ↗
                    </a>
                  ) : (
                    <p className="font-serif text-xl md:text-2xl text-[#555] italic">{record.org_title}</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-16 border-t border-[#E5E1DD] flex flex-col gap-10">
              <div className="space-y-4">
                <h4 className="text-[8px] uppercase tracking-[0.4em] font-black opacity-30 italic">Lived contribution</h4>
                <div className="flex flex-wrap gap-2">
                  {record.area_of_contribution.map(area => (
                    <span key={area} className="px-3 py-1 border border-[#E5E1DD] text-[8px] uppercase tracking-widest font-bold text-[#A5A19D]">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-10">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Reflection link copied');
                  }}
                  className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[#1A1A1A] hover:opacity-50 transition-opacity pb-1"
                >
                  Share Reflection
                </button>
                <span className="text-[9px] font-mono opacity-10 uppercase">{record.id.slice(0,8)}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
