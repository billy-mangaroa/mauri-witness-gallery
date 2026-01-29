
import React, { useState } from 'react';
import { TeamMember } from '../types.ts';
import TeamNetworkGraph from './TeamNetworkGraph.tsx';
import TeamMemberModal from './TeamMemberModal.tsx';

const TEAM_DATA: TeamMember[] = [
  { id: '1', name: 'Chris Upton', role: 'Land Steward', pod: 'Land', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Murray Pilcher', role: 'Farm Operations', pod: 'Land', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Cam Dixon', role: 'Regenerative Agriculture', pod: 'Land', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Amy Webber', role: 'Community Lead', pod: 'Community', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' },
  { id: '5', name: 'Tyler Langerveld', role: 'Field Technician', pod: 'Land', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
  { id: '6', name: 'Billy Lewis', role: 'Ecological Restoration', pod: 'Land', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop' },
  { id: '7', name: 'Raelene Millar', role: 'Founder & Steward', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
  { id: '8', name: 'Graedon Parker', role: 'Media & Storytelling', pod: 'Story', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&auto=format&fit=crop' },
  { id: '9', name: 'Halina Horn', role: 'Education Coordinator', pod: 'Education', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop' },
  { id: '10', name: 'Tamsin Kaufman', role: 'Learning Facilitator', pod: 'Education', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' },
  { id: '11', name: 'Zebulon Horrell', role: 'Forestry Specialist', pod: 'Land', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop' },
  { id: '12', name: 'Kari Shadwell', role: 'Finance & Systems', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop' },
  { id: '13', name: 'Kathleen Kirton', role: 'Events Manager', pod: 'Community', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=400&auto=format&fit=crop' },
  { id: '14', name: 'Casey McNeil', role: 'Nursery Manager', pod: 'Land', image: 'https://images.unsplash.com/photo-1542206395-993d3998782a?q=80&w=400&auto=format&fit=crop' },
  { id: '15', name: 'Carlos Reigel', role: 'Infrastructure', pod: 'Land', image: 'https://images.unsplash.com/photo-1564564321837-a57b6084ca47?q=80&w=400&auto=format&fit=crop' },
  { id: '16', name: 'Brooke Millar', role: 'Director', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' },
  { id: '17', name: 'Holly Spiers', role: 'Engagement', pod: 'Community', image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=400&auto=format&fit=crop' },
  { id: '18', name: 'Miki Coulston', role: 'Field Operations', pod: 'Land', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop' },
  { id: '19', name: 'Jake Coulston', role: 'Machinery Specialist', pod: 'Land', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop' },
  { id: '20', name: 'Diana Dixon', role: 'Cultural Liaison', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1567532939847-8a355fce9b67?q=80&w=400&auto=format&fit=crop' },
  { id: '21', name: 'Jules Matthews', role: 'Soil Health Research', pod: 'Education', image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=400&auto=format&fit=crop' },
  { id: '22', name: 'Jan Hania', role: 'Strategic Advisory', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
  { id: '23', name: 'Matthew Monahan', role: 'Founder & Vision', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1519085185758-24dd5173558f?q=80&w=400&auto=format&fit=crop' },
  { id: '24', name: 'Brian Monahan', role: 'Steward', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=400&auto=format&fit=crop' },
  { id: '25', name: 'Catlin Powers', role: 'Impact Advisor', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
  { id: '26', name: 'Neci Monahan', role: 'Community Arts', pod: 'Stewardship', image: 'https://images.unsplash.com/photo-1586297135537-94bc9ba553ca?q=80&w=400&auto=format&fit=crop' }
];

const TeamNetwork: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="relative w-full h-[75vh] min-h-[600px] bg-[#FDFCFB] rounded-[48px] border border-[#E5E1DD] shadow-inner overflow-hidden">
      <TeamNetworkGraph 
        members={TEAM_DATA} 
        onMemberClick={setSelectedMember} 
      />
      
      {/* Interaction hints */}
      <div className="absolute bottom-10 right-10 p-6 bg-white/80 backdrop-blur-md border border-[#E5E1DD] rounded-3xl max-w-xs shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <div className="flex items-center gap-3 mb-3">
           <div className="w-1.5 h-1.5 rounded-full bg-[#2D4F2D] animate-ping" />
           <h4 className="text-[8px] uppercase tracking-[0.3em] font-black opacity-30">Our Hands</h4>
         </div>
         <p className="text-[10px] text-[#666] leading-relaxed italic">
           The network of people behind Mangaroa. <br />
           Scroll to zoom inside this area. <br />
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
