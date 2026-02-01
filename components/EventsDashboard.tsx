
import React, { useState, useMemo, useEffect } from 'react';
import { EventRecord } from '../types.ts';
import { fetchEvents } from '../data.ts';

interface YearStats {
  year: number;
  totalEvents: number;
  totalAttendees: number;
  eventTypes: Record<string, number>;
  biggestEvent: EventRecord | null;
}

// Mock data for demonstration (used when Airtable returns empty)
const MOCK_EVENTS: EventRecord[] = [
  {
    id: 'evt-1',
    event_name: 'Matariki Dawn Ceremony',
    event_date: '2025-07-10',
    event_type: 'Ceremony',
    description: 'A dawn gathering to welcome the Māori New Year with karakia, waiata, and shared kai.',
    attendees: 85,
    location: 'Mangaroa Valley',
    highlight: true,
    partners: ['Ngāti Toa', 'Local Schools'],
    year: 2025,
    photos: [{ id: 'p1', url: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/DSC00252.jpg?v=1721467642' }]
  },
  {
    id: 'evt-2',
    event_name: 'Winter Planting Day',
    event_date: '2025-06-15',
    event_type: 'Volunteer Day',
    description: 'Community planting of 500 native seedlings along the riparian margins.',
    attendees: 42,
    location: 'Stream Restoration Zone',
    highlight: true,
    partners: ['GWRC', 'Forest & Bird'],
    year: 2025,
    photos: [{ id: 'p2', url: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Tree_Planting.jpg?v=1754355799' }]
  },
  {
    id: 'evt-3',
    event_name: 'Regenerative Agriculture Workshop',
    event_date: '2025-05-20',
    event_type: 'Workshop',
    description: 'Hands-on workshop covering soil health, cover cropping, and holistic grazing.',
    attendees: 28,
    location: 'Te Whare Toka',
    highlight: false,
    partners: ['GroundTruth'],
    year: 2025
  },
  {
    id: 'evt-4',
    event_name: 'Farm to Table Dinner',
    event_date: '2025-04-12',
    event_type: 'Social',
    description: 'A celebration of seasonal harvest with local chefs and farm produce.',
    attendees: 65,
    location: 'Te Whare Kai',
    highlight: true,
    partners: ['Local Chefs Collective'],
    year: 2025,
    photos: [{ id: 'p3', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' }]
  },
  {
    id: 'evt-5',
    event_name: 'School Education Programme',
    event_date: '2025-03-08',
    event_type: 'Education',
    description: 'Week-long programme hosting 3 local schools for ecological learning.',
    attendees: 120,
    location: 'Schoolhouse & Farm',
    highlight: true,
    partners: ['Ministry of Education', 'Enviroschools'],
    year: 2025,
    photos: [{ id: 'p4', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800' }]
  },
  {
    id: 'evt-6',
    event_name: 'Summer Solstice Gathering',
    event_date: '2024-12-21',
    event_type: 'Ceremony',
    description: 'Marking the longest day with reflection, music, and community.',
    attendees: 95,
    location: 'Mangaroa Valley',
    highlight: true,
    year: 2024,
    photos: [{ id: 'p5', url: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=800' }]
  },
  {
    id: 'evt-7',
    event_name: 'Harvest Festival',
    event_date: '2024-03-15',
    event_type: 'Festival',
    description: 'Annual celebration of abundance featuring market stalls, music, and farm tours.',
    attendees: 250,
    location: 'Mangaroa Farms',
    highlight: true,
    year: 2024,
    photos: [{ id: 'p6', url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800' }]
  },
  {
    id: 'evt-8',
    event_name: 'Predator Free Workshop',
    event_date: '2024-02-10',
    event_type: 'Workshop',
    description: 'Training community members in trap maintenance and predator identification.',
    attendees: 35,
    location: 'Community Centre',
    year: 2024
  },
  {
    id: 'evt-9',
    event_name: 'Native Plant Nursery Open Day',
    event_date: '2024-09-22',
    event_type: 'Open Day',
    description: 'Public tour of our native plant nursery with expert guidance on restoration planting.',
    attendees: 78,
    location: 'Native Nursery',
    highlight: true,
    year: 2024,
    photos: [{ id: 'p7', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800' }]
  },
  {
    id: 'evt-10',
    event_name: 'Wetland Bird Count',
    event_date: '2023-11-05',
    event_type: 'Monitoring',
    description: 'Citizen science bird monitoring across restored wetland areas.',
    attendees: 22,
    location: 'Wetland Reserve',
    year: 2023
  },
  {
    id: 'evt-11',
    event_name: 'Community Planting Day - Spring',
    event_date: '2023-09-18',
    event_type: 'Volunteer Day',
    description: 'Major riparian planting event with 1,200 natives planted.',
    attendees: 68,
    location: 'Stream Margins',
    highlight: true,
    year: 2023,
    photos: [{ id: 'p8', url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800' }]
  },
  {
    id: 'evt-12',
    event_name: 'Inaugural Harvest Festival',
    event_date: '2023-03-12',
    event_type: 'Festival',
    description: 'Our first major community festival celebrating the autumn harvest.',
    attendees: 180,
    location: 'Mangaroa Farms',
    highlight: true,
    year: 2023
  },
  {
    id: 'evt-13',
    event_name: 'Soil Health Field Day',
    event_date: '2022-10-08',
    event_type: 'Workshop',
    description: 'Technical field day exploring soil biology and regenerative practices.',
    attendees: 45,
    location: 'Farm Paddocks',
    year: 2022
  },
  {
    id: 'evt-14',
    event_name: 'Community Launch Event',
    event_date: '2022-02-20',
    event_type: 'Social',
    description: 'Official launch of Mangaroa Farms regenerative vision with community partners.',
    attendees: 110,
    location: 'Te Whare Kai',
    highlight: true,
    year: 2022,
    photos: [{ id: 'p9', url: 'https://images.unsplash.com/photo-1529543544277-f3bc09bb7ab4?w=800' }]
  }
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  'Ceremony': '#7B68EE',
  'Workshop': '#2D4F2D',
  'Volunteer Day': '#4A7C4A',
  'Festival': '#E9C46A',
  'Education': '#2A9D8F',
  'Social': '#F4A261',
  'Open Day': '#457B9D',
  'Monitoring': '#6B8E6B',
  'default': '#264653'
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EventsDashboard: React.FC = () => {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEvents();
        setEvents(data.length > 0 ? data : MOCK_EVENTS);
      } catch {
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Calculate year-by-year statistics
  const yearStats = useMemo((): YearStats[] => {
    const statsMap = new Map<number, YearStats>();
    
    events.forEach(event => {
      const year = event.year;
      if (!statsMap.has(year)) {
        statsMap.set(year, {
          year,
          totalEvents: 0,
          totalAttendees: 0,
          eventTypes: {},
          biggestEvent: null
        });
      }
      
      const stats = statsMap.get(year)!;
      stats.totalEvents++;
      stats.totalAttendees += event.attendees || 0;
      stats.eventTypes[event.event_type] = (stats.eventTypes[event.event_type] || 0) + 1;
      
      if (!stats.biggestEvent || (event.attendees || 0) > (stats.biggestEvent.attendees || 0)) {
        stats.biggestEvent = event;
      }
    });
    
    return Array.from(statsMap.values()).sort((a, b) => b.year - a.year);
  }, [events]);

  // Overall stats
  const overallStats = useMemo(() => {
    const totalEvents = events.length;
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
    const yearsActive = new Set(events.map(e => e.year)).size;
    const avgAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;
    const uniqueTypes = new Set(events.map(e => e.event_type)).size;
    
    return { totalEvents, totalAttendees, yearsActive, avgAttendance, uniqueTypes };
  }, [events]);

  // Filtered events by year
  const filteredEvents = useMemo(() => {
    if (selectedYear === 'all') return events;
    return events.filter(e => e.year === selectedYear);
  }, [events, selectedYear]);

  // Photo highlights
  const highlights = useMemo(() => {
    return events
      .filter(e => e.highlight && e.photos && e.photos.length > 0)
      .slice(0, 8);
  }, [events]);

  // Top events by attendance
  const topEvents = useMemo(() => {
    return [...events]
      .filter(e => e.attendees && e.attendees > 0)
      .sort((a, b) => (b.attendees || 0) - (a.attendees || 0))
      .slice(0, 5);
  }, [events]);

  // Events by type for chart
  const eventsByType = useMemo(() => {
    const typeMap: Record<string, number> = {};
    filteredEvents.forEach(e => {
      typeMap[e.event_type] = (typeMap[e.event_type] || 0) + 1;
    });
    return Object.entries(typeMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEvents]);

  const availableYears = useMemo(() => {
    return (Array.from(new Set(events.map(e => e.year))) as number[]).sort((a, b) => b - a);
  }, [events]);

  if (loading) {
    return (
      <div className="py-40 text-center opacity-20">
        <div className="inline-block w-8 h-8 border border-[#2D4F2D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Loading Events...</p>
      </div>
    );
  }

  return (
    <div data-reveal className="space-y-20">
      {/* Hero Section */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-tight">Events & Gatherings</h2>
          <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
            Community moments that shape our story
          </p>
        </div>
        <p className="font-serif text-2xl text-[#555] leading-relaxed italic max-w-3xl">
          "The valley comes alive through shared experience — workshops, ceremonies, planting days, and celebrations 
          that weave our community into the fabric of this land."
        </p>
      </div>

      {/* Overall Stats Dashboard */}
      <div className="bg-gradient-to-br from-[#F9F8F6] to-[#F0EDE8] p-10 md:p-16 rounded-[32px] border border-[#E5E1DD] space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Events Rollup · All Time</h3>
          <a 
            href="https://mangaroa.org/upcoming-events"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D4F2D] text-white text-[9px] uppercase tracking-widest font-black rounded-full hover:bg-black transition-all"
          >
            View Upcoming Events
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Events</span>
            <span className="font-serif text-6xl tracking-tighter text-[#2D4F2D]">{overallStats.totalEvents}</span>
          </div>
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Total Attendees</span>
            <span className="font-serif text-5xl tracking-tighter">{overallStats.totalAttendees.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Years Active</span>
            <span className="font-serif text-6xl tracking-tighter">{overallStats.yearsActive}</span>
          </div>
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Avg. Attendance</span>
            <span className="font-serif text-6xl tracking-tighter">{overallStats.avgAttendance}</span>
          </div>
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest opacity-30 font-bold block">Event Types</span>
            <span className="font-serif text-6xl tracking-tighter">{overallStats.uniqueTypes}</span>
          </div>
        </div>
      </div>

      {/* Photo Highlights Carousel */}
      {highlights.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Photo Highlights</h3>
            <div className="flex gap-2">
              {highlights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHighlightIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === highlightIndex ? 'bg-[#2D4F2D] scale-125' : 'bg-[#E5E1DD] hover:bg-[#ccc]'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-[28px] bg-black aspect-[21/9]">
            {highlights[highlightIndex] && (
              <>
                <img
                  src={highlights[highlightIndex].photos?.[0]?.url}
                  alt={highlights[highlightIndex].event_name}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                  <div className="flex items-end justify-between gap-8">
                    <div className="space-y-3">
                      <span 
                        className="inline-block px-3 py-1 text-[9px] uppercase tracking-widest font-black rounded-full"
                        style={{ backgroundColor: EVENT_TYPE_COLORS[highlights[highlightIndex].event_type] || EVENT_TYPE_COLORS.default }}
                      >
                        {highlights[highlightIndex].event_type}
                      </span>
                      <h4 className="font-serif text-3xl md:text-5xl tracking-tight">
                        {highlights[highlightIndex].event_name}
                      </h4>
                      <p className="text-white/70 max-w-xl text-sm leading-relaxed">
                        {highlights[highlightIndex].description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-serif text-5xl tracking-tighter">
                        {highlights[highlightIndex].attendees?.toLocaleString()}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest opacity-60 mt-1">Attendees</div>
                      <div className="text-sm opacity-70 mt-3">
                        {new Date(highlights[highlightIndex].event_date).toLocaleDateString('en-NZ', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Navigation Arrows */}
            <button
              onClick={() => setHighlightIndex(i => (i - 1 + highlights.length) % highlights.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setHighlightIndex(i => (i + 1) % highlights.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Year Selector & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Year by Year Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Year by Year</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedYear('all')}
                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-full transition-all ${
                  selectedYear === 'all' 
                    ? 'bg-[#2D4F2D] text-white' 
                    : 'bg-[#E5E1DD]/50 text-[#666] hover:bg-[#E5E1DD]'
                }`}
              >
                All Years
              </button>
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-full transition-all ${
                    selectedYear === year 
                      ? 'bg-[#2D4F2D] text-white' 
                      : 'bg-[#E5E1DD]/50 text-[#666] hover:bg-[#E5E1DD]'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Year Stats Cards */}
          <div className="space-y-4">
            {yearStats.map(stats => (
              <div 
                key={stats.year}
                className={`bg-white rounded-2xl border border-[#E5E1DD] p-6 transition-all ${
                  selectedYear !== 'all' && selectedYear !== stats.year ? 'opacity-40' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <span className="font-serif text-5xl tracking-tighter text-[#2D4F2D]">{stats.year}</span>
                  </div>
                  
                  <div className="flex-grow grid grid-cols-3 gap-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Events</span>
                      <span className="font-serif text-3xl">{stats.totalEvents}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Attendees</span>
                      <span className="font-serif text-3xl">{stats.totalAttendees.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Biggest Event</span>
                      <span className="text-sm font-medium truncate block">
                        {stats.biggestEvent?.event_name || '—'}
                      </span>
                      {stats.biggestEvent?.attendees && (
                        <span className="text-[10px] opacity-50">({stats.biggestEvent.attendees} people)</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Event Types Mini Chart */}
                  <div className="flex-shrink-0 flex gap-1">
                    {Object.entries(stats.eventTypes).slice(0, 4).map(([type, count]) => {
                      const countValue = Number(count);
                      return (
                      <div 
                        key={type}
                        className="w-3 rounded-full"
                        style={{ 
                          height: `${Math.max(20, countValue * 15)}px`,
                          backgroundColor: EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default
                        }}
                        title={`${type}: ${countValue}`}
                      />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events & Event Types */}
        <div className="space-y-12">
          {/* Top Events */}
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Biggest Events</h3>
            <div className="space-y-3">
              {topEvents.map((event, i) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E5E1DD] hover:border-[#2D4F2D]/30 transition-colors"
                >
                  <span className="font-serif text-3xl text-[#2D4F2D] w-8">{i + 1}</span>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium truncate">{event.event_name}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-50">{event.year}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-serif text-2xl">{event.attendees}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-40 block">people</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Types Distribution */}
          <div className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Event Types</h3>
            <div className="space-y-3">
              {eventsByType.map(({ type, count }) => {
                const percentage = (count / filteredEvents.length) * 100;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                      <span className="opacity-60 flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default }}
                        />
                        {type}
                      </span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 bg-[#E5E1DD]/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-8">
        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Event Timeline</h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#E5E1DD]" />
          
          <div className="space-y-6">
            {filteredEvents.slice(0, 10).map((event, i) => {
              const eventDate = new Date(event.event_date);
              return (
                <div key={event.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-4 w-5 h-5 rounded-full border-4 border-white shadow-md"
                    style={{ backgroundColor: EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.default }}
                  />
                  
                  <div className="bg-white rounded-2xl border border-[#E5E1DD] p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {event.photos && event.photos[0] && (
                        <img
                          src={event.photos[0].url}
                          alt={event.event_name}
                          loading="lazy"
                          decoding="async"
                          sizes="128px"
                          className="w-full md:w-32 h-24 object-cover rounded-xl flex-shrink-0"
                        />
                      )}
                      
                      <div className="flex-grow space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span 
                              className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-full text-white mb-2"
                              style={{ backgroundColor: EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.default }}
                            >
                              {event.event_type}
                            </span>
                            <h4 className="font-serif text-xl tracking-tight">{event.event_name}</h4>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[10px] uppercase tracking-widest opacity-50">
                              {MONTHS[eventDate.getMonth()]} {eventDate.getDate()}
                            </div>
                            <div className="font-serif text-2xl text-[#2D4F2D]">{eventDate.getFullYear()}</div>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-[#666] leading-relaxed">{event.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 pt-2">
                          {event.attendees && (
                            <span className="text-[10px] uppercase tracking-wider opacity-50">
                              <strong className="text-[#2D4F2D]">{event.attendees}</strong> attendees
                            </span>
                          )}
                          {event.location && (
                            <span className="text-[10px] uppercase tracking-wider opacity-50">
                              📍 {event.location}
                            </span>
                          )}
                          {event.partners && event.partners.length > 0 && (
                            <span className="text-[10px] uppercase tracking-wider opacity-50">
                              🤝 {event.partners.slice(0, 2).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {filteredEvents.length > 10 && (
          <p className="text-center text-[10px] uppercase tracking-widest opacity-40 pt-4">
            Showing 10 of {filteredEvents.length} events
          </p>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#2D4F2D] to-[#1A3A1A] p-12 rounded-3xl text-white text-center space-y-6">
        <h3 className="font-serif text-3xl md:text-4xl">Join our next gathering</h3>
        <p className="text-white/80 max-w-xl mx-auto">
          From seasonal ceremonies to hands-on workshops, there's always an opportunity to connect 
          with our community and the land.
        </p>
        <a 
          href="https://mangaroa.org/upcoming-events"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#2D4F2D] text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-[#E9C46A] transition-all shadow-lg"
        >
          See Upcoming Events
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default EventsDashboard;
