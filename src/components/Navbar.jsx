// src/components/Navbar.jsx
const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white text-lg shadow">
            📊
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Tienda Único</p>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Performance de Anuncios</h1>
          </div>
        </div>
        {/* ← Quitamos select y botón; solo header limpio */}
      </div>
    </nav>
  );
};

export default Navbar;