import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { InfoPageContent } from '../data/infoPages';
import { formatDisplayText } from '../utils/formatText';

interface InfoPageLayoutProps {
  content: InfoPageContent;
  accent?: 'red' | 'gray';
  /** Contact, privacy, terms, FAQ: flush text, no side borders or pill badges */
  plain?: boolean;
}

const InfoPageLayout = ({ content, accent = 'red', plain = false }: InfoPageLayoutProps) => {
  const heroGradient =
    accent === 'red'
      ? 'from-red-600/10 via-white to-amber-50/30'
      : 'from-gray-100 via-white to-gray-50';

  if (plain) {
    return (
      <div className="bg-white min-h-[60vh]">
        <div className={`border-b border-gray-200 bg-gradient-to-br ${heroGradient}`}>
          <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
            <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-red-600">
                Home
              </Link>
              <ChevronRight size={14} className="inline mx-1 align-middle" />
              <span className="text-gray-800">{content.title}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {formatDisplayText(content.title)}
            </h1>
            {content.subtitle && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
                {formatDisplayText(content.subtitle)}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-2">Last updated: {content.lastUpdated}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 border-b border-gray-100">
          <article className="space-y-8 max-w-none">
            {content.sections.map((section, index) => (
              <section key={index} className="text-gray-700 leading-relaxed">
                {section.heading && (
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    {formatDisplayText(section.heading)}
                  </h2>
                )}
                {section.paragraphs?.map((p, i) => (
                  <p key={i} className="mb-3 text-base">
                    {formatDisplayText(p)}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-2 text-base list-disc pl-5">
                    {section.list.map((item, i) => (
                      <li key={i}>{formatDisplayText(item)}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
            <Link to="/shop" className="text-red-600 font-semibold hover:underline">
              Continue shopping
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-600">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[60vh]">
      <div className={`bg-gradient-to-br ${heroGradient} border-b border-gray-100`}>
        <div className="max-w-3xl mx-auto px-4 py-10 lg:py-12">
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-red-600">
              Home
            </Link>
            <ChevronRight size={14} className="inline mx-1 align-middle" />
            <span className="text-gray-800">{content.title}</span>
          </nav>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {formatDisplayText(content.title)}
            </h1>
            {content.subtitle && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {formatDisplayText(content.subtitle)}
              </p>
            )}
            <p className="text-sm text-gray-400 mt-3">Last updated: {content.lastUpdated}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 lg:py-12">
        <article className="space-y-10">
          {content.sections.map((section, index) => (
            <section
              key={index}
              className="text-gray-700 leading-relaxed border-l-2 border-red-100 pl-6 hover:border-red-300 transition-colors"
            >
              {section.heading && (
                <h2 className="text-xl font-bold text-gray-900 mb-3 -ml-6 pl-6 border-l-2 border-red-600">
                  {formatDisplayText(section.heading)}
                </h2>
              )}
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="mb-3 text-base">
                  {formatDisplayText(p)}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-2 text-base">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span>{formatDisplayText(item)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
          <Link to="/shop" className="text-red-600 font-semibold hover:underline">
            Continue shopping
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-red-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoPageLayout;
