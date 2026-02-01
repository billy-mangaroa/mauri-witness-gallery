import React from 'react';

const SYSTEMS_PHASES = [
  {
    title: 'Type 1 – Centralised',
    description: 'Decisions funnel upward, feedback is delayed, systems are brittle.'
  },
  {
    title: 'Type 2 – Coordinated',
    description: 'Roles clearer, processes defined, still approval-heavy.'
  },
  {
    title: 'Type 3 – Distributed',
    description: 'Decisions made close to the work, feedback loops visible.'
  },
  {
    title: 'Type 4 – Self-regulating',
    description: 'Principles guide action, minimal oversight needed, high trust.'
  }
];

const SystemsFlow: React.FC = () => {
  return (
    <div data-reveal className="space-y-16">
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Systems</span>
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#2D4F2D] border border-[#2D4F2D]/30 px-3 py-1 rounded-full">
            Internal
          </span>
        </div>
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">Systems Flow</h2>
        <p className="text-base leading-relaxed text-[#555] max-w-3xl">
          The goal here is to track whether Mangaroa Farms itself is evolving in the right direction from a management,
          operations, and cultural perspective, away from “a corporation” and towards “an organism in service to life”.
        </p>
      </header>

      <section className="bg-[#F9F8F6] border border-[#E5E1DD] rounded-[28px] p-8 md:p-12 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Organisational Maturity</h3>
          <span className="text-[9px] uppercase tracking-widest font-bold text-[#A5A19D]">Trajectory</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SYSTEMS_PHASES.map((phase, index) => (
            <div
              key={phase.title}
              className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-3"
            >
              <div className="text-[9px] uppercase tracking-[0.3em] font-black text-[#2D4F2D]">
                {index + 1}
              </div>
              <h4 className="font-serif text-2xl tracking-tight">{phase.title}</h4>
              <p className="text-sm leading-relaxed text-[#666]">{phase.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Flow</h3>
            <div className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-2">
              <p className="text-sm text-[#555]">Reduction in bottlenecking of action and decisioning.</p>
              <ul className="text-sm text-[#666] space-y-1">
                <li>Time from issue to decision.</li>
                <li>% of decisions made without senior escalation.</li>
                <li>Do people know who made the decision and why?</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Sensing Capacity</h3>
            <div className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-2">
              <p className="text-sm text-[#555]">Can we notice what matters quickly?</p>
              <ul className="text-sm text-[#666] space-y-1">
                <li>Staff feel safe to name issues early.</li>
                <li>Team, land, and partners are listened to in decisions.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Responsiveness / Adaptability</h3>
            <div className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-2">
              <ul className="text-sm text-[#666] space-y-1">
                <li>Experiments named and tracked.</li>
                <li>Reflect, learn, and compost the findings.</li>
                <li>Practices and policies evolve based on learnings.</li>
                <li>Operations becoming simpler, not more complex.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Coherence Without Control</h3>
            <div className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-2">
              <p className="text-sm text-[#555]">Can many parts act independently without fragmenting the whole?</p>
              <ul className="text-sm text-[#666] space-y-1">
                <li>Team acts with purpose and aligned values even when no one is watching.</li>
                <li>Consistent values across diverse operations.</li>
                <li>Team confident to make decisions based on values.</li>
                <li>Trust grows within team.</li>
                <li>Team understands how the whole sums from the parts.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Team Energy Pulse</h3>
            <div className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-2">
              <p className="text-sm text-[#666]">Internal pulse check to notice early signs of burnout.</p>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[#A5A19D]">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="h-2 rounded-full bg-[#E5E1DD]">
                <div className="h-2 rounded-full bg-[#2D4F2D] w-[65%]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">Pride of Association</h3>
            <div className="bg-white border border-[#E5E1DD] rounded-2xl p-6 space-y-2">
              <p className="text-sm text-[#666]">Are people proud to be associated with Mangaroa Farms?</p>
              <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#2D4F2D]">
                Track quarterly sentiment and stories
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemsFlow;
