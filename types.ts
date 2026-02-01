
export type DomainType = 'Earth' | 'People' | 'Systems' | 'Mauri' | 'Network';

export type DirectionalState = 'Emerging' | 'Steadying' | 'Composting' | 'Resting';
export type TimeContext = 'Past' | 'Present' | 'Seasonal' | 'Ancestral' | 'Future';

export interface AirtableAttachment {
  id: string;
  url: string;
  filename?: string;
  type?: string;
  thumbnails?: {
    small?: { url: string };
    large?: { url: string };
  };
}

export interface WitnessRecord {
  id: string;
  domain: DomainType;
  activity_title?: string;
  witness_names?: string;
  date_added: string;
  time_context: string;
  directional_state: string;
  themes: string | string[];
  area_of_contribution: string[];
  reflection_notes: string;
  why_it_matters?: string;
  interconnectivity_potential?: string;
  intentions_for_next_cycle?: string;
  org_title?: string;
  org_link?: string;
  supporting_media_raw?: AirtableAttachment[];
  published: boolean;
  consent_confirmed: boolean;
  sensitive: boolean;
  featured?: boolean;
}

export interface Organisation {
  id: string;
  org_name: string;
  website_link?: string;
  about_org?: string;
  how_connected?: string;
  impact_reporting_ids: string[];
  impact_domain: string[];
  logo?: AirtableAttachment;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  pod: 'Land' | 'Community' | 'Education' | 'Story' | 'Stewardship';
  image: string;
}

export interface Metric {
  id: string;
  domain: DomainType;
  label: string;
  description?: string;
  result: string;
  trend: 'up' | 'down' | 'steady';
}

export interface DomainContent {
  narrative: string;
  metrics: Metric[];
}

export interface FilterState {
  search: string;
  directionalState: string | null;
  timeContext: string | null;
}

export interface EarthRecord {
  id: string;
  date: Date | null;
  year: number;
  month: number; // 0-11
  count: number;
  species: string;
  block: string;
  method: string;
  speciesGroup: 'Possum' | 'Rat/Stoat' | 'Large Browser' | 'Other';
}

export interface EventRecord {
  id: string;
  event_name: string;
  event_date: string;
  end_date?: string;
  event_type: string;
  description?: string;
  attendees?: number;
  location?: string;
  photos?: AirtableAttachment[];
  highlight?: boolean;
  partners?: string[];
  impact_notes?: string;
  year: number;
}
