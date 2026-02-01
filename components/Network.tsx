
import React, { useState } from 'react';
import { Organisation, WitnessRecord } from '../types.ts';
import NetworkGraph from './NetworkGraph.tsx';
import OrgModal from './OrgModal.tsx';
import MycelialBackground from './MycelialBackground.tsx';

interface NetworkProps {
  organisations: Organisation[];
  witnessRecords: WitnessRecord[];
  onProjectClick: (record: WitnessRecord) => void;
}

const Network: React.FC<NetworkProps> = ({ organisations, witnessRecords, onProjectClick }) => {
  const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null);

  return (
    <div data-reveal className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-4 max-w-2xl">
          <h2 className="font-serif text-5xl tracking-tight leading-tight">Collective Ecosystem</h2>
          <p className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">
            A relational map of collaborators and shared mahi
          </p>
          <p className="text-sm leading-relaxed text-[#666]">
            Explore the web of relationships that sustain our restoration efforts. Organisations are connected by the impact reporting projects they co-author and the domains they serve.
          </p>
        </div>

        {/* Dynamic Legend */}
        <div className="bg-white/50 backdrop-blur-sm border border-[#E5E1DD] p-5 rounded-2xl flex flex-col gap-3">
          <h4 className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30">Domain Fields</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 max-w-[240px]">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#2D4F2D]/10 border border-[#2D4F2D]/20" />
               <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Environment</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/20" />
               <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Community</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#4A4E69]/10 border border-[#4A4E69]/20" />
               <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Education</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#8E9AAF]/10 border border-[#8E9AAF]/20" />
               <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Food Systems</span>
             </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[75vh] min-h-[600px] bg-[#FDFCFB] rounded-[48px] border border-[#E5E1DD] shadow-inner overflow-hidden">
        {/* Subtle atmospheric background animation */}
        <MycelialBackground />
        
        <NetworkGraph 
          organisations={organisations} 
          onOrgClick={setSelectedOrg} 
        />
        
        {/* Interaction hints */}
        <div className="absolute bottom-10 left-10 p-6 bg-white/80 backdrop-blur-md border border-[#E5E1DD] rounded-3xl max-w-xs shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-1.5 h-1.5 rounded-full bg-[#2D4F2D] animate-ping" />
             <h4 className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30">Navigation</h4>
           </div>
           <p className="text-[10px] text-[#666] leading-relaxed italic">
             Scroll to zoom, drag to pan. <br />
             Hover nodes to see shared connections. <br />
             Nodes are naturally pulled toward their impact domains.
           </p>
        </div>
      </div>

      {selectedOrg && (
        <OrgModal 
          org={selectedOrg} 
          witnessRecords={witnessRecords} 
          onClose={() => setSelectedOrg(null)} 
          onProjectClick={onProjectClick}
        />
      )}
    </div>
  );
};

export default Network;
