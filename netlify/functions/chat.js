const buildResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(payload)
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return buildResponse(200, {});
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return buildResponse(500, { error: 'Missing CLAUDE_API_KEY.' });
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const prompt = payload.prompt;
    const system = payload.system;

    if (!prompt) {
      return buildResponse(400, { error: 'Missing prompt.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 400,
        system: typeof system === 'string' && system.trim().length > 0 ? system : undefined,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const details = await response.text();
      return buildResponse(502, { error: 'Claude request failed.', details });
    }

    const json = await response.json();
    const text = json?.content?.[0]?.text || '';
    return buildResponse(200, { text });
  } catch (error) {
    return buildResponse(500, { error: 'Chat service error.' });
  }
};
