import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs({ category, page }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <div className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </div>
      
      <ChevronRight className="w-4 h-4 text-slate-600" />
      
      <div className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
        <span>{category}</span>
      </div>
      
      <ChevronRight className="w-4 h-4 text-slate-600" />
      
      <div className="flex items-center gap-2 text-indigo-400 font-medium">
        <span>{page}</span>
      </div>
    </nav>
  );
}