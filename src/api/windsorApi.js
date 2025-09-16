import axios from "axios";

// --- NUEVA FUNCIÓN PARA KPIs CONSOLIDADOS (SummaryMetrics) ---
export async function getSummaryKpis({
  datePreset = "this_month",
  from = null,
  to = null,
  account = DEFAULT_ACCOUNT,
  timezone = DEFAULT_TZ,
  source = DEFAULT_SOURCE,
} = {}) {
  const baseURL = "https://connectors.windsor.ai/all";
  const KPI_FIELDS = [
    "totalcost",
    "actions_omni_purchase",
    "action_values_offsite_conversion_fb_pixel_purchase",
  ];
  const params = new URLSearchParams({
    api_key: API_KEY,
    fields: KPI_FIELDS.join(","),
  });

  // Lógica de fechas igual que en getAdsData
  const preset = (datePreset || "").trim();
  const alias = {
    yesterday: "last_1d",
    last_month: "last_1m",
  };
  const tzNorm = normalizeTimezone(timezone || DEFAULT_TZ);

  if (preset === "today") {
    const today = tzTodayISO(tzNorm);
    params.append("date_from", today);
    params.append("date_to", today);
  } else if (preset && preset !== "custom") {
    params.append("date_preset", alias[preset] || preset);
  } else if (preset === "custom" && from && to) {
    params.append("date_from", from);
    params.append("date_to", to);
  } else {
    params.append("date_preset", "this_month");
  }

  if (account) params.append("select_accounts", account);
  if (source) params.append("source", source);
  if (tzNorm) params.append("timezone", tzNorm);

  const url = `${baseURL}?${params.toString()}`;
  if (String(process.env.REACT_APP_DEBUG_WINDSOR).toLowerCase() === "true") {
    try {
      const safe = new URL(url);
      safe.searchParams.set("api_key", "***");
      // eslint-disable-next-line no-console
      console.debug("Windsor KPI URL:", safe.toString());
    } catch {}
  }
  const res = await axios.get(url);
  const payload = res?.data?.data ?? res?.data;
  // Si la respuesta es un array con un solo objeto, devolver ese objeto
  return Array.isArray(payload) && payload.length === 1 ? payload[0] : payload;
}


const API_KEY = process.env.REACT_APP_WINDSOR_API_KEY;
const DEFAULT_ACCOUNT = (process.env.REACT_APP_WINDSOR_ACCOUNT || "").trim();
const DEFAULT_TZ = (process.env.REACT_APP_WINDSOR_TIMEZONE || "America/Buenos_Aires").trim();
const DEFAULT_SOURCE = (process.env.REACT_APP_WINDSOR_SOURCE || "").trim();

/* --------------------------------- Fields --------------------------------- */
const FIELDS = [
  "ad_name",
  "ad_id",
  "campaign",
  "campaign_status",
  "adset_status",
  "totalcost",
  "actions_omni_purchase",
  "action_values_omni_purchase",
  "status",
  "thumbnail_url",
];

/* --------------------------- Date helpers (TZ) ---------------------------- */
function normalizeTimezone(tz) {
  const map = {
    AST: "America/Buenos_Aires",
    "Atlantic Standard Time": "America/Buenos_Aires",
  };
  return map[tz] || tz;
}

// Devuelve YYYY-MM-DD para la fecha actual en la zona horaria dada
function tzTodayISO(timeZone) {
  // Obtener la fecha local en la zona horaria especificada y formatear YYYY-MM-DD
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

/* ----------------------------------- API ---------------------------------- */
export async function getAdsData({
  datePreset = "this_month",
  from = null,
  to = null,
  account = DEFAULT_ACCOUNT,
  timezone = DEFAULT_TZ,
  source = DEFAULT_SOURCE, // opcional: "facebook", "google_ads", etc.
} = {}) {
  const baseURL = "https://connectors.windsor.ai/all";
  const params = new URLSearchParams({
    api_key: API_KEY,
    fields: FIELDS.join(","),
  });

  // Usar presets nativos de Windsor; mapear aliases comunes
  const preset = (datePreset || "").trim();
  // NO usamos alias para los presets, enviamos tal cual a la API
  // excepto para los casos específicos que necesitan traducción
  const alias = {
    yesterday: "last_1d",
    last_month: "last_1m",
    // No incluimos last_30d, last_7d, etc. para usar el valor original
    // ya que Windsor los acepta directamente
    // today: "today", // si Windsor no lo soporta, considerar fallback a from/to
  };

  const tzNorm = normalizeTimezone(timezone || DEFAULT_TZ);

  if (preset === "today") {
    // Requisito: Windsor espera today como rango explícito (from/to del día)
    const today = tzTodayISO(tzNorm);
    params.append("date_from", today);
    params.append("date_to", today);
  } else if (preset && preset !== "custom") {
    params.append("date_preset", alias[preset] || preset);
  } else if (preset === "custom" && from && to) {
    // Rango custom sin transformaciones locales (passthrough)
    params.append("date_from", from);
    params.append("date_to", to);
  } else {
    // Valor por defecto
    params.append("date_preset", "this_month");
  }

  // Forzar cuenta
  if (account) params.append("select_accounts", account);
  // Opcional: filtrar por fuente
  if (source) params.append("source", source);
  // Timezone (para que Windsor entienda el rango correctamente)
  if (tzNorm) params.append("timezone", tzNorm);

  const url = `${baseURL}?${params.toString()}`;
  if (String(process.env.REACT_APP_DEBUG_WINDSOR).toLowerCase() === "true") {
    // Log the final URL (without api key) for debugging
    try {
      const safe = new URL(url);
      safe.searchParams.set("api_key", "***");
      // eslint-disable-next-line no-console
      console.debug("Windsor URL:", safe.toString());
    } catch {}
  }
  const res = await axios.get(url);
  const payload = res?.data?.data ?? res?.data;
  return Array.isArray(payload) ? payload : [];
}
