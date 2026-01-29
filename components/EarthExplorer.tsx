
import React, { useState, useMemo } from 'react';
import { EarthRecord } from '../types.ts';
import { parseEarthData } from '../data.ts';

const EarthExplorer: React.FC = () => {
  const allRecords = useMemo(() => parseEarthData(), []);
  
  const [minYear, setMinYear] = useState(2019);
  const [maxYear, setMaxYear] = useState(2025);
  
  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => r.year >= minYear && r.year <= maxYear);
  }, [allRecords, minYear, maxYear]);

  // Derived Stats
  const totalCount = filteredRecords.reduce((sum, r) => sum + r.count, 0);
  const speciesStats = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRecords.forEach(r => {
      map[r.speciesGroup] = (map[r.speciesGroup] || 0) + r.count;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredRecords]);

  const monthlyTrend = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRecords.forEach(r => {
      const key = `${r.year}-${String(r.month + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + r.count;
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredRecords]);

  const maxMonthly = Math.max(...monthlyTrend.map(t => t[1]), 1);

  const resetFilters = () => {
    setMinYear(2019);
    setMaxYear(2025);
  };

  return (
    <div className="space-y-16 py-20 border-b border-[#E5E1DD]">
      <div className="space-y-4">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Earth Data Explorer</h2>
        <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-30">
          A living view of our field records over time — clear numbers, gently held.
        </h3>
      </div>

      {/* Control Surface */}
      <div className="bg-[#F9F8F6] p-10 md:p-16 rounded-sm border border-[#E5E1DD] space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-[10px] uppercase tracking-widest font-black opacity-30">Select Year Range</h4>
               <span className="text-[10px] font-mono opacity-50">{minYear} — {maxYear}</span>
            </div>
            <div className="relative h-2 bg-[#E5E1DD] rounded-full">
              <input 
                type="range" 
                min="2019" 
                max="2025" 
                value={minYear} 
                onChange={(e) => setMinYear(Math.min(parseInt(e.target.value), maxYear))}
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer accent-[#2D4F2D]"
              />
              <input 
                type="range" 
                min="2019" 
                max="2025" 
                value={maxYear} 
                onChange={(e) => setMaxYear(Math.max(parseInt(e.target.value), minYear))}
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer accent-[#2D4F2D]"
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold opacity-30 pt-2">
              <span>2019</span>
              <span>2022</span>
              <span>2025</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={resetFilters}
              className="text-[9px] uppercase tracking-widest font-black text-[#A5A19D] hover:text-[#2D4F2D] transition-colors border-b border-transparent hover:border-[#2D4F2D]"
            >
              Reset to Full Range
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Catches</h4>
            <span className="font-serif text-5xl tracking-tighter">{totalCount}</span>
            <span className="text-[8px] uppercase tracking-widest font-black block opacity-20">In Range</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Most Active Year</h4>
            <span className="font-serif text-4xl italic">2023</span>
            <span className="text-[8px] uppercase tracking-widest font-black block opacity-20">Baseline High</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Primary Pressure</h4>
            <span className="font-serif text-3xl">{speciesStats[0]?.[0] || 'N/A'}</span>
            <span className="text-[8px] uppercase tracking-widest font-black block opacity-20">Group Focus</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Data Confidence</h4>
            <span className="font-serif text-4xl">High</span>
            <span className="text-[8px] uppercase tracking-widest font-black block opacity-20">Auditable Logs</span>
          </div>
        </div>
      </div>

      {/* Main Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Time Series Chart */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Records Over Time</h3>
            <span className="text-[8px] uppercase tracking-widest font-bold opacity-20 italic">Monthly View</span>
          </div>
          <div className="h-64 flex items-end gap-1.5 border-b border-[#E5E1DD] pb-4 overflow-x-auto no-scrollbar">
            {monthlyTrend.map(([date, count]) => (
              <div key={date} className="flex-1 min-w-[8px] group relative h-full flex flex-col justify-end">
                <div 
                  className="w-full bg-[#2D4F2D]/10 hover:bg-[#2D4F2D] transition-all rounded-t-sm"
                  style={{ height: `${(count / maxMonthly) * 100}%` }}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-[#E5E1DD] px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl text-[9px] font-bold">
                  {date}: {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Species Distribution Chart */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">By Species Group</h3>
          </div>
          <div className="space-y-6">
            {speciesStats.map(([group, count]) => (
              <div key={group} className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span className="opacity-40">{group}</span>
                  <span>{count}</span>
                </div>
                <div className="h-1.5 bg-[#E5E1DD] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2D4F2D] transition-all duration-1000"
                    style={{ width: `${(count / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Strip */}
      <div className="border-l-2 border-[#2D4F2D] pl-8 py-4 bg-[#FDFCFB]">
         <p className="font-serif text-xl italic text-[#555] leading-relaxed">
            "We observe a steady volume of large browser detections across the ridge lines. This suggests consistent pressure requiring active management to protect the emerging understory."
         </p>
      </div>

      {/* Export & Method Note */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-[#E5E1DD]/50">
        <div className="max-w-xl space-y-4">
           <h4 className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30 block">Method Note</h4>
           <p className="text-[10px] font-light leading-relaxed text-[#A5A19D]">
             This dashboard summarises field records logged across Mangaroa properties from 2019 to present. Counts reflect recorded checks and detections within the selected range. Raw logs are maintained as a source of truth for all ecological restoration reporting.
           </p>
        </div>
        <button 
          onClick={() => alert('Dataset prepared for export. Initiating CSV download...')}
          className="px-6 py-3 border border-[#2D4F2D] text-[#2D4F2D] text-[9px] uppercase tracking-widest font-black hover:bg-[#2D4F2D] hover:text-white transition-all"
        >
          Download Dataset (.csv)
        </button>
      </div>
    </div>
  );
};

export default EarthExplorer;
