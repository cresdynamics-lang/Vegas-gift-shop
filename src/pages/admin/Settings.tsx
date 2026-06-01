import React, { useEffect, useState } from 'react';
import {
  Globe,
  CreditCard,
  Truck,
  Palette,
  ShieldCheck,
  Bell,
  Star,
  Save,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_URL } from '../../config';
import { useAuthStore } from '../../store/useAuthStore';
import {
  DEFAULT_SETTINGS,
  type StoreSettings,
  type ShippingZone,
  type GoogleReview,
} from '../../types/settings';

type TabId =
  | 'general'
  | 'payments'
  | 'shipping'
  | 'branding'
  | 'googleReviews'
  | 'security'
  | 'notifications';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General Info', icon: Globe },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
  { id: 'branding', label: 'Store Branding', icon: Palette },
  { id: 'googleReviews', label: 'Google Reviews', icon: Star },
  { id: 'security', label: 'Security & Access', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const inputClass =
  'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500';
const labelClass = 'text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1';

export const Settings: React.FC = () => {
  const { token, user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security form
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not load settings. Is the backend running?' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setMessage({ type: 'success', text: 'Settings saved successfully.' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not connect to server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      if (res.ok) {
        const updated = await res.json();
        if (token) login(updated, token);
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not connect to server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: 'success', text: 'Password changed successfully.' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to change password' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not connect to server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateGeneral = (key: keyof StoreSettings['general'], value: string) =>
    setSettings((s) => ({ ...s, general: { ...s.general, [key]: value } }));

  const updatePayments = (key: keyof StoreSettings['payments'], value: boolean | string) =>
    setSettings((s) => ({ ...s, payments: { ...s.payments, [key]: value } }));

  const updateBranding = (key: keyof StoreSettings['branding'], value: string) =>
    setSettings((s) => ({ ...s, branding: { ...s.branding, [key]: value } }));

  const updateNotifications = (key: keyof StoreSettings['notifications'], value: boolean | string) =>
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: value } }));

  const updateZone = (id: string, field: keyof ShippingZone, value: string | number | boolean) =>
    setSettings((s) => ({
      ...s,
      shipping: {
        ...s.shipping,
        zones: s.shipping.zones.map((z) => (z.id === id ? { ...z, [field]: value } : z)),
      },
    }));

  const addZone = () =>
    setSettings((s) => ({
      ...s,
      shipping: {
        ...s.shipping,
        zones: [
          ...s.shipping.zones,
          { id: crypto.randomUUID(), zone: 'New Zone', rate: 0, time: '1-3 Days', enabled: true },
        ],
      },
    }));

  const removeZone = (id: string) =>
    setSettings((s) => ({
      ...s,
      shipping: {
        ...s.shipping,
        zones: s.shipping.zones.filter((z) => z.id !== id),
      },
    }));

  const updateGoogleReviews = (
    key: keyof StoreSettings['googleReviews'],
    value: boolean | string | number | GoogleReview[]
  ) => setSettings((s) => ({ ...s, googleReviews: { ...s.googleReviews, [key]: value } }));

  const updateGoogleReview = (id: string, field: keyof GoogleReview, value: string | number) =>
    setSettings((s) => ({
      ...s,
      googleReviews: {
        ...s.googleReviews,
        reviews: s.googleReviews.reviews.map((r) =>
          r.id === id ? { ...r, [field]: value } : r
        ),
      },
    }));

  const addGoogleReview = () =>
    setSettings((s) => ({
      ...s,
      googleReviews: {
        ...s.googleReviews,
        reviews: [
          ...s.googleReviews.reviews,
          {
            id: crypto.randomUUID(),
            author: 'Customer',
            rating: 5,
            text: '',
            date: new Date().toISOString().slice(0, 10),
            source: 'google' as const,
          },
        ],
      },
    }));

  const removeGoogleReview = (id: string) =>
    setSettings((s) => ({
      ...s,
      googleReviews: {
        ...s.googleReviews,
        reviews: s.googleReviews.reviews.filter((r) => r.id !== id),
      },
    }));

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-red-600' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
    </label>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-500 text-sm font-medium">Configure your Vegas Gift Shop preferences and global rules.</p>
        </div>
        {activeTab !== 'security' && (
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-black text-white rounded-2xl px-8 py-6 h-auto hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </Button>
        )}
      </div>

      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' && <CheckCircle2 size={16} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage(null); }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* GENERAL */}
          {activeTab === 'general' && (
            <Card className="border border-gray-100 shadow-sm rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif">General Store Details</CardTitle>
                <CardDescription>Update your shop's public information.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>Store Name</label>
                    <input className={inputClass} value={settings.general.storeName} onChange={(e) => updateGeneral('storeName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Tagline</label>
                    <input className={inputClass} value={settings.general.tagline} onChange={(e) => updateGeneral('tagline', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Support Email</label>
                    <input type="email" className={inputClass} value={settings.general.supportEmail} onChange={(e) => updateGeneral('supportEmail', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Currency</label>
                    <select className={inputClass} value={settings.general.currency} onChange={(e) => updateGeneral('currency', e.target.value)}>
                      <option value="KES">KES - Kenyan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Primary Phone</label>
                    <input className={inputClass} value={settings.general.phone} onChange={(e) => updateGeneral('phone', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Secondary Phone</label>
                    <input className={inputClass} value={settings.general.phoneSecondary} onChange={(e) => updateGeneral('phoneSecondary', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Store Address</label>
                  <textarea rows={3} className={inputClass} value={settings.general.address} onChange={(e) => updateGeneral('address', e.target.value)} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <Card className="border border-gray-100 shadow-sm rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif">Payment Methods</CardTitle>
                <CardDescription>Enable and configure how customers pay.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <Toggle checked={settings.payments.mpesaEnabled} onChange={(v) => updatePayments('mpesaEnabled', v)} label="M-Pesa Payments" />
                {settings.payments.mpesaEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                    <div className="space-y-2">
                      <label className={labelClass}>Paybill Number</label>
                      <input className={inputClass} value={settings.payments.mpesaPaybill} onChange={(e) => updatePayments('mpesaPaybill', e.target.value)} placeholder="e.g. 123456" />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Till Number</label>
                      <input className={inputClass} value={settings.payments.mpesaTill} onChange={(e) => updatePayments('mpesaTill', e.target.value)} placeholder="e.g. 987654" />
                    </div>
                  </div>
                )}
                <Toggle checked={settings.payments.cardEnabled} onChange={(v) => updatePayments('cardEnabled', v)} label="Card Payments (Visa / Mastercard)" />
                <Toggle checked={settings.payments.codEnabled} onChange={(v) => updatePayments('codEnabled', v)} label="Cash on Delivery" />
              </CardContent>
            </Card>
          )}

          {/* SHIPPING */}
          {activeTab === 'shipping' && (
            <Card className="border border-gray-100 shadow-sm rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif">Shipping & Logistics</CardTitle>
                <CardDescription>Configure shipping rates and delivery zones.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-2">
                  <label className={labelClass}>Free Shipping Threshold (KShs)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        shipping: { ...s.shipping, freeShippingThreshold: Number(e.target.value) },
                      }))
                    }
                  />
                </div>
                {settings.shipping.zones.map((zone) => (
                  <div key={zone.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <Toggle checked={zone.enabled} onChange={(v) => updateZone(zone.id, 'enabled', v)} label="Zone Active" />
                      <button type="button" onClick={() => removeZone(zone.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className={labelClass}>Zone Name</label>
                        <input className={inputClass} value={zone.zone} onChange={(e) => updateZone(zone.id, 'zone', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Rate (KShs)</label>
                        <input type="number" className={inputClass} value={zone.rate} onChange={(e) => updateZone(zone.id, 'rate', Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Delivery Time</label>
                        <input className={inputClass} value={zone.time} onChange={(e) => updateZone(zone.id, 'time', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addZone} className="w-full py-5 border-dashed border-2 rounded-2xl flex items-center justify-center gap-2">
                  <Plus size={16} /> Add New Shipping Zone
                </Button>
              </CardContent>
            </Card>
          )}

          {/* BRANDING */}
          {activeTab === 'branding' && (
            <Card className="border border-gray-100 shadow-sm rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif">Store Branding</CardTitle>
                <CardDescription>Customize colors and top bar messages shown on the storefront.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['primaryColor', 'accentColor', 'goldColor'] as const).map((key) => (
                    <div key={key} className="space-y-2">
                      <label className={labelClass}>{key.replace('Color', ' Color')}</label>
                      <div className="flex gap-3 items-center">
                        <input type="color" value={settings.branding[key]} onChange={(e) => updateBranding(key, e.target.value)} className="w-12 h-12 rounded-xl border cursor-pointer" />
                        <input className={inputClass} value={settings.branding[key]} onChange={(e) => updateBranding(key, e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Logo URL (optional)</label>
                  <input className={inputClass} value={settings.branding.logoUrl} onChange={(e) => updateBranding('logoUrl', e.target.value)} placeholder="/hero.png or https://..." />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Top Bar Message</label>
                  <input className={inputClass} value={settings.branding.topBarMessage} onChange={(e) => updateBranding('topBarMessage', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Top Bar Sub-message</label>
                  <input className={inputClass} value={settings.branding.topBarSubMessage} onChange={(e) => updateBranding('topBarSubMessage', e.target.value)} />
                </div>
                <div className="p-4 rounded-2xl text-white text-sm" style={{ backgroundColor: settings.branding.accentColor }}>
                  Preview: {settings.branding.topBarMessage}
                </div>
              </CardContent>
            </Card>
          )}

          {/* GOOGLE REVIEWS */}
          {activeTab === 'googleReviews' && (
            <Card className="border border-gray-100 shadow-sm rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif">Google Reviews</CardTitle>
                <CardDescription>
                  Shown on product pages above store reviews. Update with your real Google Business reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <Toggle
                  checked={settings.googleReviews.enabled}
                  onChange={(v) => updateGoogleReviews('enabled', v)}
                  label="Show Google reviews on product pages"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>Place name</label>
                    <input
                      className={inputClass}
                      value={settings.googleReviews.placeName}
                      onChange={(e) => updateGoogleReviews('placeName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Google Maps URL</label>
                    <input
                      className={inputClass}
                      value={settings.googleReviews.mapsUrl}
                      onChange={(e) => updateGoogleReviews('mapsUrl', e.target.value)}
                      placeholder="https://www.google.com/maps/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Aggregate rating (1–5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.1}
                      className={inputClass}
                      value={settings.googleReviews.aggregateRating}
                      onChange={(e) =>
                        updateGoogleReviews('aggregateRating', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Total reviews on Google</label>
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={settings.googleReviews.totalReviews}
                      onChange={(e) =>
                        updateGoogleReviews('totalReviews', parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Featured reviews</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addGoogleReview}
                    className="rounded-xl text-xs font-bold uppercase tracking-widest"
                  >
                    <Plus size={14} className="mr-1" />
                    Add review
                  </Button>
                </div>

                <div className="space-y-4">
                  {settings.googleReviews.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-5 bg-gray-50 border border-gray-100 rounded-2xl space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                          Review
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGoogleReview(review.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          aria-label="Remove review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          className={inputClass}
                          value={review.author}
                          onChange={(e) => updateGoogleReview(review.id, 'author', e.target.value)}
                          placeholder="Author"
                        />
                        <input
                          type="number"
                          min={1}
                          max={5}
                          className={inputClass}
                          value={review.rating}
                          onChange={(e) =>
                            updateGoogleReview(review.id, 'rating', parseInt(e.target.value, 10) || 5)
                          }
                          placeholder="Rating"
                        />
                        <input
                          type="date"
                          className={inputClass}
                          value={review.date}
                          onChange={(e) => updateGoogleReview(review.id, 'date', e.target.value)}
                        />
                      </div>
                      <textarea
                        rows={3}
                        className={inputClass}
                        value={review.text}
                        onChange={(e) => updateGoogleReview(review.id, 'text', e.target.value)}
                        placeholder="Review text"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <>
              <Card className="border border-gray-100 shadow-sm rounded-[32px]">
                <CardHeader className="p-8">
                  <CardTitle className="text-xl font-serif">Admin Profile</CardTitle>
                  <CardDescription>Update your account name and email.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Full Name</label>
                      <input className={inputClass} value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Email</label>
                      <input type="email" className={inputClass} value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={saveProfile} disabled={isSaving} className="bg-black text-white rounded-xl px-6">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Update Profile'}
                  </Button>
                </CardContent>
              </Card>
              <Card className="border border-gray-100 shadow-sm rounded-[32px]">
                <CardHeader className="p-8">
                  <CardTitle className="text-xl font-serif">Change Password</CardTitle>
                  <CardDescription>Keep your admin account secure.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Current Password</label>
                    <input type="password" className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>New Password</label>
                      <input type="password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Confirm New Password</label>
                      <input type="password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={savePassword} disabled={isSaving} className="bg-black text-white rounded-xl px-6">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card className="border border-gray-100 shadow-sm rounded-[32px]">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-serif">Notifications</CardTitle>
                <CardDescription>Configure how you receive store alerts.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <Toggle checked={settings.notifications.orderEmailEnabled} onChange={(v) => updateNotifications('orderEmailEnabled', v)} label="Email on New Orders" />
                <Toggle checked={settings.notifications.lowStockEmailEnabled} onChange={(v) => updateNotifications('lowStockEmailEnabled', v)} label="Email on Low Stock" />
                <Toggle checked={settings.notifications.smsEnabled} onChange={(v) => updateNotifications('smsEnabled', v)} label="SMS Notifications" />
                <div className="space-y-2">
                  <label className={labelClass}>Admin Notification Email</label>
                  <input type="email" className={inputClass} value={settings.notifications.adminNotificationEmail} onChange={(e) => updateNotifications('adminNotificationEmail', e.target.value)} />
                </div>
                {settings.notifications.smsEnabled && (
                  <div className="space-y-2">
                    <label className={labelClass}>SMS Phone Number</label>
                    <input className={inputClass} value={settings.notifications.smsPhone} onChange={(e) => updateNotifications('smsPhone', e.target.value)} placeholder="+254..." />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
