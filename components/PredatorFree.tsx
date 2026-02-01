
import React, { useState, useMemo } from 'react';
import { EarthRecord } from '../types.ts';
import { parseEarthData } from '../data.ts';

interface PredatorMeta {
  title: string;
  image: string;
  destructiveReason: string;
  methods: string;
}

interface SeasonMeta {
  count: number;
  color: string;
  label: string;
  narrative: string;
}

const PREDATOR_INFO: Record<string, PredatorMeta> = {
  'Possum': {
    title: 'Australian Brush-tailed Possum',
    image: 'https://mangaroa-impact-site.b-cdn.net/possum.png',
    destructiveReason: 'Possums are a major threat to New Zealand forests, stripping the canopy and preying on native bird eggs and chicks. They compete directly with native species for food.',
    methods: 'Live capture traps, leg-hold traps, and targeted baiting programs.'
  },
  'Rat/Stoat': {
    title: 'Stoats & Mustelids',
    image: 'https://mangaroa-impact-site.b-cdn.net/stoat.png',
    destructiveReason: 'Stoats are the primary predators of many of New Zealand\'s most vulnerable bird species, including kiwi chicks. They are highly efficient hunters that can decimate entire populations.',
    methods: 'DOC200 series traps, A24 self-resetting traps, and community-led trapping lines.'
  },
  'Large Browser': {
    title: 'Large Browsers (Deer, Goats, Pigs)',
    image: 'https://mangaroa-impact-site.b-cdn.net/deer.png',
    destructiveReason: 'These animals consume the forest understory, preventing the regeneration of native trees and destroying habitat for ground-dwelling species.',
    methods: 'Professional ground hunting and community culls.'
  },
  'Other': {
    title: 'Invasive Small Mammals',
    image: 'https://mangaroa-impact-site.b-cdn.net/hedgehog.png',
    destructiveReason: 'Hedgehogs, feral cats, and rabbits impact the ecosystem by preying on native insects, bird eggs, and disturbing the soil balance.',
    methods: 'Targeted trapping and exclusion management.'
  }
};

const PredatorFree: React.FC = () => {
  const allRecords = useMemo(() => parseEarthData(), []);
  
  const [minYear, setMinYear] = useState(2019);
  const [maxYear, setMaxYear] = useState(2025);
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null);
  const [hoveredSeason, setHoveredSeason] = useState<string | null>(null);
  
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
    const seasons: Record<string, SeasonMeta> = {
      'Summer': { 
        count: 0, 
        color: '#E9C46A',
        label: 'Dec – Feb',
        narrative: 'Warm nights, high movement. Possums, rats and hedgehogs are highly active and quickly find unprotected food sources.'
      },
      'Autumn': { 
        count: 0, 
        color: '#F4A261',
        label: 'Mar – May',
        narrative: 'Autumn is when we lean into landscape-scale culls, targeting browsers before winter browsing pressure bites hardest.'
      },
      'Winter': { 
        count: 0, 
        color: '#264653',
        label: 'Jun – Aug',
        narrative: 'Cold months compress movement along warm gullies and ridgelines, making traps and thermal-assisted hunts more efficient.'
      },
      'Spring': { 
        count: 0, 
        color: '#2A9D8F',
        label: 'Sep – Nov',
        narrative: 'Nesting season. Reducing mustelids and rats now gives native chicks their best chance to make it through their first weeks.'
      }
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

  const resetFilters = () => {
    setMinYear(2019);
    setMaxYear(2025);
  };

  return (
    <div data-reveal className="space-y-16 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-tight">Predator Free Mangaroa</h2>
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">Restoring the Mauri of the Valley</p>
          </div>
          <p className="font-serif text-2xl text-[#555] leading-relaxed italic">
            "We are working towards a valley where native birdsong is the dominant sound, and our forests can regenerate without the heavy pressure of invasive browsers."
          </p>
          <div className="bg-[#2D4F2D] text-white p-6 rounded-2xl max-w-lg space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">The Challenge</p>
            <p className="text-lg leading-relaxed">
              Every night in Aotearoa, around <span className="font-bold text-[#E9C46A]">68,000 native birds</span> are killed by introduced predators — more than <span className="font-bold text-[#E9C46A]">25 million every year</span>.
            </p>
          </div>
          <div className="text-sm leading-relaxed text-[#666] max-w-lg">
            Our predator control program is a cornerstone of the Mangaroa regeneration project. By combining traditional field skills with modern data tracking, we are creating a sanctuary for our unique New Zealand biodiversity to return and thrive.
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
          <img 
            src="https://mangaroa-impact-site.b-cdn.net/Screenshot%202026-01-30%20at%202.50.57%E2%80%AFPM.png" 
            alt="Mangaroa Trapping" 
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="w-full h-full object-cover object-[center_30%]"
          />
        </div>
      </div>

      {/* Control Surface */}
      <div className="bg-[#F9F8F6] p-10 md:p-16 rounded-[24px] border border-[#E5E1DD] space-y-12">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] uppercase tracking-widest font-black opacity-30">Select Year Range</h4>
            <button 
              onClick={resetFilters}
              className="text-[9px] uppercase tracking-widest font-bold text-[#2D4F2D] opacity-60 hover:opacity-100 transition-opacity"
            >
              Reset
            </button>
          </div>
          
          {/* Timeline Slider */}
          <div className="relative py-8 px-4">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-[#2D4F2D]/80 -translate-y-1/2" />
            
            {/* Year nodes */}
            <div className="relative flex justify-between items-center">
              {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => {
                const isInRange = year >= minYear && year <= maxYear;
                
                return (
                  <button
                    key={year}
                    onClick={() => {
                      if (year < minYear) {
                        setMinYear(year);
                      } else if (year > maxYear) {
                        setMaxYear(year);
                      } else if (year === minYear && year < maxYear) {
                        setMinYear(year + 1);
                      } else if (year === maxYear && year > minYear) {
                        setMaxYear(year - 1);
                      } else if (year > minYear && year < maxYear) {
                        setMinYear(year);
                        setMaxYear(year);
                      }
                    }}
                    className="relative flex flex-col items-center group"
                  >
                    {/* Node circle */}
                    <div className={`
                      w-4 h-4 rounded-full border-2 border-[#2D4F2D] transition-all duration-300 ease-out
                      ${isInRange 
                        ? 'bg-[#2D4F2D] scale-110' 
                        : 'bg-[#F9F8F6] group-hover:bg-[#2D4F2D]/20'
                      }
                    `} />
                    
                    {/* Year label */}
                    <span className={`
                      absolute top-8 transition-all duration-300
                      ${isInRange 
                        ? 'text-[#2D4F2D] font-bold text-base' 
                        : 'text-[#999] font-medium text-sm'
                      }
                    `}>
                      {year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Predators Removed</h4>
            <span className="font-serif text-6xl tracking-tighter">{totalCount}</span>
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
        <div className="space-y-8 relative">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Seasonal Capture Pulse</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {seasonalTrend.map(([season, data]) => {
              const icons: Record<string, React.ReactNode> = {
                Summer: (
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ),
                Autumn: (
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22V8M12 8C12 8 8 12 5 10C2 8 4 4 7 3C10 2 12 5 12 8Z" />
                    <path d="M12 8C12 8 16 12 19 10C22 8 20 4 17 3C14 2 12 5 12 8Z" />
                  </svg>
                ),
                Winter: (
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M8 19v1M8 14v1M12 21v1M12 16v1M16 19v1M16 14v1" />
                  </svg>
                ),
                Spring: (
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22v-7" />
                    <path d="M9 19h6" />
                    <path d="M12 15c-3.5 0-6-2.5-6-6 0-4 3-6 6-6s6 2 6 6c0 3.5-2.5 6-6 6z" />
                    <path d="M12 9v2" />
                  </svg>
                )
              };
              
              return (
                <div 
                  key={season}
                  onMouseEnter={() => setHoveredSeason(season)}
                  onMouseLeave={() => setHoveredSeason(null)}
                  className={`
                    relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                    ${hoveredSeason === season 
                      ? 'border-current shadow-lg scale-[1.02]' 
                      : 'border-[#E5E1DD] hover:border-current/30'
                    }
                  `}
                  style={{ color: data.color }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="opacity-90">
                      {icons[season]}
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold text-[#333]">{season}</span>
                    </div>
                    <div className="font-serif text-4xl tracking-tighter text-[#1A1A1A]">
                      {data.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Season Lightbox */}
          {hoveredSeason && (
            <div className="absolute top-0 left-full ml-6 w-72 bg-white/95 backdrop-blur-md shadow-2xl border border-[#E5E1DD] rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-none">
              {(() => {
                const seasonData = seasonalTrend.find(([s]) => s === hoveredSeason)?.[1];
                if (!seasonData) return null;
                return (
                  <div className="p-6 space-y-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${seasonData.color}20`, color: seasonData.color }}
                    >
                      {hoveredSeason === 'Summer' && (
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                      )}
                      {hoveredSeason === 'Autumn' && (
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22V8M12 8C12 8 8 12 5 10C2 8 4 4 7 3C10 2 12 5 12 8Z" />
                          <path d="M12 8C12 8 16 12 19 10C22 8 20 4 17 3C14 2 12 5 12 8Z" />
                        </svg>
                      )}
                      {hoveredSeason === 'Winter' && (
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                          <path d="M8 19v1M8 14v1M12 21v1M12 16v1M16 19v1M16 14v1" />
                        </svg>
                      )}
                      {hoveredSeason === 'Spring' && (
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22v-7" />
                          <path d="M9 19h6" />
                          <path d="M12 15c-3.5 0-6-2.5-6-6 0-4 3-6 6-6s6 2 6 6c0 3.5-2.5 6-6 6z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold opacity-50 block mb-1">{seasonData.label}</span>
                      <h4 className="font-serif text-2xl text-[#1A1A1A]">{hoveredSeason}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-[#555]">
                      {seasonData.narrative}
                    </p>
                    <div className="pt-3 border-t border-[#E5E1DD]">
                      <span className="text-xs uppercase tracking-widest font-bold opacity-40 block mb-1">Captures</span>
                      <span className="font-serif text-3xl" style={{ color: seasonData.color }}>{seasonData.count}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Species Distribution Chart with Lightbox Hover */}
        <div className="space-y-8 relative">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Species Group Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {speciesStats.map(([group, count]) => (
              <div 
                key={group}
                onMouseEnter={() => setHoveredSpecies(group)}
                onMouseLeave={() => setHoveredSpecies(null)}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                  ${hoveredSpecies === group 
                    ? 'border-[#2D4F2D] shadow-lg scale-[1.02]' 
                    : 'border-[#E5E1DD] hover:border-[#2D4F2D]/30'
                  }
                `}
              >
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#333]">
                    {group}{group === 'Large Browser' && <span className="opacity-50"> (DEER, GOATS, PIGS)</span>}
                  </span>
                  <div className="h-2 bg-[#E5E1DD]/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#2D4F2D] transition-all duration-1000"
                      style={{ width: `${totalCount > 0 ? (count / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="font-serif text-4xl tracking-tighter text-[#1A1A1A]">
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Predator Lightbox/Tooltip */}
          {hoveredSpecies && PREDATOR_INFO[hoveredSpecies] && (
            <div className="absolute top-0 right-full mr-6 w-80 bg-white/95 backdrop-blur-md shadow-2xl border border-[#E5E1DD] rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-none">
              <div className="relative aspect-[4/3] bg-black/10 overflow-hidden">
                <img 
                  src={PREDATOR_INFO[hoveredSpecies].image} 
                  alt={hoveredSpecies} 
                  loading="lazy"
                  decoding="async"
                  sizes="320px"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-80 mb-1">
                    {hoveredSpecies}
                  </p>
                  <p className="font-serif text-xl leading-tight drop-shadow">
                    {PREDATOR_INFO[hoveredSpecies].title}
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-black opacity-40 block">
                    Impact on Mauri
                  </span>
                  <p className="text-xs leading-relaxed text-[#555]">
                    {PREDATOR_INFO[hoveredSpecies].destructiveReason}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E5E1DD] space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-black opacity-40 block">
                    Field Response
                  </span>
                  <p className="text-xs leading-relaxed text-[#2D4F2D] font-medium">
                    {PREDATOR_INFO[hoveredSpecies].methods}
                  </p>
                </div>
              </div>
            </div>
          )}
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
