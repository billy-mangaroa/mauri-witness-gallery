
import { WitnessRecord, Metric, DomainType } from './types.ts';

export const DOMAINS: DomainType[] = ['Earth', 'People', 'Systems', 'Mauri', 'Network'];

/**
 * Mapping of Airtable 'themes' values to App Domain pages.
 * SPEC: Mauri maps to Wairua-domain.
 */
export const THEME_DOMAIN_MAP: Record<string, DomainType> = {
  'Earth': 'Earth',
  'People': 'People',
  'Systems': 'Systems',
  'Mauri': 'Mauri'
};

export const THEME_TO_DOMAIN_ROUTE = {
  Earth: "/impact/earth",
  People: "/impact/people",
  Systems: "/impact/systems",
  Mauri: "/impact/wairua",
  Network: "/impact/network"
};

export interface DomainNarrative {
  subheading: string;
  intro: string[];
}

export const DOMAIN_NARRATIVES: Record<DomainType, DomainNarrative> = {
  Earth: {
    subheading: "Regenerating the living systems that hold us",
    intro: [
      "At Mangaroa Farms, our relationship with the whenua begins with careful listening. Soil, water, plants, and wildlife are not resources to extract from, but living indicators of whether our decisions are supporting life over time.",
      "We track Earth impact through simple, repeatable measures — paired with stories that help us understand what those numbers mean on the ground."
    ]
  },
  People: {
    subheading: "A place of learning, nourishment, and belonging",
    intro: [
      "Mangaroa functions as a living classroom. Every volunteer, student, and visitor contributes to a social ecosystem where connection to land and food creates deeper community resilience.",
      "Our focus is not just how many people come, but how deeply they connect, learn, and carry this experience back into their own lives."
    ]
  },
  Systems: {
    subheading: "Organised, governed, and resourced to serve life",
    intro: [
      "Healthy systems make good land stewardship possible. We measure our internal systems not for raw efficiency, but for integrity — asking whether our financial and decision-making structures support long-term regeneration.",
      "This includes financial transparency, adaptive governance, and cross-sector partnerships that allow the farm to thrive as a values-aligned laboratory."
    ]
  },
  Mauri: {
    subheading: "Honouring the unseen dimensions of place",
    intro: [
      "Our approach to Mauri is informed by our friends at Hua Parakore, a Māori organics and food sovereignty verification method. Mauri cannot be reduced to numbers, but it can be witnessed and felt through presence. This domain highlights the quality of connection between people, ancestors, and the spirit of the valley.",
      "We track mauri through ritual, feeling, and the relationships between us, guiding how we care for this land and each other, with reverence."
    ]
  },
  Network: {
    subheading: "A mycelial map of shared mahi and collaboration",
    intro: [
      "The health of the valley is tied to the health of our relationships. We work in a network of partners, organisations, and community groups who share a vision for a regenerative future.",
      "This interactive map visualises how our collaborators connect through shared projects and domains of impact, weaving a collective history of stewardship."
    ]
  }
};

export const DOMAIN_METRICS: Record<DomainType, Metric[]> = {
  Earth: [
    { id: 'e1', domain: 'Earth', label: 'Soil Carbon', description: 'Permanent plots, 0–10cm horizon', result: '6.1%', trend: 'up' },
    { id: 'e2', domain: 'Earth', label: 'Indicator Species', description: '5 forest birds recorded consistently since baseline', result: '42', trend: 'up' },
    { id: 'e3', domain: 'Earth', label: 'Wetland Restored', description: 'Hectares restored since baseline', result: '1.4 ha', trend: 'up' },
    { id: 'e4', domain: 'Earth', label: 'Predator Pressure', description: 'Active traps + annual removals', result: '817', trend: 'up' }
  ],
  People: [
    { id: 'p1', domain: 'People', label: 'People Engaged', description: 'Unique participants FY25', result: '1,420', trend: 'up' },
    { id: 'p2', domain: 'People', label: 'Median Hours', description: 'Average time per participant', result: '6.5', trend: 'up' },
    { id: 'p3', domain: 'People', label: 'Public Events', description: 'Community gatherings hosted', result: '14', trend: 'up' },
    { id: 'p4', domain: 'People', label: 'Belonging Score', description: 'Post-visit survey (1–5 scale)', result: '4.2', trend: 'up' }
  ],
  Systems: [
    { id: 's1', domain: 'Systems', label: 'Regen Revenue', description: 'Income from regenerative activities', result: '47%', trend: 'up' },
    { id: 's2', domain: 'Systems', label: 'Cross-team Collabs', description: 'Active inter-pod partnerships', result: '7', trend: 'up' },
    { id: 's3', domain: 'Systems', label: 'Adaptive Decisions', description: 'Data-informed pivots this year', result: '12', trend: 'up' }
  ],
  Mauri: [
    { id: 'w1', domain: 'Mauri', label: 'Seasonal Rituals', description: 'Ceremonies held on-farm', result: '8', trend: 'up' },
    { id: 'w2', domain: 'Mauri', label: 'Mana Whenua', description: 'Engagements with tangata whenua', result: '5', trend: 'steady' },
    { id: 'w3', domain: 'Mauri', label: 'Mauri Reflection', description: 'Team wellbeing score (1–5 scale)', result: '4.4', trend: 'up' }
  ],
  Network: [
    { id: 'n1', domain: 'Network', label: 'Partner Orgs', description: 'Active collaborating organisations', result: '28', trend: 'up' },
    { id: 'n2', domain: 'Network', label: 'Shared Projects', description: 'Joint initiatives since baseline', result: '154', trend: 'up' },
    { id: 'n3', domain: 'Network', label: 'Network Density', description: 'Interconnection ratio (0–1)', result: '0.42', trend: 'up' }
  ]
};

export const MOCK_RECORDS: WitnessRecord[] = [
  {
    id: 'mock-1',
    domain: 'Earth',
    activity_title: 'The Silent Breath of the Soil',
    witness_names: 'Hana K.',
    date_added: '2024-03-15',
    time_context: 'Present',
    directional_state: 'Steadying',
    themes: ['Earth'],
    area_of_contribution: ['Soil'],
    reflection_notes: 'I spent an hour today just sitting by the creek. The soil feels denser, more resilient than it did two seasons ago. The microbial life is waking up.',
    published: true,
    consent_confirmed: true,
    sensitive: false
  }
];
