// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { getAdsData, getSummaryKpis } from "../api/windsorApi";
import SummaryMetrics from "./SummaryMetrics";
import MetricsGrid from "./MetricsGrid";
import FilterBar from "./FilterBar";
import useDateFilter from "../hooks/useDateFilter";


const Dashboard = () => {
  const [ads, setAds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { range, setRange, humanLabel } = useDateFilter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");


  // Carga de datos de anuncios y KPIs
  const load = async () => {
    try {
      setLoading(true);
      const args = { datePreset: range.preset };
      const [adsData, summaryData] = await Promise.all([
        getAdsData({ ...args }),
        getSummaryKpis({ ...args }),
      ]);
      setAds(Array.isArray(adsData) ? adsData : []);
      setSummary(summaryData || null);
    } catch (e) {
      console.error("Error cargando datos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { load(); setStatusFilter("all"); /* eslint-disable-next-line */ }, [range.preset]);

  // Agrupa anuncios por ad_id y suma inversión, revenue y compras
  function groupAds(list) {
    const groupMap = new Map();
    list.forEach(ad => {
      const key = ad.ad_id || `${ad.ad_name}_${ad.campaign || ''}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          ...ad,
          totalcost: parseFloat(ad.totalcost) || 0,
          action_values_omni_purchase: parseFloat(ad.action_values_omni_purchase) || 0,
          actions_omni_purchase: parseFloat(ad.actions_omni_purchase) || 0,
        });
      } else {
        const existing = groupMap.get(key);
        existing.totalcost += parseFloat(ad.totalcost) || 0;
        existing.action_values_omni_purchase += parseFloat(ad.action_values_omni_purchase) || 0;
        existing.actions_omni_purchase += parseFloat(ad.actions_omni_purchase) || 0;
      }
    });
    // Recalcular CPA y otros campos derivados si es necesario en el componente de la card
    return Array.from(groupMap.values());
  }

    const normalize = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const groupedAds = groupAds(ads).filter(ad => {
    if (!search) return true;
    const adName = normalize(ad.ad_name || "");
    const campaignName = normalize(ad.campaign_name || "");
    return adName.includes(search) || campaignName.includes(search);
  });

  const filteredAds = groupedAds.filter(ad => {
    if (statusFilter === "all") return true;
    const adStatus = String(ad?.status || "").toUpperCase();
    const campStatus = String(ad?.campaign_status || "").toUpperCase();
    const adsetStatus = String(ad?.adset_status || "").toUpperCase();
    if (statusFilter === "on") return adStatus === "ACTIVE" && campStatus === "ACTIVE" && adsetStatus === "ACTIVE";
    if (statusFilter === "off") return adStatus === "PAUSED" || campStatus === "PAUSED" || adsetStatus === "PAUSED";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">De Viaje</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Performance de Anuncios</h1>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-[11px] rounded-full border border-gray-200 bg-white/70 text-gray-600">
              {humanLabel}
            </span>
          </div>
          <FilterBar
            value={range}
            onChange={setRange}
            selectedStatus={statusFilter}
            onChangeStatus={setStatusFilter}
            onSearch={setSearch}
          />
        </div>

        {loading ? (
          <div className="h-40 grid place-items-center text-gray-500">Cargando datos…</div>
        ) : (
          <>
            <SummaryMetrics summary={summary} />
            <MetricsGrid ads={filteredAds} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;