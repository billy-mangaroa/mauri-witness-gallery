
import { EarthRecord, WitnessRecord, Organisation, DomainType } from './types.ts';
import { THEME_DOMAIN_MAP } from './constants.ts';

// Vite environment variables (import.meta.env)
const getEnv = (key: string, fallback: string = '') => {
  try {
    // Vite uses import.meta.env for environment variables
    const env = (import.meta as any).env;
    return env?.[key] || fallback;
  } catch {
    return fallback;
  }
};

const AIRTABLE_API_KEY = getEnv('VITE_AIRTABLE_API_KEY', '');
const AIRTABLE_BASE_ID = getEnv('VITE_AIRTABLE_BASE_ID', 'appbvU8D6GmB51fIz');
const AIRTABLE_TABLE_NAME = getEnv('VITE_AIRTABLE_TABLE_NAME', 'Impact Reporting');
const AIRTABLE_ORGS_TABLE = 'Organisations';
const AIRTABLE_VIEW_NAME = getEnv('VITE_AIRTABLE_VIEW_NAME', '');

export async function fetchWitnessRecords(): Promise<WitnessRecord[]> {
  let allRecords: any[] = [];
  let offset = '';
  
  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`);
      if (AIRTABLE_VIEW_NAME) url.searchParams.append('view', AIRTABLE_VIEW_NAME);
      if (offset) url.searchParams.append('offset', offset);
      url.searchParams.append('pageSize', '100');

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorJson = await response.json();
          errorDetail = ` - ${errorJson.error?.message || JSON.stringify(errorJson.error)}`;
        } catch {
          errorDetail = ` - ${response.statusText || 'Unknown Error'}`;
        }
        throw new Error(`Airtable Fetch Failed: ${response.status}${errorDetail}`);
      }

      const data = await response.json();
      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset;
    } while (offset);

    return allRecords.map((record): WitnessRecord | null => {
      const fields = record.fields;
      
      const rawThemes = fields.themes;
      const themesArr = Array.isArray(rawThemes) ? rawThemes : (rawThemes ? [rawThemes] : []);
      
      if (themesArr.length === 0) {
        console.warn(`Record missing themes: (record ${record.id})`);
        return null;
      }

      const primaryTheme = themesArr[0];
      const domain = THEME_DOMAIN_MAP[primaryTheme];

      if (!domain) {
        console.warn(`Unknown theme value: ${primaryTheme} (record ${record.id})`);
        return null;
      }

      return {
        id: record.id,
        domain,
        activity_title: fields.activity_title,
        witness_names: fields.witness_names,
        date_added: fields.date_added || record.createdTime,
        time_context: fields.time_context,
        directional_state: fields.directional_state,
        themes: rawThemes,
        area_of_contribution: fields.area_of_contribution || [],
        reflection_notes: fields.reflection_notes || '',
        why_it_matters: fields.why_it_matters,
        interconnectivity_potential: fields.interconnectivity_potential,
        intentions_for_next_cycle: fields.intentions_for_next_cycle,
        org_title: fields.org_title,
        org_link: fields.org_link,
        supporting_media_raw: fields.supporting_media_raw || [],
        published: true,
        consent_confirmed: true,
        sensitive: false
      };
    })
    .filter((r): r is WitnessRecord => r !== null)
    .sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());

  } catch (error) {
    console.error("Failed to load records from Airtable:", error);
    return [];
  }
}

export async function fetchOrganisations(): Promise<Organisation[]> {
  let allRecords: any[] = [];
  let offset = '';
  
  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_ORGS_TABLE)}`);
      if (offset) url.searchParams.append('offset', offset);
      url.searchParams.append('pageSize', '100');

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
      });

      if (!response.ok) throw new Error(`Airtable Orgs Fetch Failed: ${response.status}`);

      const data = await response.json();
      allRecords = [...allRecords, ...(data.records || [])];
      offset = data.offset;
    } while (offset);

    return allRecords.map((record): Organisation => {
      const fields = record.fields;
      return {
        id: record.id,
        org_name: fields.org_name || 'Unnamed Organisation',
        website_link: fields.website_link,
        about_org: fields.about_org,
        how_connected: fields.how_connected,
        impact_reporting_ids: fields.impact_reporting || [],
        impact_domain: fields.impact_domain || [],
        logo: fields.Logo?.[0]
      };
    });
  } catch (error) {
    console.error("Failed to load organisations from Airtable:", error);
    return [];
  }
}

export async function getRecordsForDomain(domain: DomainType): Promise<WitnessRecord[]> {
  const all = await fetchWitnessRecords();
  return all.filter(r => r.domain === domain);
}

export const PEST_CSV_DATA = {
  fy25: `10/1/25,1 x Possum ,J
10/1/25,2 x Goats ,J
11/1/25,1x Possum ,K
11/1/25,4 x Goats ,K
13/1/25,1 x Possum ,J
18/1/25,2 x Possums ,K
22/1/25,1 x Hedgehog ,B
22/1/25,1 x Rat,B
27/1/25,1 x Possum ,J
27/1/25,9 Hares +5 Rabbits ,J
2/2/25,1 x Goat,K
6/2/25,1 x Pig ,J
6/2/25,1 x Deer ,J
6/2/25,1 x Deer ,L
8/2/25,1 x Deer ,L
9/2/25,1 x Deer ,L
16/2/25,2 x Deer ,L
17/2/25,1 x Rat ,K
20/2/25,1 x Possum ,H
20/2/25,1 x Rat ,I
21/2/25,2 x Possums ,C
23/2/25,1 x Goat ,K
25/2/25,3 Deer ,L
1/3/25,1 x Goat,K
2/3/25,1 x Deer ,L
6/3/25,1 x Deer ,L
7/3/25,1  x Deer ,L
10/3/25,1 x Hedgehog ,C
13/3/25,1 x Possum ,C
15/3/25,1 x Deer ,L
16/3/25,2 x Deer ,J
19/3/25,1 x Deer ,L
20/3/25,1 Deer ,L
21/3/25,1 x Hedgehog ,K
22/3/25,1 x Deer ,K
24/3/25,1 x Deer ,L
24/3/25,1 x Hedgehog ,C
29/3/25,2 x Deer ,J
31/3/25,1x Deer,J
2/4/25,2 x Deer ,C
10/4/25,1 x Deer ,L
11/4/25,1 x Rat ,B
13/4/25,1 x Hedgehog ,K
13/4/25,1 x Deer ,H
18/4/25,2xDeer,L
19/4/25,1 x Goat ,K
25/4/25,3 Goats ,K
28/4/25,7 Hares ,B
23/4/25,3 x Deer ,L
4/5/25,2 x Goats ,K
4/5/25,1 x Deer ,K
4/5/25,1 x Deer ,L
8/5/25,1 x Deer ,L
26/5/25,1 x Stoat ,B
27/5/25,1 x Deer ,C
31/5/25,3 x Deer ,L
1/6/25,2 x Deer ,L
3/6/25,1 x Rat ,B
4/6/25,3 x Pigs ,J
8/6/25,2 x Goats ,K
9/6/25,2 x Possums ,C
14/6/25,2 x Deer ,L
15/6/25,6 x Goats ,K
18/6/25,2 x Deer ,C
23/6/25,1 x Possum ,E
29/6/25,2x Goats ,K
30/6/25,2 x Possums ,C
4/7/25,3 x Deer ,L
9/7/25,1 x Stoat ,L
14/7/25,1 x Hedgehog ,B
14/7/25,1 x Rat ,B
14/7/25,1 x Possum ,B
27/7/25,3 x Pigs ,K 
28/7/25,2x Deer,A
28/7/25,1 x Possum ,A
28/7/25,1 x Deer ,L
6/10/25,6 Hare's ,L
6/10/25,36 Rabbits ,L
17/8/25,1 x Goat ,K
18/8/25,1 x Rat ,B
18/8/25,1 x Rat ,D
25/8/25,3 x Possums ,C
27/8/25,2 x Possums ,L
27/8/25,5 x Hares ,L
27/8/25,6 rabbits ,L
2/9/25,1 x Pig,J
3/9/25,2 x Rats,B
17/8/25,1 x Possum ,E
18/9/25,12 Rabbits ,B
18/9/25,4 X Hares ,B
19/9/25,1 x Deer ,L
3/10/25,1x Deer,L
14/10/25,2 x Deer ,L
17/10/25,1 x Deer ,C
6/11/25,2 x Deer ,J
8/11/25,2 x Deer ,L
10/11/25,2 x possums ,C
12/11/25,1 x possum ,C
12/11/25,1 x Rat,A
16/11/25,2 x Deer ,L
17/11/25,1 x Deer ,B
18/11/25,2 x Rats,I`,
  fy24: `24/1/24,1 x Hedgehog,K
1/2/24,14 Magpies,C
30/1/24,1 x Stoat,H
30/1/24,1 x Rat,K
31/1/24,1 x Hedgehog,C
2/2/24,1 Stoat,I
10/2/24,1 x Stoat,B
10/2/24,1 x Rat,I
10/2/24,1 x Possum,C
10/2/24,6 possum,K
10/2/24,5 doc200,K
12/2/24,1 Hedgehog,C
12/2/24,1 x Possum,C
16/2/24,1 x Rat,C
19/2/24,1 x Rat,C
20/2/24,1 x Hedgehog,C
1/3/24,1 x Possum,D
4/3/24,1 x Rat,H
8/3/24,1 x Possum,C
11/3/24,1 x Possum,C
13/3/24,1 Possum,D
18/3/24,1 x Possum,C
18/3/24,1 x Possum,C
18/3/24,1 x Hedgehog,D
27/3/24,1 Stoat,H
27/2/24,1 x Hedgehog,C
28/3/24,1 x Rat,K
8/4/24,1 x Rat,G
8/4/24,2 x Possums,C
10/4/24,1 x Possum,C
15/4/24,2 x Rats,C
15/4/24,1 x Possum,C
18/4/24,2 x Possums,C
23/4/24,1 x Weasel,E
30/4/24,1 x Hedgehog,K
30/4/24,1 x Stoat,K
2/5/24,1 x Rat,D
8/5/24,1 x Possum,C
8/5/24,1 x Rat,C
9/5/24,2 x Possums,A
14/5/24,1 x Possum,B
14/5/24,1 Rat,H
15/5/24,1 x Stoat,C
15/5/24,1 x Rat,C
21/5/24,1 x Hedgehog,E
23/5/24,1 x Stoat,C
23/5/24,1 x Rat,C
10/5/24,2 x Deer,C
29/5/24,1 x Weasel,K
7/6/24,3 x Hedgehog,K
7/6/24,1 x Rat,K
13/6/24,1 x Rat,C
13/6/24,1 x Rat,A
1/7/24,1 x Rat,C
1/7/24,1 x Rat,B
8/7/24,1 x Rat,C
12/7/24,1 x Hedgehog,I
16/7/24,1 x Rat,B
19/7/24,1 Possum,K
19/7/24,1 x Rat,C
3/8/24,2x Possums,K
5/8/24,6 Hares 3 Rabbits,B
8/8/24,1 x Rat,B
13/8/24,1 x Rat,B
14/8/24,1x Possum,J
21/8/24,2x Possums,K
21/8/24,1 x Rat,K
3/8/24,1 x Deer,K
8/8/24,1 x Deer,C
24/8/24,1 x Deer,B
30/8/24,1 x Possum,J
6/9/24,1 x Hedgehog,K
24/9/24,2 x Deer,J
25/9/24,1 x Rat,J
1/10/24,1 x Possum,C
2/10/24,1 x Stoat,C
4/10/24,1 x Stoat,C
12/10/24,1 x Deer,H
14/10/24,2 x Possums,J
19/10/24,2 x Deer,K
22/10/24,1 x Possum,K
24/10/24,1 Rat,D
30/10/24,1 x Rat,B
13/11/24,2 x Possums,J
11/11/24,1 x Deer,J
21/11/24,1 x Possum,J
27/11/24,2 x Possums,J
29/11/24,3 x Possums,K
5/12/24,1 x Possum ,J
5/12/24,2 x Possums ,K
11/12/24,1 x Possum ,K
13/12/24,2 x Possums ,J
17/12/24,1 x Stoat ,E
18/12/24,1 x Possum ,J
19/12/24,1 x Rat,D
19/12/24,1 x Possum ,D
1/12/24,1 x Possum ,J
20/12/24,1 x Hedgehog,K
20/12/24,2 x Possums ,K
23/12/24,1 x Possum ,C
23/12/24,1 x Pig,K
29/12/24,1 x Possum ,H
15/12/24,13 Goats ,K
15/12/24,8  Rabbits ,C`,
  fy23: `5/1/23,1 Stoat ,A
13/1/23,1 Hedghog,C
13/1/23,1 Possum ,C
13/1/23,1 Possum ,D
13/1/23,11 Rabbits 1 Hare,C
23/1/23,1 Hedgehog,K
24/1/23,1 x Hedgehog ,C
4/2/23,1 x Hare 2 x Rabbits ,C
9/2/23,1 x Rat ,K
10/2/23,2 x Rats ,K
10/2/23,1 x Stoat ,K
20/2/23,1 x Stoat ,I
24/2/23,1 x Stoat ,C
24/2/23,2 x Hares 5 Magpies ,C
3/3/23,1 x Stoat ,C
10/3/23,2 Deer 3 Goats ,K
8/3/23,1 x Rat ,K
10/3/23,1 x Rat ,K
10/3/23,2 x Hedgehogs ,K
23/3/23,2 x Hedgehogs ,K
30/3/23,6 Rabbits ,E
2/4/23,1 x Stoat ,K
2/4/23,1 x Pig ,K
2/4/23,1 x Rat ,K
3/4/23,1 x Rat ,C
6/4/23,1 x Rat ,K
6/4/23,1 x Hedgehog ,K
6/4/23,1 x Cat ,K
6/4/23,1 x Stoat ,I
7/4/23,1 x Rat ,K
7/4/23,1 x Stoat ,K
7/4/23,1 x Hedgehog ,K
8/4/23,1 x Red deer ,K
12/4/23,1 x Rat ,C
12/4/23,1 x Hedgehog ,C
16/4/23,1 x Stoat ,K
20/4/23,1 x Rat ,K
20/4/23,1 x Stoat ,A
20/4/23,1 x Hedgehog ,E
24/4/23,1 x Rat ,K
1/5/23,1 x Possum ,A
2/5/23,1 x Stoat ,D
3/5/23,1x Stoat ,K
5/5/23,1 x Rat ,K
5/5/23,1 x Hedgehog ,K
9/5/23,1 x Rat ,A
11/5/23,1x Hedgehog ,A
15/5/23,1 x Possum ,E
16/5/23,1 x Hedgehog ,E
18/5/23,1 x Rat ,D
18/5/23,1 x Rat ,I
20/5/23,7 Magpies ,C
22/5/23,1 x Rat ,Church
23/5/23,1 x Rat ,A
26/5/23,2 x Hedgehogs ,K
26/5/23,1 x Rat ,C
29/5/23,2 x Possum ,C
29/5/23,1 x Possum ,E
20/5/23,5 Magpies ,C
31/5/23,1 x Rat ,I
31/5/23,1 Possum ,C
31/5/23,1 Rat,B
1/6/23,1x Stoat ,I
2/6/23,1 x Possum ,I
2/6/23,1 x Rat ,A
3/6/23,1 x Rat ,K
6/6/23,1 x Possum ,C
6/6/23,1 x Possum ,I
7/6/23,1 x Rat ,G
12/6/23,1 x Possum ,D
14/6/23,1 x Rat ,I
16/6/23,1 x Weasel ,K
19/6/23,3 x Rats ,K
20/6/23,1 x Rat ,Church
21/7/23,1 x Possum ,K
22/6/23,1 x Possum ,C
25/6/23,1 x Rat ,K
3/7/23,1 x Rat ,C
7/7/23,1 x Weasel ,K
7/7/23,4 x Possums ,K
17/7/23,1 x Possum ,C
18/7/23,1 x Stoat ,B
18/7/23,1 x Stoat ,D
19/7/23,3 x Possums ,K
25/7/23,2 x Possums ,K
9/8/23,1 Rat ,I
9/8/23,1 Stoat ,K
9/8/23,2 x Possums ,K
10/8/23,1 x Rat ,F
11/8/23,1 x Rat ,Church
14/8/23,1 x Stoat ,I
20/8/23,5 Rabbits 5 Hares ,L
28/8/23,1 x Rat ,I
31/8/23,1 x Rat ,K
3/9/23,1 x Stoat ,K
11/9/23,1 x Rat ,C
11/9/23,1x Rat ,I
11/9/23,3 x Possums ,C
14/9/23,1 x Rat ,I
14/9/23,1 x Hedgehog ,E
18/9/23,1 x Hedgehog ,E
4/10/23,1x Rat ,K
10/10/23,7 x Rabbits ,L
4/10/23,2 x Rats ,B
9/10/23,1 x Possum ,C
10/10/23,1 x Hedgehog ,E
16/10/23,1 Rat,B
20/10/23,16 x Magpies ,C
20/11/23,1 x Possum ,E
26/11/23,1 x Rat ,I
26/11/23,1 x Hedgehog ,K
20/11/23,4 x Magpies ,C
4/12/23,1 x Hedgehog ,E
6/12/23,2 x Stoats ,A
6/12/23,Hedgehog ,A
15/12/23,8 Rabbits ,L
22/12/23,1 Hedgehog ,D
22/12/23,1 Stoat ,D`,
  fy22: `3/1/22,1 x stoat,B,Doc200
7/1/22,1 x Possum,C,Possum Master
10/1/22,1 x Rat,B,Doc200
17/1/22,1 x Deer,E,Shot
17/1/22,1 x Rat,C,Doc200
17/1/22,1 x Possum,C,Possum Master
18/1/22,1 x Stoat,C,Doc200
18/1/22,3 x Goats,E,Shot
21/1/22,1 x Rat,C,Doc200
28/1/22,1 x Stoat,B,Doc200
8/2/22,1 x Stoat,E,Doc200
8/2/22,1 x Hedgehog,E,Doc200
9/2/22,1 x Hedgehog,H,Doc200
22/2/22,1 x Hedgehog,E,Doc200
23/2/22,1 x Hedgehog,E,Doc200
15/2/22,3 Red deer,H,Shot
11/3/22,1 x Stoat,B,Doc200
14/3/22,1 x Possum,K,Possum Master
18/3/22,1 x Possum,K,Possum Master
20/3/22,7 x Goats,K,Shot
20/3/22,5 x Red deer,Farm2,Shot
10/3/22,3 x Fellow deer,B,Shot
6/4/22,1 x stoat,K,Doc200
6/4/22,3 x Possums,K,Possum Master
6/4/22,2 x Rats,K,Doc200
7/4/22,1 x Rat,B,Doc200
11/4/22,2 x Possums,K,Possum Master
13/4/22,1 x Rat,I,Doc200
26/4/22,1 x Possum,K,Possum Master
26/4/22,1 x Rat,K,Doc200
15/4/22,5 x Deer 1 Pig 1 Goat,Farm2,Shot
3/5/22,1 x Possum,K,Possum Master
3/5/22,2 x Rats,K,Doc200
3/5/22,1 x Rat,B,Doc200
6/5/22,2 x Possums,K,Possum Master
6/5/22,1 x Rat,I,Doc200
10/5/22,1 x Possum,C,Possum Master
11/5/22,1 x Possum,C,Possum Master
11/5/22,1 x Goat,E,Shot
12/5/22,2 x Possums,K,Possum Master
12/5/22,2 x Rats,K,Doc200
16/5/22,1 x Rat,K,Doc200
18/5/22,1 x Possum,C,Possum Master
20/5/22,1 x Possum,K,Possum Master
21/5/22,2 x Goats,E,Shot
25/5/22,1 x Stoat,K,Doc200
27/5/22,1 x Rat,K,Doc200
27/5/22,1 x Rat,F,Bait Station
22/5/22,2 Deer 1Pig,Farm2,Shot
7/6/22,1 x Possum,K,Possum Master
7/6/22,2 x Rats,K,Doc200
8/6/22,1 x Rat,C,Doc200
10/6/22,1 x Rat,C,Doc200`
};

function getSpeciesGroup(species: string): EarthRecord['speciesGroup'] {
  const s = species.toLowerCase();
  if (s.includes('possum')) return 'Possum';
  if (s.includes('rat') || s.includes('stoat') || s.includes('weasel') || s.includes('hedgehog')) return 'Rat/Stoat';
  if (s.includes('deer') || s.includes('goat') || s.includes('pig') || s.includes('hare') || s.includes('rabbit')) return 'Large Browser';
  return 'Other';
}

export function parseEarthData(): EarthRecord[] {
  const records: EarthRecord[] = [];
  
  Object.values(PEST_CSV_DATA).forEach(csv => {
    const lines = csv.split('\n');
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const parts = trimmedLine.split(',');
      if (parts.length < 2) return;
      
      const dateStr = parts[0].trim();
      const desc = parts[1].trim();
      const block = parts[2] ? parts[2].trim() : 'Unknown';
      const method = parts[3] ? parts[3].trim() : 'Unspecified';
      
      const dateParts = dateStr.split('/');
      if (dateParts.length !== 3) return;
      
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      let year = parseInt(dateParts[2]);
      if (year < 100) year += 2000;
      
      const dateObj = new Date(year, month, day);
      const items = desc.split('+').map(i => i.trim());
      
      items.forEach(item => {
        const match = item.match(/(\d+)\s*(?:x|X)?\s*(.*)/);
        let count = 1;
        let species = item;
        
        if (match) {
          count = parseInt(match[1]);
          species = match[2].trim() || 'Unknown';
        }

        records.push({
          id: `earth-${dateStr}-${index}-${species.replace(/\s+/g, '-')}`,
          date: dateObj,
          year,
          month,
          count,
          species,
          block,
          method,
          speciesGroup: getSpeciesGroup(species)
        });
      });
    });
  });
  
  return records.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return b.date.getTime() - a.date.getTime();
  });
}
