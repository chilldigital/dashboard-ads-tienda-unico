// src/hooks/useDateFilter.js
import { useEffect, useMemo, useState } from "react";

const parseParams = () => {
  const sp = new URLSearchParams(window.location.search);
  const preset = sp.get("preset") || "this_month";
  const from = sp.get("from") || "";
  const to = sp.get("to") || "";
  return { preset, from, to };
};

const writeParams = (state) => {
  const sp = new URLSearchParams(window.location.search);
  sp.set("preset", state.preset || "this_month");
  if (state.preset === "custom") {
    state.from ? sp.set("from", state.from) : sp.delete("from");
    state.to ? sp.set("to", state.to) : sp.delete("to");
  } else {
    sp.delete("from");
    sp.delete("to");
  }
  const url = `${window.location.pathname}?${sp.toString()}`;
  window.history.replaceState({}, "", url);
};

export default function useDateFilter() {
  const [range, setRange] = useState(parseParams);

  // cada cambio de rango → persistir en URL
  useEffect(() => { writeParams(range); }, [range]);

  const humanLabel = useMemo(() => {
    if (range.preset === "custom" && range.from && range.to) {
      return `Del ${range.from} al ${range.to}`;
    }
    const map = {
      today: "Hoy",
      yesterday: "Ayer",
      last_7d: "Últimos 7 días",
      last_14d: "Últimos 14 días",
      last_30d: "Últimos 30 días",
      this_month: "Este mes",
      last_month: "Mes pasado",
      this_year: "Este año",
      custom: "Rango personalizado",
    };
    return map[range.preset] || "Este mes";
  }, [range]);

  return { range, setRange, humanLabel };
}
