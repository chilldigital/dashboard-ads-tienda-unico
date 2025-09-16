import { useEffect, useState } from "react";

const presets = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "last_7d", label: "Últimos 7 días" },
  { value: "last_14d", label: "Últimos 14 días" },
  { value: "last_30d", label: "Últimos 30 días" },
  { value: "this_month", label: "Este mes" },
  { value: "last_month", label: "Mes pasado" },
  { value: "this_year", label: "Este año" },
];

const normalize = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function FilterBar({
  value,
  onChange,
  onSearch,
  selectedStatus,
  onChangeStatus,
  accounts = [],
  selectedAccount,
  onChangeAccount,
  timezones = [],
  selectedTimezone,
  onChangeTimezone,
}) {
  const [local, setLocal] = useState(value);
  const [search, setSearch] = useState("");

  useEffect(() => setLocal(value), [value]);

  const handlePreset = (e) => {
    const v = e.target.value;
    const next = { preset: v };
    setLocal(next);
    onChange(next);
  };

  const SelectShell = ({ id, aria, value, onChange, children }) => (
    <div className="relative w-full md:w-auto">
      <select
        id={id}
        aria-label={aria}
        value={value}
        onChange={onChange}
        className={[
          "appearance-none h-10 pl-3 pr-9 rounded-xl w-full md:w-auto",
          "border border-gray-200 bg-white",
          "text-sm text-gray-700",
          "hover:border-gray-300",
          "focus:outline-none focus:ring-2 focus:ring-indigo-200/30 focus:border-indigo-200",
          "transition-colors",
        ].join(" ")}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );

  const statusOptions = [
    { key: "all", label: "Todos" },
    { key: "on", label: "Activos" },
    { key: "off", label: "Pausados" },
  ];

  return (
    <div className="flex flex-col w-full gap-3 md:w-auto md:flex-row md:flex-nowrap md:items-center md:gap-3">
      <input
        type="text"
        placeholder="Buscar anuncio"
        value={search}
        onChange={(e) => {
          const val = e.target.value;
          setSearch(val);
          onSearch?.(normalize(val));
        }}
        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200/40 transition w-72 bg-white text-gray-700 placeholder:text-gray-400"
      />

      <div className="w-full md:w-auto">
        <SelectShell
          id="preset"
          aria="Seleccionar período"
          value={local.preset}
          onChange={handlePreset}
        >
          {presets.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </SelectShell>
      </div>

      {onChangeStatus && (
        <div
          role="group"
          aria-label="Estado"
          className="flex md:inline-flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden"
        >
          {statusOptions.map((opt, i) => {
            const active = (selectedStatus ?? "all") === opt.key;
            const base =
              "px-4 h-10 text-sm text-center justify-center min-w-0 flex-1 md:flex-none md:w-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/30 transition-colors inline-flex items-center";
            const shape =
              i === 0
                ? "rounded-l-xl"
                : i === statusOptions.length - 1
                ? "md:-ml-px rounded-r-xl"
                : "md:-ml-px";
            return (
              <button
                key={opt.key}
                type="button"
                aria-pressed={active}
                onClick={() => onChangeStatus(opt.key)}
                className={[
                  base,
                  shape,
                  active
                    ? "bg-indigo-50 text-indigo-500 border border-transparent"
                    : "bg-transparent text-gray-700 border border-transparent hover:bg-gray-50",
                ].join(" ")}
              >
                <span className="inline-flex items-center gap-2">
                  {opt.key === "on" && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                  {opt.key === "off" && (
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {accounts.length > 0 && onChangeAccount && (
        <div className="w-full md:w-auto">
          <SelectShell
            id="account"
            aria="Seleccionar cuenta"
            value={selectedAccount ?? ""}
            onChange={(e) => onChangeAccount(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </SelectShell>
        </div>
      )}

      {timezones.length > 0 && onChangeTimezone && (
        <div className="w-full md:w-auto">
          <SelectShell
            id="tz"
            aria="Seleccionar zona horaria"
            value={selectedTimezone ?? ""}
            onChange={(e) => onChangeTimezone(e.target.value)}
          >
            {timezones.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </SelectShell>
        </div>
      )}
    </div>
  );
}
