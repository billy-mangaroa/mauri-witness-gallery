
import React, { useEffect, useState } from 'react';
import { TeamMember } from '../types.ts';
import { fetchTeamMembers } from '../data.ts';
import TeamNetworkGraph from './TeamNetworkGraph.tsx';
import TeamMemberModal from './TeamMemberModal.tsx';

const TeamNetwork: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      try {
        const members = await fetchTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Failed to load team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  return (
    <div data-reveal className="relative w-full h-[75vh] min-h-[600px] bg-[#FDFCFB] rounded-[48px] border border-[#E5E1DD] shadow-inner overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#A5A19D]">
          <div className="w-10 h-10 border border-[#2D4F2D] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Loading Team...</span>
        </div>
      ) : teamMembers.length > 0 ? (
        <TeamNetworkGraph 
          members={teamMembers} 
          onMemberClick={setSelectedMember} 
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[#A5A19D]">
          <span className="text-[10px] uppercase tracking-widest font-bold">No team data yet</span>
        </div>
      )}
      
      {/* Interaction hints */}
      <div className="absolute bottom-10 right-10 p-6 bg-white/80 backdrop-blur-md border border-[#E5E1DD] rounded-3xl max-w-xs shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <div className="flex items-center gap-3 mb-3">
           <div className="w-1.5 h-1.5 rounded-full bg-[#2D4F2D] animate-ping" />
           <h4 className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30">Our Hands</h4>
         </div>
         <p className="text-[10px] text-[#666] leading-relaxed italic">
           The network of people behind Mangaroa. <br />
           Click a profile to learn more.
         </p>
      </div>

      {selectedMember && (
        <TeamMemberModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  );
};

export default TeamNetwork;
