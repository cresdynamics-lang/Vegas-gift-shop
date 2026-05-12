import React from 'react';
import { Sparkles, Plus, Ticket, Calendar, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Promotions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">Promotions & Coupons</h1>
          <p className="text-brand-text-muted text-xs">Drive sales with targeted discounts.</p>
        </div>
        <Button size="sm" className="bg-brand-charcoal rounded-xl text-[10px] uppercase font-bold tracking-widest px-6">
          <Plus className="mr-2" size={14} /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { code: 'VEGAS20', discount: '20% OFF', status: 'Active', usage: '45/100', expiry: 'May 30' },
          { code: 'WELCOME50', discount: 'KES 500 OFF', status: 'Expired', usage: '120/120', expiry: 'Apr 15' },
          { code: 'SPRING24', discount: '10% OFF', status: 'Scheduled', usage: '0/50', expiry: 'Jun 01' },
        ].map((promo, idx) => (
          <Card key={idx} className="border-none shadow-card rounded-[24px] overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold">
                  <Ticket size={20} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  promo.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                  promo.status === 'Expired' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {promo.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-1">{promo.code}</h3>
              <p className="text-sm font-serif italic text-brand-gold">{promo.discount}</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">
                  <span>Usage</span>
                  <span>{promo.usage}</span>
                </div>
                <div className="h-1.5 w-full bg-brand-stone/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-gold" 
                    style={{ width: `${(parseInt(promo.usage.split('/')[0]) / parseInt(promo.usage.split('/')[1])) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-brand-text-muted">
                  <Calendar size={12} /> Expiry: {promo.expiry}, 2026
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
