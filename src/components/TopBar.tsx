import { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface PublicSettings {
  general: { phone: string; phoneSecondary: string };
  branding: { topBarMessage: string; topBarSubMessage: string; accentColor: string };
}

const TopBar = () => {
  const [settings, setSettings] = useState<PublicSettings | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/settings/public`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => null);
  }, []);

  const message = settings?.branding.topBarMessage || 'Call us on: +254792 943753 to place your order.';
  const subMessage = settings?.branding.topBarSubMessage || 'Same day delivery in Nairobi.';
  const accent = settings?.branding.accentColor || '#dc2626';

  return (
    <div className="text-white py-2 px-4 border-b text-sm" style={{ backgroundColor: accent, borderColor: accent }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <div>{message}</div>
        <div className="hidden md:block">{subMessage}</div>
      </div>
    </div>
  );
};

export default TopBar;
