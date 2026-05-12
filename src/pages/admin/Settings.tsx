import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Globe, 
  Truck,
  Palette,
  ShieldCheck,
  Save
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-charcoal">Store Settings</h1>
          <p className="text-brand-text-muted text-sm font-medium">Configure your Vegas Gift Shop preferences and global rules.</p>
        </div>
        <Button className="bg-brand-charcoal text-white rounded-2xl px-8 py-6 h-auto hover:bg-brand-gold transition-all shadow-lg flex items-center gap-2">
          <Save size={18} />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Tabs (Simulated) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { label: 'General Info', icon: Globe, active: true },
            { label: 'Payments', icon: CreditCard, active: false },
            { label: 'Shipping & Delivery', icon: Truck, active: false },
            { label: 'Store Branding', icon: Palette, active: false },
            { label: 'Security & Access', icon: ShieldCheck, active: false },
            { label: 'Notifications', icon: Bell, active: false },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                item.active 
                  ? 'bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-gold/10' 
                  : 'text-brand-text-muted hover:bg-brand-stone/20 hover:text-brand-charcoal'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-10">
          {/* General Store Details */}
          <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-serif">General Store Details</CardTitle>
              <CardDescription>Update your shop's public information.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint ml-1">Store Name</label>
                  <input 
                    type="text" 
                    defaultValue="Vegas Gift Shop" 
                    className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint ml-1">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@vegasgifts.co.ke" 
                    className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    defaultValue="+254 740 282041" 
                    className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint ml-1">Currency</label>
                  <select className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50 appearance-none">
                    <option>KES - Kenyan Shilling</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint ml-1">Store Address (Headquarters)</label>
                <textarea 
                  rows={3}
                  defaultValue="Nairobi Luxury District, CBD, Kenya" 
                  className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50"
                ></textarea>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Rules */}
          <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-serif">Shipping & Logistics</CardTitle>
              <CardDescription>Configure shipping rates and delivery zones.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              {[
                { zone: 'Nairobi Express', rate: 'KES 500', time: 'Same Day' },
                { zone: 'Rest of Kenya', rate: 'KES 1,000', time: '1-3 Days' },
                { zone: 'International', rate: 'KES 5,000', time: '7-14 Days' },
              ].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-brand-warm-white rounded-2xl border border-brand-stone/50 hover:border-brand-gold/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-charcoal shadow-sm border border-brand-stone">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-charcoal text-sm">{zone.zone}</h4>
                      <p className="text-[10px] text-brand-text-hint font-medium uppercase tracking-widest">{zone.time} Delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-brand-gold">{zone.rate}</span>
                    <button className="p-2 hover:bg-brand-stone/30 rounded-lg text-brand-text-hint transition-colors">
                      <Lock size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full py-6 border-dashed border-2 border-brand-stone text-brand-text-hint hover:text-brand-gold hover:border-brand-gold/50 transition-all rounded-2xl">
                + Add New Shipping Zone
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
