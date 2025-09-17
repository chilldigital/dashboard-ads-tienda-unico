import axios from "axios";

// --- NUEVA FUNCIÓN PARA KPIs CONSOLIDADOS (SummaryMetrics) ---
export async function getSummaryKpis({
  datePreset = "this_month",
  from = null,
  to = null,
  // account eliminado
  timezone = DEFAULT_TZ,
  source = DEFAULT_SOURCE,
} = {}) {
  const KPI_FIELDS = [
    "totalcost",
    "actions_omni_purchase",
    "action_values_offsite_conversion_fb_pixel_purchase",
  ];
  const params = new URLSearchParams({
    fields: KPI_FIELDS.join(","),
    datePreset,
    from,
    to,
    // account eliminado
    timezone,
    source,
  });
  const url = `/api/meta?${params.toString()}`;
  const res = await axios.get(url);
  const payload = res?.data?.data ?? res?.data;
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
  const params = new URLSearchParams({
    fields: FIELDS.join(","),
    datePreset,
    from,
    to,
    account,
    timezone,
    source,
  });
  const url = `/api/meta?${params.toString()}`;
  const res = await axios.get(url);
  const payload = res?.data?.data ?? res?.data;
  return Array.isArray(payload) ? payload : [];
}