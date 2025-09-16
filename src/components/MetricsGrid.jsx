// src/components/MetricsGrid.jsx
import AdCard from "./AdCard";

const MetricsGrid = ({ ads }) => {
  const list = Array.isArray(ads) ? ads : [];
  if (list.length === 0) {
    return (
      <p className="text-gray-500 mt-10 text-center">No hay anuncios disponibles</p>
    );
  }
  // Orden por mayor cantidad de compras
  const sorted = [...list].sort(
    (a, b) =>
      (parseFloat(b.actions_omni_purchase) || 0) -
      (parseFloat(a.actions_omni_purchase) || 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sorted.map((ad, idx) => (
        <AdCard key={`${ad.ad_id}_${idx}`} ad={ad} />
      ))}
    </div>
  );
};

export default MetricsGrid;
