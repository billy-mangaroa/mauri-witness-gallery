
import React, { useEffect } from 'react';
import { Organisation, WitnessRecord } from '../types.ts';

interface OrgModalProps {
  org: Organisation;
  witnessRecords: WitnessRecord[];
  onClose: () => void;
  onProjectClick: (record: WitnessRecord) => void;
}

const OrgModal: React.FC<OrgModalProps> = ({ org, witnessRecords, onClose, onProjectClick }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const linkedProjects = witnessRecords.filter(r => org.impact_reporting_ids.includes(r.id));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#FDFCFB]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#E5E1DD] shadow-2xl rounded-[32px] animate-in slide-in-from-bottom-8 duration-700 custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[210] w-12 h-12 border border-[#E5E1DD] bg-white flex items-center justify-center hover:bg-[#2D4F2D] hover:text-white transition-all rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-12 md:p-20 space-y-16">
          <header className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] overflow-hidden border border-[#E5E1DD] bg-[#F9F8F6] flex-shrink-0 shadow-sm">
              {org.logo ? (
                <img src={org.logo.url} alt={org.org_name} className="w-full h-full object-contain p-4" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black opacity-10">
                  {org.org_name[0]}
                </div>
              )}
            </div>
            
            <div className="space-y-6 flex-1 pt-4">
              <div className="flex flex-wrap gap-2">
                {org.impact_domain.map(d => (
                  <span key={d} className="px-3 py-1 border border-[#E5E1DD] text-[8px] uppercase tracking-widest font-black text-[#A5A19D]">
                    {d}
                  </span>
                ))}
              </div>
              <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-none">{org.org_name}</h2>
              {org.website_link && (
                <a 
                  href={org.website_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#2D4F2D] border-b border-[#2D4F2D]/20 hover:border-[#2D4F2D] transition-all"
                >
                  Visit Website ↗
                </a>
              )}
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">About the Collaborator</h4>
                <p className="font-serif text-2xl text-[#555] leading-relaxed italic">
                  {org.about_org || "No description provided."}
                </p>
              </div>
              {org.how_connected && (
                <div className="space-y-4 pt-8 border-t border-[#F1F1F1]">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Our Connection</h4>
                  <p className="text-base leading-relaxed text-[#666]">
                    {org.how_connected}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Shared Impact Records</h4>
                {linkedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {linkedProjects.map(project => (
                      <div 
                        key={project.id} 
                        onClick={() => {
                          onProjectClick(project);
                          onClose();
                        }}
                        className="group p-6 bg-[#F9F8F6] border border-[#E5E1DD] hover:border-[#2D4F2D]/30 transition-all cursor-pointer rounded-2xl flex flex-col gap-2"
                      >
                        <span className="text-[8px] uppercase tracking-widest font-black opacity-30 group-hover:text-[#2D4F2D] transition-colors">
                          {project.domain} Witness Record
                        </span>
                        <h5 className="font-serif text-xl tracking-tight leading-tight group-hover:text-[#2D4F2D] transition-colors">
                          {project.activity_title}
                        </h5>
                        <p className="text-[10px] opacity-40 italic">
                          {new Date(project.date_added).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-[#E5E1DD] rounded-2xl text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-20 italic">No public records linked yet</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrgModal;
