
import StatCard from "./StatCard";

const SummaryMetrics = ({ summary }) => {
  // summary: { totalcost, actions_omni_purchase, action_values_offsite_conversion_fb_pixel_purchase }
  const spend = parseFloat(summary?.totalcost) || 0;
  const purchases = parseFloat(summary?.actions_omni_purchase) || 0;
  const revenue = parseFloat(summary?.action_values_offsite_conversion_fb_pixel_purchase) || 0;

  const cpa = purchases > 0 ? spend / purchases : null;
  const roas = spend > 0 ? revenue / spend : null;
  const ticket = purchases > 0 ? revenue / purchases : null;


  // Redondea a entero y agrega separador de miles
  const money = (n) =>
    `$${Math.round(n ?? 0).toLocaleString("es-AR")}`;

  return (
    <div className="w-full px-2 sm:px-0">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-8 mt-6">
        <StatCard icon="💸" label="Inversión" value={money(spend)} />
        <StatCard icon="🛒" label="Compras" value={purchases.toLocaleString("en-US")}/>
        <StatCard icon="📉" label="CPA" value={cpa == null ? "-" : money(cpa)} />
        <StatCard icon="💰" label="Revenue" value={money(revenue)} />
        <StatCard icon="🚀" label="ROAS" value={roas == null ? "-" : roas.toFixed(2)} />
        <StatCard icon="🎯" label="Ticket Promedio" value={ticket == null ? "-" : money(ticket)} />
      </div>
    </div>
  );
};

export default SummaryMetrics;
