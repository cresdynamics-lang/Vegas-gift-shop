import type { ProductDescriptionContent } from '../types/product';

type Props = {
  content: ProductDescriptionContent;
};

/** Rio Gift Shop–style product description: intro paragraphs + titled package lists */
export default function ProductDescription({ content }: Props) {
  const paragraphs = content.intro
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="product-description-rio">
      {paragraphs.length > 0 ? (
        <div className="space-y-4 mb-8 text-gray-600 leading-relaxed">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ) : null}

      {content.sections.map((section) => (
        <div key={section.title} className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
            {section.title}
          </h3>
          <ul className="space-y-2 list-none pl-0">
            {section.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                <span className="text-red-600 font-bold shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
