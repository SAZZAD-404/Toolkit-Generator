export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main Content - Scrollable */}
      <div className="w-full p-2 md:p-4">
        <div className="w-full bg-slate-800/30 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-700/50 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}