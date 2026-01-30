
import React, { useState, useMemo, useEffect } from 'react';
import { DOMAINS, DOMAIN_METRICS, DOMAIN_NARRATIVES, MOCK_RECORDS } from './constants.ts';
import { WitnessRecord, DomainType, Organisation } from './types.ts';
import { fetchWitnessRecords, fetchOrganisations } from './data.ts';
import GalleryCard from './components/GalleryCard.tsx';
import RecordDetail from './components/RecordDetail.tsx';
import PredatorFree from './components/PredatorFree.tsx';
import NavigatorX from './components/NavigatorX.tsx';
import Network from './components/Network.tsx';
import TeamNetwork from './components/TeamNetwork.tsx';

const DOMAIN_BACKGROUNDS: Record<DomainType, string> = {
  Earth: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Tree_Planting.jpg?v=1754355799',
  People: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/DSC00252.jpg?v=1721467642',
  Systems: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=2000&auto=format&fit=crop',
  Mauri: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=2000&auto=format&fit=crop',
  Network: 'https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?q=80&w=2000&auto=format&fit=crop'
};

const App: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<DomainType>('Earth');
  const [records, setRecords] = useState<WitnessRecord[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<WitnessRecord | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [witnessData, orgData] = await Promise.all([
          fetchWitnessRecords(),
          fetchOrganisations()
        ]);
        setRecords(witnessData.length ? witnessData : MOCK_RECORDS);
        setOrganisations(orgData);
      } catch (err) {
        console.error("Critical Application Error: Data fetch failed.", err);
        setRecords(MOCK_RECORDS);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.domain === activeDomain
    ).sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
  }, [records, activeDomain]);

  const domainNarrative = DOMAIN_NARRATIVES[activeDomain];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] selection:bg-[#2D4F2D] selection:text-white">
      
      {/* Editorial Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-[#E5E1DD]">
        <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
          <a
            href="https://mangaroa.org"
            aria-label="Mangaroa Farms"
            className="flex items-center"
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Mangaroa-Black_High_Res_Logo.png?v=1685490985"
              alt="Mangaroa Farms"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </a>
          
          <div className="flex items-center gap-6 md:gap-10">
            {DOMAINS.map(domain => (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-b-2 py-2 ${
                  activeDomain === domain 
                    ? 'border-[#2D4F2D] text-[#1A1A1A]' 
                    : 'border-transparent text-[#A5A19D] hover:text-[#1A1A1A]'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Domain Context Block with Dynamic Background */}
      <header 
        className="relative pt-44 pb-20 px-6 transition-all duration-700 overflow-hidden text-white"
        style={{
          backgroundImage: `url("${DOMAIN_BACKGROUNDS[activeDomain]}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        <div className="relative z-10 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <span className="text-[10px] uppercase tracking-[0.6em] font-black block opacity-70">The Living Impact</span>
              <h1 className="font-serif text-7xl md:text-9xl tracking-tighter leading-[0.85]">
                {activeDomain}
              </h1>
            </div>
            <div className="space-y-8 pt-4">
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-white">
                {domainNarrative.subheading}
              </h2>
              <div className="space-y-4">
                {domainNarrative.intro.map((para, i) => (
                  <h3 
                    key={i} 
                    className="font-serif text-xl md:text-2xl font-light leading-relaxed italic last:not-italic last:font-normal text-white/90 last:text-white"
                  >
                    {para}
                  </h3>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Impact Snapshot Dashboard */}
      <section className="bg-[#FAFAF9] border-y border-[#E5E1DD] py-20 px-6">
        <div className="max-w-screen-xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-[#2D4F2D]">Impact Snapshot</h2>
            <p className="text-xs text-[#888] max-w-md leading-relaxed">
              Metrics measured in partnership with GroundTruth through permanent monitoring sites, repeatable seasonal surveys, and five-year verification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {DOMAIN_METRICS[activeDomain].map(metric => (
              <div key={metric.id} className="group bg-white rounded-2xl p-6 border border-[#E5E1DD]/60 hover:border-[#2D4F2D]/30 transition-colors">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-serif text-5xl tracking-tighter text-[#1A1A1A]">{metric.result}</span>
                  <span className="text-lg text-[#2D4F2D]">
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#333] mb-1">{metric.label}</div>
                {metric.description && (
                  <div className="text-xs text-[#888] leading-relaxed">{metric.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Explorer & Evidence Layer */}
      <main className="max-w-screen-xl mx-auto px-6 py-32 space-y-40">
        
        {/* People Domain: Team Network Section */}
        {activeDomain === 'People' && (
          <section className="space-y-16">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-serif text-5xl tracking-tight leading-tight">Team Network</h2>
              <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
                A mycelial map of the hands and hearts behind the mission
              </p>
            </div>
            <TeamNetwork />
          </section>
        )}

        {/* Network Specific Page */}
        {activeDomain === 'Network' && (
          <Network 
            organisations={organisations} 
            witnessRecords={records} 
            onProjectClick={setSelectedRecord} 
          />
        )}

        {/* Earth Data Explorer */}
        {activeDomain === 'Earth' && (
          <div className="space-y-40">
            <PredatorFree />
            
            {/* Hyperboard Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
              <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4">
                  <h2 className="font-serif text-5xl tracking-tight leading-tight">Shared Stewardship</h2>
                  <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
                    A Collective Ledger of Restoration
                  </h3>
                </div>
                <div className="space-y-6">
                  <p className="font-serif text-xl text-[#555] leading-relaxed italic">
                    "Restoration is not a solo endeavor; it is a symphony of small, consistent acts of care by many hands."
                  </p>
                  <p className="text-sm leading-relaxed text-[#666]">
                    This board visualises the impact of our community's participation. Each record represents a tangible contribution to the Mauri of the valley—from planting natives to managing local pressures. By documenting these actions, we create a shared history of healing.
                  </p>
                  <div className="pt-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2D4F2D]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#2D4F2D]">Community Driven</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white p-2 rounded-[24px] shadow-2xl border border-[#E5E1DD]">
                  <iframe
                    src="https://www.hyperboards.org/embed/at/did:plc:qc42fmqqlsmdq7jiypiiigww/org.hypercerts.claim.activity/1i8te3u5h50ni"
                    style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: '18px' }}
                    allow="fullscreen"
                    title="Hypercerts Activity Proof"
                  />
                </div>
                <p className="mt-6 text-[9px] uppercase tracking-widest font-bold text-[#A5A19D] text-right">
                  Interactive Impact Registry • Verifiable Community Contribution
                </p>
              </div>
            </section>

            {/* Navigator X Section */}
            <section className="space-y-16">
              <div className="max-w-3xl space-y-8">
                <div className="space-y-4">
                  <h2 className="font-serif text-5xl tracking-tight leading-tight">Navigator X: Reconstruction Priorities</h2>
                  <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
                    Optimal Restoration Opportunity
                  </h3>
                </div>
                <div className="space-y-6">
                   <p className="font-serif text-xl text-[#555] leading-relaxed italic">
                     Providing spatial information to guide ecosystem reconstruction decision-making.
                   </p>
                   <p className="text-sm leading-relaxed text-[#666]">
                     Navigator X provides guidance on the best 'bang-for-buck' reconstruction options across our catchments. 
                     By identifying where native ecosystems can be effectively rebuilt from scratch, we focus our energy where 
                     nature is most ready to thrive. This spatial tool allows us to toggle prioritisation options like 
                     connectivity, land stability, and threatened environment status.
                   </p>
                </div>
              </div>
              <NavigatorX />
              <div className="flex justify-end">
                <p className="max-w-md text-right text-[10px] font-medium text-[#A5A19D] leading-relaxed italic">
                  *Navigator X provides guidance and options, not prescriptions. It should be used alongside other information sources and local ground-truthing.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Stories & Human Witness Gallery */}
        {activeDomain !== 'Network' && (
          <section className="space-y-16">
            <div className="flex items-end justify-between border-b border-[#E5E1DD] pb-10">
              <div className="space-y-3">
                <h2 className="font-serif text-5xl tracking-tight">Voices of {activeDomain}</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Verifiable Human Witness</p>
              </div>
            </div>

            <div className="text-[9px] uppercase tracking-widest font-bold opacity-20 py-4 italic">
              {activeDomain === 'Earth' ? 'These numbers are one lens. Below are the stories and moments that give them meaning.' : ''}
            </div>

            {loading ? (
              <div className="py-40 text-center opacity-20">
                <div className="inline-block w-8 h-8 border border-[#2D4F2D] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[10px] uppercase tracking-widest font-bold">Gathering Evidence...</p>
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="masonry-grid">
                {filteredRecords.map(record => (
                  <GalleryCard key={record.id} record={record} onClick={setSelectedRecord} />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center opacity-20 italic">
                <p className="font-serif text-2xl">A quiet season for {activeDomain}.</p>
              </div>
            )}
          </section>
        )}

        {/* Reflection & Continuity */}
        <footer className="max-w-2xl py-20 border-t border-[#E5E1DD] space-y-6">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Learning & Continuity</h2>
          <p className="font-serif text-2xl font-light text-[#555] italic leading-relaxed">
            Our work in the {activeDomain} domain is iterative. We listen to what the metrics tell us, but we allow the lived experience of our community and the land to guide our next adaptive cycle.
          </p>
        </footer>
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-[#E5E1DD] py-32 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-end gap-20">
          <div className="space-y-8">
            <h3 className="font-serif text-6xl md:text-8xl tracking-tighter text-[#1A1A1A]">Ngā Mihi.</h3>
            <p className="text-lg font-light text-[#888] max-w-sm font-serif italic leading-relaxed">
              We measure what we care for. We tell stories so we remember why. Grounded in place alongside the Mangaroa River.
            </p>
          </div>
          <div className="text-right space-y-4">
             <div className="text-[10px] uppercase tracking-[0.3em] font-black text-[#2D4F2D]">Living Impact Registry</div>
             <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-20">© 2024 Mangaroa Farms</p>
          </div>
        </div>
      </footer>

      {selectedRecord && <RecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default App;
