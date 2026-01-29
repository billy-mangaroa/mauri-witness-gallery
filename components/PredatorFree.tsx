
import React, { useState, useMemo } from 'react';
import { EarthRecord } from '../types.ts';
import { parseEarthData } from '../data.ts';

interface PredatorMeta {
  title: string;
  image: string;
  destructiveReason: string;
  methods: string;
}

const PREDATOR_INFO: Record<string, PredatorMeta> = {
  'Possum': {
    title: 'Australian Brush-tailed Possum',
    image: 'https://images.unsplash.com/photo-1590691566903-692bf5ca278f?q=80&w=800&auto=format&fit=crop',
    destructiveReason: 'Possums are a major threat to New Zealand forests, stripping the canopy and preying on native bird eggs and chicks. They compete directly with native species for food.',
    methods: 'Live capture traps, leg-hold traps, and targeted baiting programs.'
  },
  'Stoat': {
    title: 'Stoats & Mustelids',
    image: 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?q=80&w=800&auto=format&fit=crop',
    destructiveReason: 'Stoats are the primary predators of many of New Zealand\'s most vulnerable bird species, including kiwi chicks. They are highly efficient hunters.',
    methods: 'DOC200 series traps, community-led trapping lines.'
  },
  'Rat': {
    title: 'Invasive Rats',
    image: 'https://images.unsplash.com/photo-1588661704283-8a3068710787?q=80&w=800&auto=format&fit=crop',
    destructiveReason: 'Rats consume seeds, fruits, and small invertebrates, disrupting the food chain. They also prey on the eggs and chicks of native birds.',
    methods: 'A24 self-resetting traps and targeted baiting.'
  },
  'Large Browser': {
    title: 'Large Browsers (Deer, Goats, Pigs)',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?q=80&w=800&auto=format&fit=crop',
    destructiveReason: 'These animals consume the forest understory, preventing the regeneration of native trees and destroying habitat for ground-dwelling species.',
    methods: 'Professional ground hunting and community culls.'
  },
  'Other': {
    title: 'Invasive Small Mammals',
    image: 'https://images.unsplash.com/photo-1510253687912-07622657f6a7?q=80&w=800&auto=format&fit=crop',
    destructiveReason: 'Hedgehogs, feral cats, and rabbits impact the ecosystem by preying on native insects and disturbing the soil balance.',
    methods: 'Targeted trapping and exclusion management.'
  }
};

const PredatorFree: React.FC = () => {
  const allRecords = useMemo(() => parseEarthData(), []);
  
  const [minYear, setMinYear] = useState(2022);
  const [maxYear, setMaxYear] = useState(2025);
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null);
  
  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => r.year >= minYear && r.year <= maxYear);
  }, [allRecords, minYear, maxYear]);

  // Derived Stats
  const totalCount = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.count, 0), [filteredRecords]);
  
  const speciesStats = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRecords.forEach(r => {
      map[r.speciesGroup] = (map[r.speciesGroup] || 0) + r.count;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredRecords]);

  const seasonalTrend = useMemo(() => {
    const seasons = {
      'Summer': { count: 0, color: '#E9C46A' }, // Dec, Jan, Feb
      'Autumn': { count: 0, color: '#F4A261' }, // Mar, Apr, May
      'Winter': { count: 0, color: '#264653' }, // Jun, Jul, Aug
      'Spring': { count: 0, color: '#2A9D8F' }  // Sep, Oct, Nov
    };

    filteredRecords.forEach(r => {
      // JS months: 0-11. 11 (Dec), 0 (Jan), 1 (Feb)
      if ([11, 0, 1].includes(r.month)) seasons['Summer'].count += r.count;
      else if ([2, 3, 4].includes(r.month)) seasons['Autumn'].count += r.count;
      else if ([5, 6, 7].includes(r.month)) seasons['Winter'].count += r.count;
      else if ([8, 9, 10].includes(r.month)) seasons['Spring'].count += r.count;
    });

    return Object.entries(seasons);
  }, [filteredRecords]);

  const peakSeason = useMemo(() => {
    const sorted = [...seasonalTrend].sort((a, b) => b[1].count - a[1].count);
    return sorted[0]?.[0] || 'N/A';
  }, [seasonalTrend]);

  const resetFilters = () => {
    setMinYear(2022);
    setMaxYear(2025);
  };

  return (
    <div className="space-y-16 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-tight">Predator Free Mangaroa</h2>
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">Restoring the Mauri of the Valley</p>
          </div>
          <p className="font-serif text-2xl text-[#555] leading-relaxed italic">
            "We are working towards a valley where native birdsong is the dominant sound, and our forests can regenerate without the heavy pressure of invasive browsers."
          </p>
          <div className="text-sm leading-relaxed text-[#666] max-w-lg">
            Our predator control program is a cornerstone of the Mangaroa regeneration project. By combining traditional field skills with modern data tracking, we are creating a sanctuary for our unique New Zealand biodiversity to return and thrive.
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-video shadow-2xl">
          <img 
            src="https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Trapping_Landscape.jpg?v=1712345678" 
            alt="Mangaroa Trapping" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop";
            }}
          />
        </div>
      </div>

      {/* Control Surface */}
      <div className="bg-[#F9F8F6] p-10 md:p-16 rounded-[24px] border border-[#E5E1DD] space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-[10px] uppercase tracking-widest font-black opacity-30">Active Timeline</h4>
               <span className="text-[10px] font-mono opacity-50">{minYear} — {maxYear}</span>
            </div>
            <div className="relative h-2 bg-[#E5E1DD] rounded-full">
              <input 
                type="range" 
                min="2022" 
                max="2025" 
                value={minYear} 
                onChange={(e) => setMinYear(Math.min(parseInt(e.target.value), maxYear))}
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer accent-[#2D4F2D]"
              />
              <input 
                type="range" 
                min="2022" 
                max="2025" 
                value={maxYear} 
                onChange={(e) => setMaxYear(Math.max(parseInt(e.target.value), minYear))}
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer accent-[#2D4F2D]"
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold opacity-30 pt-2">
              <span>2022 (Baseline)</span>
              <span>2023</span>
              <span>2024</span>
              <span>2025 (Active)</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={resetFilters}
              className="text-[9px] uppercase tracking-widest font-black text-[#2D4F2D] border-b border-[#2D4F2D] pb-1 transition-opacity hover:opacity-50"
            >
              Reset Timeline
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Predators Removed</h4>
            <span className="font-serif text-6xl tracking-tighter">{totalCount}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Peak Pressure Period</h4>
            <span className="font-serif text-4xl italic">{peakSeason}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Dominant Species</h4>
            <span className="font-serif text-3xl">{speciesStats[0]?.[0] || 'N/A'}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Monitoring Traps</h4>
            <span className="font-serif text-4xl">420+</span>
          </div>
        </div>
      </div>

      {/* Main Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Seasonal Trends */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Seasonal Capture Pulse</h3>
            <span className="text-[8px] uppercase tracking-widest font-bold opacity-20 italic">NZ Season Cycle</span>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {seasonalTrend.map(([season, data]) => (
              <div key={season} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-black opacity-40">{season}</span>
                    <p className="text-[8px] opacity-20 font-bold">
                      {season === 'Summer' && 'Dec - Feb'}
                      {season === 'Autumn' && 'Mar - May'}
                      {season === 'Winter' && 'Jun - Aug'}
                      {season === 'Spring' && 'Sep - Nov'}
                    </p>
                  </div>
                  <span className="font-serif text-3xl tracking-tighter">{data.count}</span>
                </div>
                <div className="h-2 bg-[#E5E1DD]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${totalCount > 0 ? (data.count / totalCount) * 100 : 0}%`,
                      backgroundColor: data.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-[#A5A19D] font-medium leading-relaxed italic pt-4">
            *Seasonal variations in capture rates reflect both animal behavior cycles and the intensity of seasonal culling operations.
          </p>
        </div>

        {/* Species Distribution Chart with Lightbox Hover */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Species Group Breakdown</h3>
            <span className="text-[8px] uppercase tracking-widest font-bold opacity-20 italic">Hover for Impact Details</span>
          </div>
          <div className="space-y-6 relative">
            {speciesStats.map(([group, count]) => (
              <div 
                key={group} 
                className="space-y-2 cursor-pointer group/bar"
                onMouseEnter={() => setHoveredSpecies(group)}
                onMouseLeave={() => setHoveredSpecies(null)}
              >
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold transition-colors group-hover/bar:text-[#2D4F2D]">
                  <span className="opacity-40">{group}</span>
                  <span>{count}</span>
                </div>
                <div className="h-4 bg-[#E5E1DD]/30 rounded-sm overflow-hidden border border-[#E5E1DD]">
                  <div 
                    className="h-full bg-[#2D4F2D] transition-all duration-1000 group-hover/bar:opacity-80"
                    style={{ width: `${totalCount > 0 ? (count / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Predator Lightbox/Tooltip */}
            {hoveredSpecies && PREDATOR_INFO[hoveredSpecies] && (
              <div className="absolute top-0 right-0 w-80 bg-white shadow-2xl border border-[#E5E1DD] rounded-[20px] overflow-hidden z-50 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-none">
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={PREDATOR_INFO[hoveredSpecies].image} 
                    alt={hoveredSpecies} 
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[11px] uppercase tracking-widest font-black text-[#2D4F2D]">{PREDATOR_INFO[hoveredSpecies].title}</h4>
                    <span className="text-[8px] uppercase tracking-widest font-bold opacity-30">Impact Profile</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] leading-relaxed text-[#666] font-serif italic">
                      {PREDATOR_INFO[hoveredSpecies].destructiveReason}
                    </p>
                    <div className="pt-3 border-t border-[#F1F1F1]">
                      <span className="text-[8px] uppercase tracking-widest font-black opacity-30 block mb-1">Control Methods</span>
                      <p className="text-[10px] leading-relaxed text-[#2D4F2D] font-bold">{PREDATOR_INFO[hoveredSpecies].methods}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insight Strip */}
      <div className="border-l-4 border-[#2D4F2D] pl-8 py-8 bg-[#FDFCFB] rounded-r-2xl shadow-sm">
         <p className="font-serif text-2xl italic text-[#1A1A1A] leading-relaxed">
            "By focusing our trapping efforts along the ridge lines and within the regenerating corridors, we are seeing a visible return of the native understory. The forest is beginning to speak again."
         </p>
      </div>

      {/* Export & Method Note */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-[#E5E1DD]">
        <div className="max-w-xl space-y-4">
           <h4 className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30 block">Methodology & Verifiable Evidence</h4>
           <p className="text-[11px] font-medium leading-relaxed text-[#A5A19D]">
             All predator removal data is logged at the moment of discovery. We use a combination of digital logging and paper-based backup systems to ensure the integrity of our environmental claims. This data is reviewed quarterly as part of our commitment to the Predator Free 2050 vision.
           </p>
        </div>
        <button 
          onClick={() => alert('Dataset prepared for export. Initiating CSV download...')}
          className="px-10 py-4 bg-[#2D4F2D] text-white text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-black transition-all shadow-lg"
        >
          Export Field Logs (.csv)
        </button>
      </div>
    </div>
  );
};

export default PredatorFree;
