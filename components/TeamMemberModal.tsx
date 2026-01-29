
import React, { useEffect } from 'react';
import { TeamMember } from '../types.ts';

interface TeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#FDFCFB]/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl overflow-hidden border border-[#E5E1DD] shadow-2xl rounded-[48px] animate-in slide-in-from-bottom-8 duration-700">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[210] w-12 h-12 border border-[#E5E1DD] bg-white flex items-center justify-center hover:bg-[#2D4F2D] hover:text-white transition-all rounded-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 bg-[#F9F8F6] aspect-square md:aspect-auto">
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover grayscale-[20%]"
            />
          </div>
          <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-[#2D4F2D] opacity-60">
                {member.pod} / {member.role}
              </span>
              <h2 className="font-serif text-5xl tracking-tighter leading-none">{member.name}</h2>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 italic">Lived contribution</h4>
              <p className="font-serif text-xl text-[#666] leading-relaxed italic">
                "{member.name} contributes to the mission through their dedicated mahi in {member.pod.toLowerCase()} systems."
              </p>
              <div className="pt-8 border-t border-[#F1F1F1]">
                 <p className="text-[11px] text-[#A5A19D] font-medium italic">Profile details coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
