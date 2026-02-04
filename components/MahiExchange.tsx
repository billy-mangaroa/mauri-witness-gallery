
import React, { useState, useMemo } from 'react';

interface ParticipantRecord {
  name: string;
  nationality: string;
  arrivalDate: Date | null;
  departureDate: Date | null;
  totalDays: number;
  status: 'current' | 'departed' | 'upcoming';
}

interface WorkArea {
  code: string;
  name: string;
  hours: number;
  color: string;
}

const AREA_MAP: Record<string, { name: string; color: string }> = {
  'MG': { name: 'Market Garden', color: '#2D4F2D' },
  'PO': { name: 'Permaculture Orchard', color: '#4A7C4A' },
  'Res': { name: 'Restoration', color: '#6B8E6B' },
  'GK': { name: 'Groundskeeping', color: '#8BA88B' },
  'TWT': { name: 'Te Whare Toka', color: '#D4A373' },
  'Farm': { name: 'Farm Work', color: '#E9C46A' },
  'Shop': { name: 'Farm Shop', color: '#F4A261' },
  'CS': { name: 'Community Service', color: '#264653' },
  'SH': { name: 'Schoolhouse', color: '#2A9D8F' },
  'WK': { name: 'Te Whare Kai', color: '#E76F51' },
  'Nursery': { name: 'Native Nursery', color: '#457B9D' }
};

const TESTIMONIALS = [
  { quote: 'Being part of the land regeneration here changed how I see my relationship with nature.', name: 'Natalie', nationality: 'Canada', days: 116 },
  { quote: 'The community aspect is what made this experience unforgettable. Real connection, real work, real impact.', name: 'Raina', nationality: 'USA', days: 74 },
  { quote: 'Learning traditional farming alongside ecological restoration—this is the future of agriculture.', name: 'Emily', nationality: 'Canada', days: 161 },
  { quote: 'Every day felt purposeful. You are not just helping—you are becoming part of something bigger.', name: 'Vincent', nationality: 'Germany', days: 26 }
];

// Parse the mahi exchanger data
const MAHI_DATA: ParticipantRecord[] = [
  { name: 'Stephen', nationality: 'UK', arrivalDate: new Date(2024, 11, 14), departureDate: new Date(2025, 0, 3), totalDays: 20, status: 'departed' },
  { name: 'Molly', nationality: 'UK', arrivalDate: new Date(2025, 0, 6), departureDate: new Date(2025, 0, 31), totalDays: 25, status: 'departed' },
  { name: 'Ruby', nationality: 'USA', arrivalDate: new Date(2025, 1, 3), departureDate: new Date(2025, 1, 17), totalDays: 14, status: 'departed' },
  { name: 'Zoe', nationality: 'USA', arrivalDate: new Date(2025, 1, 4), departureDate: new Date(2025, 1, 18), totalDays: 14, status: 'departed' },
  { name: 'Natalie', nationality: 'Canada', arrivalDate: new Date(2025, 2, 1), departureDate: new Date(2025, 5, 15), totalDays: 106, status: 'departed' },
  { name: 'Luke', nationality: 'USA', arrivalDate: new Date(2025, 2, 13), departureDate: new Date(2025, 3, 10), totalDays: 28, status: 'departed' },
  { name: 'Pia', nationality: 'Chile', arrivalDate: new Date(2025, 4, 2), departureDate: new Date(2025, 5, 15), totalDays: 44, status: 'departed' },
  { name: 'Tom', nationality: 'USA', arrivalDate: new Date(2025, 4, 15), departureDate: new Date(2025, 6, 6), totalDays: 52, status: 'departed' },
  { name: 'Louison', nationality: 'Belgium', arrivalDate: new Date(2025, 4, 26), departureDate: new Date(2025, 5, 8), totalDays: 13, status: 'departed' },
  { name: 'Enoch', nationality: 'NZ', arrivalDate: new Date(2025, 5, 9), departureDate: new Date(2025, 6, 10), totalDays: 31, status: 'departed' },
  { name: 'Rachel', nationality: 'UK', arrivalDate: new Date(2025, 5, 13), departureDate: new Date(2025, 6, 8), totalDays: 25, status: 'departed' },
  { name: 'Raina', nationality: 'USA', arrivalDate: new Date(2025, 5, 25), departureDate: new Date(2025, 8, 7), totalDays: 74, status: 'departed' },
  { name: 'Innes', nationality: 'UK', arrivalDate: new Date(2025, 6, 20), departureDate: new Date(2025, 7, 21), totalDays: 32, status: 'departed' },
  { name: 'Charlie', nationality: 'UK', arrivalDate: new Date(2025, 6, 28), departureDate: new Date(2025, 7, 1), totalDays: 4, status: 'departed' },
  { name: 'Jackson', nationality: 'USA', arrivalDate: new Date(2025, 7, 11), departureDate: new Date(2025, 8, 10), totalDays: 30, status: 'departed' },
  { name: 'Einav', nationality: 'Israel', arrivalDate: new Date(2025, 7, 4), departureDate: new Date(2025, 7, 30), totalDays: 26, status: 'departed' },
  { name: 'Amber', nationality: 'UK', arrivalDate: new Date(2025, 7, 31), departureDate: new Date(2025, 8, 13), totalDays: 13, status: 'departed' },
  { name: 'Beth', nationality: 'UK', arrivalDate: new Date(2025, 7, 27), departureDate: new Date(2025, 8, 8), totalDays: 12, status: 'departed' },
  { name: 'Emily', nationality: 'Canada', arrivalDate: new Date(2025, 8, 8), departureDate: new Date(2026, 1, 16), totalDays: 161, status: 'current' },
  { name: 'Citlali', nationality: 'Netherlands', arrivalDate: new Date(2025, 9, 16), departureDate: new Date(2025, 10, 2), totalDays: 17, status: 'departed' },
  { name: 'Vincent', nationality: 'Germany', arrivalDate: new Date(2025, 9, 30), departureDate: new Date(2025, 10, 25), totalDays: 26, status: 'departed' },
  { name: 'Lorenzo', nationality: 'USA', arrivalDate: new Date(2025, 10, 3), departureDate: new Date(2025, 11, 13), totalDays: 40, status: 'departed' },
  { name: 'Tash', nationality: 'Germany', arrivalDate: new Date(2025, 10, 15), departureDate: new Date(2025, 11, 21), totalDays: 36, status: 'departed' },
  { name: 'Anna', nationality: 'Canada', arrivalDate: new Date(2025, 10, 11), departureDate: new Date(2025, 11, 21), totalDays: 40, status: 'departed' },
  { name: 'Emily', nationality: 'Canada', arrivalDate: new Date(2025, 10, 23), departureDate: new Date(2025, 11, 4), totalDays: 11, status: 'departed' },
  { name: 'Christophe', nationality: 'France', arrivalDate: new Date(2025, 11, 11), departureDate: new Date(2026, 1, 12), totalDays: 63, status: 'current' },
  { name: 'Eric', nationality: 'Germany', arrivalDate: new Date(2025, 11, 8), departureDate: new Date(2025, 11, 31), totalDays: 23, status: 'departed' },
  { name: 'Clara', nationality: 'Germany', arrivalDate: new Date(2025, 11, 8), departureDate: new Date(2025, 11, 31), totalDays: 23, status: 'departed' },
  { name: 'Tom', nationality: 'NZ', arrivalDate: new Date(2025, 11, 22), departureDate: new Date(2026, 1, 12), totalDays: 52, status: 'current' },
  { name: 'Tijana', nationality: 'Serbia', arrivalDate: new Date(2025, 10, 10), departureDate: new Date(2026, 1, 31), totalDays: 82, status: 'current' },
  { name: 'Vanessa', nationality: 'Canada', arrivalDate: new Date(2026, 1, 9), departureDate: new Date(2026, 1, 24), totalDays: 15, status: 'upcoming' }
];

// Work hours by area (aggregated from assignments)
const WORK_HOURS: WorkArea[] = [
  { code: 'MG', name: 'Market Garden', hours: 1847, color: '#2D4F2D' },
  { code: 'Res', name: 'Restoration', hours: 412, color: '#6B8E6B' },
  { code: 'PO', name: 'Permaculture Orchard', hours: 389, color: '#4A7C4A' },
  { code: 'GK', name: 'Groundskeeping', hours: 298, color: '#8BA88B' },
  { code: 'Farm', name: 'Farm Work', hours: 276, color: '#E9C46A' },
  { code: 'TWT', name: 'Te Whare Toka', hours: 89, color: '#D4A373' },
  { code: 'Shop', name: 'Farm Shop', hours: 67, color: '#F4A261' },
  { code: 'Other', name: 'Other Activities', hours: 156, color: '#264653' }
];

const MahiExchange: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'departed'>('current');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const stats = useMemo(() => {
    const totalParticipants = MAHI_DATA.length;
    const totalDays = MAHI_DATA.reduce((sum, p) => sum + p.totalDays, 0);
    const nationalities = new Set(MAHI_DATA.map(p => p.nationality)).size;
    const totalHours = WORK_HOURS.reduce((sum, w) => sum + w.hours, 0);
    const current = MAHI_DATA.filter(p => p.status === 'current').length;
    const avgStay = Math.round(totalDays / totalParticipants);
    
    return { totalParticipants, totalDays, nationalities, totalHours, current, avgStay };
  }, []);

  const filteredPeople = useMemo(() => {
    if (activeTab === 'current') {
      return MAHI_DATA.filter(p => p.status === 'current' || p.status === 'upcoming');
    }
    return MAHI_DATA.filter(p => p.status === 'departed').slice(-12).reverse();
  }, [activeTab]);

  const maxHours = Math.max(...WORK_HOURS.map(w => w.hours));

  return (
    <div data-reveal className="space-y-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-tight">Community Contribution</h2>
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">Live, Learn & Contribute</p>
          </div>
          <p className="font-serif text-2xl text-[#555] leading-relaxed italic">
            "A shared exchange of energy — where people contribute meaningful work in return for immersion in regenerative land practice."
          </p>
          <div className="text-sm leading-relaxed text-[#666] max-w-lg">
            Our community contribution programme welcomes people from around the world to live and work at Mangaroa Farms. In return for 20-25 hours of hands-on contribution per week, participants receive accommodation, meals, and deep connection to the land and community.
          </div>
          <a 
            href="https://mangaroa.org/mahi-exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#2D4F2D] text-white text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-black transition-all shadow-lg"
          >
            Apply for Community Contribution
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
        
        {/* Testimonial Card */}
        <div className="relative">
          <div className="bg-gradient-to-br from-[#2D4F2D] to-[#1A3A1A] text-white p-10 rounded-3xl shadow-2xl">
            <div className="space-y-6">
              <svg className="w-10 h-10 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-serif text-xl md:text-2xl leading-relaxed">
                {TESTIMONIALS[testimonialIndex].quote}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <p className="font-bold">{TESTIMONIALS[testimonialIndex].name}</p>
                  <p className="text-sm opacity-70">{TESTIMONIALS[testimonialIndex].nationality} · {TESTIMONIALS[testimonialIndex].days} days</p>
                </div>
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Similar to Earth page */}
      <div className="bg-[#F9F8F6] p-10 md:p-16 rounded-[24px] border border-[#E5E1DD] space-y-12">
        <div className="flex justify-between items-center">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Programme Impact · 2024-2026</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Participants</h4>
            <span className="font-serif text-6xl tracking-tighter">{stats.totalParticipants}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Nationalities</h4>
            <span className="font-serif text-6xl tracking-tighter">{stats.nationalities}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Days Contributed</h4>
            <span className="font-serif text-5xl tracking-tighter">{stats.totalDays.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Avg. Stay (Days)</h4>
            <span className="font-serif text-6xl tracking-tighter">{stats.avgStay}</span>
          </div>
        </div>
      </div>

      {/* Work Areas Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Hours by Focus Area</h3>
            <span className="text-[8px] uppercase tracking-widest font-bold opacity-20">{stats.totalHours.toLocaleString()} Total Hours</span>
          </div>
          
          <div className="space-y-4">
            {WORK_HOURS.map((area) => (
              <div key={area.code} className="space-y-2">
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="opacity-60">{area.name}</span>
                  <span>{area.hours.toLocaleString()} hrs</span>
                </div>
                <div className="h-3 bg-[#E5E1DD]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(area.hours / maxHours) * 100}%`,
                      backgroundColor: area.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* People Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Participants</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-full transition-all ${
                  activeTab === 'current' 
                    ? 'bg-[#2D4F2D] text-white' 
                    : 'bg-[#E5E1DD]/50 text-[#666] hover:bg-[#E5E1DD]'
                }`}
              >
                Current ({MAHI_DATA.filter(p => p.status === 'current').length})
              </button>
              <button
                onClick={() => setActiveTab('departed')}
                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-full transition-all ${
                  activeTab === 'departed' 
                    ? 'bg-[#2D4F2D] text-white' 
                    : 'bg-[#E5E1DD]/50 text-[#666] hover:bg-[#E5E1DD]'
                }`}
              >
                Alumni
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-[#E5E1DD] overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#F9F8F6] border-b border-[#E5E1DD]">
              <span className="text-[9px] uppercase tracking-widest font-black opacity-40">Name</span>
              <span className="text-[9px] uppercase tracking-widest font-black opacity-40">Origin</span>
              <span className="text-[9px] uppercase tracking-widest font-black opacity-40 text-right">Days</span>
            </div>
            <div className="divide-y divide-[#E5E1DD]/50 max-h-[320px] overflow-y-auto">
              {filteredPeople.map((person, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 p-4 hover:bg-[#F9F8F6]/50 transition-colors">
                  <span className="text-sm font-medium truncate">{person.name}</span>
                  <span className="text-sm text-[#888]">{person.nationality}</span>
                  <span className="text-sm text-right font-mono">{person.totalDays}</span>
                </div>
              ))}
            </div>
          </div>
          
          {activeTab === 'departed' && (
            <p className="text-[9px] text-[#A5A19D] italic">Showing most recent 12 alumni</p>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#2D4F2D] to-[#1A3A1A] p-12 rounded-3xl text-white text-center space-y-6">
        <h3 className="font-serif text-3xl md:text-4xl">Ready to contribute?</h3>
        <p className="text-white/80 max-w-xl mx-auto">
          Join our community of regenerative practitioners. Minimum stay is 2 weeks, with most participants staying 4-8 weeks.
        </p>
        <a 
          href="https://mangaroa.org/mahi-exchange"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#2D4F2D] text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-[#E9C46A] transition-all shadow-lg"
        >
          Start Your Application
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MahiExchange;
