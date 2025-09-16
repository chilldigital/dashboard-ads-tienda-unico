const StatCard = ({ icon, label, value }) => {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-4 h-full">
      <div className="flex items-center gap-3 h-full">
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-lg text-gray-700">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 whitespace-nowrap">{label}</p>
          <p className="text-2xl md:text-xl xl:text-lg font-semibold text-gray-900 leading-snug break-words whitespace-normal">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
export default StatCard;
