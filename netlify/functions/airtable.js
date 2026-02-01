const buildResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(payload)
});

const getEnv = (key, fallback = '') => {
  return process.env[key] || fallback;
};

const AIRTABLE_API_KEY = getEnv('AIRTABLE_API_KEY', getEnv('VITE_AIRTABLE_API_KEY', ''));
const AIRTABLE_BASE_ID = getEnv('AIRTABLE_BASE_ID', getEnv('VITE_AIRTABLE_BASE_ID', ''));
const AIRTABLE_TABLE_NAME = getEnv('AIRTABLE_TABLE_NAME', getEnv('VITE_AIRTABLE_TABLE_NAME', 'Impact Reporting'));
const AIRTABLE_VIEW_NAME = getEnv('AIRTABLE_VIEW_NAME', getEnv('VITE_AIRTABLE_VIEW_NAME', ''));
const AIRTABLE_TEAM_TABLE = getEnv('AIRTABLE_TEAM_TABLE', getEnv('VITE_AIRTABLE_TEAM_TABLE', 'Team'));
const AIRTABLE_EVENTS_TABLE = getEnv('AIRTABLE_EVENTS_TABLE', 'Events');

const TABLE_MAP = {
  records: { name: AIRTABLE_TABLE_NAME, view: AIRTABLE_VIEW_NAME },
  orgs: { name: 'Organisations' },
  team: { name: AIRTABLE_TEAM_TABLE },
  events: { name: AIRTABLE_EVENTS_TABLE }
};

const fetchAllRecords = async ({ name, view }) => {
  let allRecords = [];
  let offset = '';

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(name)}`);
    if (view) url.searchParams.append('view', view);
    if (offset) url.searchParams.append('offset', offset);
    url.searchParams.append('pageSize', '100');

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Airtable request failed (${response.status}): ${details}`);
    }

    const data = await response.json();
    allRecords = [...allRecords, ...(data.records || [])];
    offset = data.offset;
  } while (offset);

  return allRecords;
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return buildResponse(200, {});
  }

  const type = event.queryStringParameters?.type || 'records';
  const tableConfig = TABLE_MAP[type];

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return buildResponse(500, { error: 'Missing Airtable configuration.' });
  }

  if (!tableConfig) {
    return buildResponse(400, { error: 'Unknown table type.' });
  }

  try {
    const records = await fetchAllRecords(tableConfig);
    return buildResponse(200, { records });
  } catch (error) {
    return buildResponse(500, { error: 'Airtable fetch failed.', details: error.message });
  }
};
