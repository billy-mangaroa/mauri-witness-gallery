
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
import MahiExchange from './components/MahiExchange.tsx';
import EventsDashboard from './components/EventsDashboard.tsx';
import ImpactChatbot from './components/ImpactChatbot.tsx';
import SystemsFlow from './components/SystemsFlow.tsx';

const DOMAIN_BACKGROUNDS: Record<DomainType, string> = {
  Earth: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/Tree_Planting.jpg?v=1754355799',
  People: 'https://cdn.shopify.com/s/files/1/0674/5469/7761/files/DSC00252.jpg?v=1721467642',
  Systems: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=2000&auto=format&fit=crop',
  Mauri: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=2000&auto=format&fit=crop',
  Network: 'https://mangaroa-impact-site.b-cdn.net/mahi%20ex/Screenshot%202026-01-30%20at%203.21.23%E2%80%AFPM.png'
};

const App: React.FC = () => {
  const hiddenPage = new URLSearchParams(window.location.search).get('page') === 'how-it-works';
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

  useEffect(() => {
    const title = `${activeDomain} | Mangaroa Impact`;
    const narrative = DOMAIN_NARRATIVES[activeDomain];
    const description = narrative
      ? `${narrative.subheading} ${narrative.intro[0]}`
      : 'Mangaroa Impact reporting gallery highlighting ecological restoration, community programmes, and partner networks across the Mangaroa Valley.';

    document.title = title;

    const setMeta = (selector: string, value: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', value);
      }
    };

    setMeta('#meta-description', description);
    setMeta('#meta-og-title', title);
    setMeta('#meta-og-description', description);
    setMeta('#meta-og-url', window.location.href);
    setMeta('#meta-twitter-title', title);
    setMeta('#meta-twitter-description', description);
  }, [activeDomain]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll('[data-reveal]')) as HTMLElement[];

    if (prefersReducedMotion) {
      elements.forEach(el => {
        el.classList.add('reveal-on-scroll', 'is-visible');
      });
      return;
    }

    elements.forEach(el => el.classList.add('reveal-on-scroll'));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [activeDomain]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.domain === activeDomain
    ).sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
  }, [records, activeDomain]);

  const domainNarrative = DOMAIN_NARRATIVES[activeDomain];

  if (hiddenPage) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] px-6 py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Internal Reference</span>
            <h1 className="font-serif text-5xl tracking-tight">How this site works</h1>
            <p className="text-base leading-relaxed text-[#555]">
              This impact gallery is designed as a living evidence archive for Mangaroa Farms. It brings together
              quantitative measures, community narratives, and operational signals to show how the mahi is evolving
              across Earth, People, and Network domains.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="font-serif text-3xl">What it is based on</h2>
            <p className="text-sm leading-relaxed text-[#666]">
              The core reference is the internal document <strong>MF Impact Reporting</strong>. It guides the metrics,
              themes, and storytelling structure. You can access the source PDF here:
            </p>
            <a
              href="/MF%20Impact%20Reporting.pdf"
              className="inline-flex items-center gap-3 text-sm font-bold text-[#2D4F2D] border-b-2 border-[#2D4F2D]/30 hover:border-[#2D4F2D]"
            >
              Open MF Impact Reporting (PDF)
            </a>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-3xl">What it aims to do</h2>
            <ul className="text-sm leading-relaxed text-[#666] space-y-2">
              <li>Translate complex farm and community work into clear, grounded signals.</li>
              <li>Provide a single place to review evidence, learnings, and stories.</li>
              <li>Support adaptive decision-making by showing what is changing over time.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-3xl">How to use it</h2>
            <p className="text-sm leading-relaxed text-[#666]">
              Each domain provides a snapshot, deeper evidence layers, and related narratives. The team network and
              systems views are internal tools for coordination, while the public layers focus on transparency and
              community trust.
            </p>
          </section>

          <a href="/" className="text-[10px] uppercase tracking-[0.4em] font-black text-[#2D4F2D]">
            Back to site
          </a>
        </div>
      </div>
    );
  }

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
              loading="eager"
              decoding="async"
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
        data-reveal
        className="relative pt-36 pb-16 px-6 transition-all duration-700 overflow-hidden text-white"
        style={{
          backgroundImage: `url("${DOMAIN_BACKGROUNDS[activeDomain]}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className={`absolute inset-0 z-0 ${activeDomain === 'Network' ? 'bg-black/25' : 'bg-black/40'}`} />
        
        <div className="relative z-10 max-w-screen-xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.6em] font-black block opacity-70">The Living Impact</span>
              <h1 className="font-serif text-7xl md:text-9xl tracking-tighter leading-[0.85]">
                {activeDomain}
              </h1>
            </div>
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-serif text-2xl md:text-3xl leading-tight text-white/95">
                {domainNarrative.subheading}
              </h2>
              <div className="space-y-3">
                {domainNarrative.intro.map((para, i) => (
                  <p 
                    key={i} 
                    className="text-sm md:text-base font-light leading-relaxed text-white/80"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Impact Snapshot Dashboard */}
      <section data-reveal className="bg-[#FAFAF9] border-y border-[#E5E1DD] py-16 px-6">
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
      <main className="max-w-screen-xl mx-auto px-6 py-24 space-y-32">
        
        {/* People Domain: Team Network + Mahi Exchange Section */}
        {activeDomain === 'People' && (
          <div className="space-y-32">
            <section data-reveal className="space-y-16">
              <div className="space-y-4 max-w-2xl">
                <h2 className="font-serif text-5xl tracking-tight leading-tight">Team Network</h2>
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
                  A mycelial map of the hands and hearts behind the mission
                </p>
              </div>
              <TeamNetwork />
            </section>
            
            {/* Mahi Exchange Programme */}
            <section data-reveal className="space-y-16 py-16 border-t border-[#E5E1DD]">
              <MahiExchange />
            </section>
            
            {/* Events Dashboard */}
            <section data-reveal className="space-y-16 py-16 border-t border-[#E5E1DD]">
              <EventsDashboard />
            </section>
          </div>
        )}

        {activeDomain === 'Systems' && (
          <section className="space-y-16">
            <SystemsFlow />
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
          <div className="space-y-32">
            <PredatorFree />
            
            {/* Hyperboard Section */}
            <section data-reveal className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
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
            <section data-reveal className="space-y-16">
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
        {activeDomain !== 'Network' && activeDomain !== 'Systems' && (
          <section data-reveal className="space-y-16">
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
        <footer data-reveal className="max-w-2xl py-16 border-t border-[#E5E1DD] space-y-6">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Learning & Continuity</h2>
          <p className="font-serif text-2xl font-light text-[#555] italic leading-relaxed">
            Our work in the {activeDomain} domain is iterative. We listen to what the metrics tell us, but we allow the lived experience of our community and the land to guide our next adaptive cycle.
          </p>
        </footer>
      </main>

      <ImpactChatbot activeDomain={activeDomain} />

      {/* Footer Branding */}
      <footer data-reveal className="bg-white border-t border-[#E5E1DD] py-24 px-6">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-16 items-start">
          <div className="space-y-8">
            <h3 className="font-serif text-6xl md:text-7xl tracking-tighter text-[#1A1A1A]">Mangaroa Farms</h3>
            <div className="space-y-2 text-sm text-[#666]">
              <p>Te Awa Kairangi, Upper Hutt, Wellington.</p>
              <p className="italic">welcome@mangaroa.org</p>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-black">
              <a href="https://www.instagram.com/mangaroafarms" target="_blank" rel="noopener noreferrer" className="hover:text-[#2D4F2D]">Instagram</a>
              <a href="https://www.facebook.com/mangaroafarms" target="_blank" rel="noopener noreferrer" className="hover:text-[#2D4F2D]">Facebook</a>
              <a href="https://nz.linkedin.com/company/mangaroafarms" target="_blank" rel="noopener noreferrer" className="hover:text-[#2D4F2D]">LinkedIn</a>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Quick Links</div>
            <div className="flex flex-col gap-2">
              <a href="/visit-us" className="hover:text-[#2D4F2D]">Visit our Farm Shop</a>
              <a href="/stay" className="hover:text-[#2D4F2D]">Stay at Mangaroa</a>
              <a href="https://store.mangaroa.org/collections/online-meat-deliveries" target="_blank" rel="noopener noreferrer" className="hover:text-[#2D4F2D]">Order Online</a>
              <a href="/newsletter" className="hover:text-[#2D4F2D]">Newsletter</a>
              <a href="/contact" className="hover:text-[#2D4F2D]">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {selectedRecord && <RecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default App;
