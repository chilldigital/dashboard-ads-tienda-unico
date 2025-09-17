export default async function handler(req, res) {
  // Permitir GET y POST
  const method = req.method || 'GET';
  const params = method === 'POST' ? req.body : req.query;

  const baseURL = 'https://connectors.windsor.ai/all';
  const apiKey = process.env.META_API_KEY;
  const {
    fields,
    datePreset = 'this_month',
    from = null,
    to = null,
    // account eliminado del destructuring
    timezone = 'America/Buenos_Aires',
    source = '',
    ...rest
  } = params;

  // Obtener el valor de account solo desde variable de entorno
  const account = process.env.WINDSOR_ACCOUNT;

  // Normalizar timezone
  function normalizeTimezone(tz) {
    const map = {
      AST: 'America/Buenos_Aires',
      'Atlantic Standard Time': 'America/Buenos_Aires',
    };
    return map[tz] || tz;
  }

  // Fecha actual en zona horaria dada (YYYY-MM-DD)
  function tzTodayISO(timeZone) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);
    const yyyy = parts.find(p => p.type === 'year').value;
    const mm = parts.find(p => p.type === 'month').value;
    const dd = parts.find(p => p.type === 'day').value;
    return `${yyyy}-${mm}-${dd}`;
  }

  const urlParams = new URLSearchParams();
  urlParams.append('api_key', apiKey);
  if (fields) urlParams.append('fields', fields);

  // Lógica de fechas y presets
  const preset = (datePreset || '').trim();
  const alias = {
    yesterday: 'last_1d',
    last_month: 'last_1m',
  };
  const tzNorm = normalizeTimezone(timezone || 'America/Buenos_Aires');

  if (preset === 'today') {
    const today = tzTodayISO(tzNorm);
    urlParams.append('date_from', today);
    urlParams.append('date_to', today);
  } else if (preset && preset !== 'custom') {
    urlParams.append('date_preset', alias[preset] || preset);
  } else if (preset === 'custom' && from && to) {
    urlParams.append('date_from', from);
    urlParams.append('date_to', to);
  } else {
    urlParams.append('date_preset', 'this_month');
  }

  if (account) urlParams.append('select_accounts', account);
  if (source) urlParams.append('source', source);
  if (tzNorm) urlParams.append('timezone', tzNorm);

  // Agregar cualquier otro parámetro extra recibido
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, value);
    }
  });

  const fullUrl = `${baseURL}?${urlParams.toString()}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al obtener datos de Meta' });
  }
}