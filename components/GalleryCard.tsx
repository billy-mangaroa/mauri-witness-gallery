
import React, { useState } from 'react';
import { WitnessRecord } from '../types.ts';

interface GalleryCardProps {
  record: WitnessRecord;
  onClick: (record: WitnessRecord) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ record, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const displayTitle = record.activity_title || 'Witness Record';
  const witnessLabel = record.witness_names || 'Community witness';

  return (
    <div 
      onClick={() => onClick(record)}
      className="masonry-item group cursor-pointer bg-white transition-all duration-700 overflow-hidden border border-[#E5E1DD] hover:border-[#2D4F2D]/30 shadow-sm hover:shadow-2xl"
    >
      {record.supporting_media_raw && record.supporting_media_raw.length > 0 && !imageError ? (
        <div className="relative overflow-hidden aspect-[4/5] bg-[#F9F8F6]">
          <img 
            src={record.supporting_media_raw[0].url} 
            alt={displayTitle}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/5] bg-[#F9F8F6] flex items-center justify-center p-12 text-center border-b border-[#E5E1DD]">
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-10">Observed Moment</span>
        </div>
      )}

      <div className="p-10 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {record.area_of_contribution.map(area => (
              <span key={area} className="text-[7px] uppercase tracking-widest font-black px-2 py-0.5 border border-[#E5E1DD] text-[#A5A19D]">
                {area}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-3xl leading-tight text-[#1A1A1A] group-hover:text-[#2D4F2D] transition-colors tracking-tighter">
            {displayTitle}
          </h3>
          <h4 className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] font-bold opacity-30">
            <span>{witnessLabel}</span>
            <span className="w-1 h-1 bg-[#2D4F2D] rounded-full" />
            <span>{new Date(record.date_added).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })}</span>
          </h4>
        </div>

        <p className="text-base text-[#666] leading-relaxed line-clamp-3 font-serif italic font-light">
          "{record.reflection_notes}"
        </p>

        {/* Impact Insight Excerpts */}
        <div className="space-y-4 pt-2 border-t border-[#F9F8F6]">
          {record.why_it_matters && (
            <div className="space-y-1">
              <span className="text-[7px] uppercase tracking-[0.2em] font-black opacity-30 block">Why it matters</span>
              <p className="text-[11px] leading-relaxed text-[#888] line-clamp-2">{record.why_it_matters}</p>
            </div>
          )}
          {record.interconnectivity_potential && (
            <div className="space-y-1">
              <span className="text-[7px] uppercase tracking-[0.2em] font-black opacity-30 block">Interconnectivity</span>
              <p className="text-[11px] leading-relaxed text-[#888] line-clamp-2">{record.interconnectivity_potential}</p>
            </div>
          )}
          {record.intentions_for_next_cycle && (
            <div className="space-y-1">
              <span className="text-[7px] uppercase tracking-[0.2em] font-black opacity-30 block">Next Cycle</span>
              <p className="text-[11px] leading-relaxed text-[#888] line-clamp-2">{record.intentions_for_next_cycle}</p>
            </div>
          )}
          
          {record.org_title && (
            <div className="pt-2">
              <span className="text-[7px] uppercase tracking-[0.2em] font-black opacity-30 block mb-1">Related Organisation</span>
              {record.org_link ? (
                <a 
                  href={record.org_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-medium text-[#2D4F2D] border-b border-[#2D4F2D]/20 hover:border-[#2D4F2D] transition-all"
                >
                  {record.org_title} ↗
                </a>
              ) : (
                <span className="text-[10px] font-medium text-[#1A1A1A] opacity-60">{record.org_title}</span>
              )}
            </div>
          )}
        </div>

        <div className="pt-6 flex items-center gap-4">
           <span className="text-[8px] uppercase tracking-[0.3em] font-black text-[#A5A19D] group-hover:text-[#2D4F2D] transition-colors">Read Reflection</span>
           <div className="h-px bg-[#E5E1DD] flex-1 group-hover:bg-[#2D4F2D]/30 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
