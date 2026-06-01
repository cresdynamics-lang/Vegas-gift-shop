import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface InfoPageShellProps {
  title: string;
  children: ReactNode;
  darkHero?: boolean;
}

/** Shared breadcrumb + footer CTA for info pages. */
const InfoPageShell = ({ title, children, darkHero = false }: InfoPageShellProps) => {
  return (
    <div className={darkHero ? 'bg-[#0a0a0a]' : 'bg-white'}>
      <div
        className={`max-w-7xl mx-auto px-4 pt-6 ${darkHero ? 'text-white/70' : 'text-gray-500'}`}
      >
        <nav className="text-sm" aria-label="Breadcrumb">
          <Link to="/" className={darkHero ? 'hover:text-red-400' : 'hover:text-red-600'}>
            Home
          </Link>
          <ChevronRight size={14} className="inline mx-1 align-middle opacity-60" />
          <span className={darkHero ? 'text-white' : 'text-gray-800'}>{title}</span>
        </nav>
      </div>
      {children}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100 flex flex-wrap gap-6 text-sm bg-white">
        <Link to="/shop" className="text-red-600 font-bold hover:underline uppercase tracking-wide text-xs">
          Continue shopping
        </Link>
        <Link to="/contact" className="text-gray-600 hover:text-red-600 font-medium">
          Contact support
        </Link>
        <Link to="/faq" className="text-gray-600 hover:text-red-600 font-medium">
          FAQs
        </Link>
      </div>
    </div>
  );
};

export default InfoPageShell;
