import { Gift } from 'lucide-react';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface ProductWhatsAppOrderProps {
  storeName: string;
  whatsappOrderUrl: string;
  whatsappShareUrl: string;
  logoUrl?: string;
}

/** Rio Gift Shop–style “Order on WhatsApp” pill + WhatsApp share row. */
const ProductWhatsAppOrder = ({
  storeName,
  whatsappOrderUrl,
  whatsappShareUrl,
  logoUrl,
}: ProductWhatsAppOrderProps) => {
  return (
    <div className="mb-6 max-w-md">
      <a
        href={whatsappOrderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 bg-white rounded-full border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] px-4 py-3 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow"
      >
        <div className="relative shrink-0">
          <div className="w-[72px] h-[72px] rounded-full bg-[#d81b8c] flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-14 h-14 object-contain" />
            ) : (
              <div className="flex flex-col items-center text-white">
                <Gift className="w-8 h-8" strokeWidth={1.5} />
                <span className="text-[9px] font-bold tracking-wider mt-0.5">VGS</span>
              </div>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
            <WhatsAppIcon className="w-4 h-4" />
          </span>
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-[#81d742] font-semibold text-sm truncate">{storeName}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide bg-[#81d742] text-white px-2 py-0.5 rounded-full shrink-0">
              Online
            </span>
          </div>
          <p className="text-[#2d8a2d] font-bold text-lg leading-tight">Order On WhatsApp</p>
        </div>
      </a>

      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-200">
        <span className="font-bold text-gray-900 text-sm">Share it :</span>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-sm transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default ProductWhatsAppOrder;
