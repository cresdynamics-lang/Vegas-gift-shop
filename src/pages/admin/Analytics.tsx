import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight, 
  Calendar,
  Filter,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_URL } from '../../config';

const feedBase = API_URL.replace(/\/$/, '');

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-charcoal">Advanced Analytics</h1>
          <p className="text-brand-text-muted text-sm font-medium">Detailed insights into your Vegas Gift Shop performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-brand-stone">
            <Calendar className="mr-2" size={18} />
            Last 30 Days
          </Button>
          <Button className="btn-primary rounded-2xl">
            <Filter className="mr-2" size={18} />
            Filter
          </Button>
        </div>
      </div>

      {/* Main Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Growth Chart (Mockup) */}
        <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif">Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue vs targets.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp size={14} /> +18.4%
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[300px] w-full flex items-end gap-2 pt-10">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-brand-stone/30 rounded-t-xl group-hover:bg-brand-gold/50 transition-all duration-500 relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-charcoal text-white text-[10px] px-2 py-1 rounded-lg">
                      KES {h*1000}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-text-hint uppercase tracking-tighter">M{i+1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-serif">Top Categories</CardTitle>
            <CardDescription>Sales distribution across departments.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            {[
              { name: 'Men Gifts', percentage: 45, color: 'bg-brand-gold' },
              { name: 'Awards & Trophies', percentage: 25, color: 'bg-brand-crimson' },
              { name: 'Tech Gifts', percentage: 15, color: 'bg-brand-charcoal' },
              { name: 'Others', percentage: 15, color: 'bg-brand-stone-dark' },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-brand-charcoal">{cat.name}</span>
                  <span className="text-brand-text-muted">{cat.percentage}%</span>
                </div>
                <div className="h-3 w-full bg-brand-stone/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.color} rounded-full`} 
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="pt-6 grid grid-cols-2 gap-4">
              <div className="p-6 bg-brand-warm-white rounded-[24px] border border-brand-stone">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint mb-1">Conversion Rate</p>
                <h4 className="text-2xl font-bold text-brand-charcoal">3.8%</h4>
              </div>
              <div className="p-6 bg-brand-warm-white rounded-[24px] border border-brand-stone">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint mb-1">Returning Rate</p>
                <h4 className="text-2xl font-bold text-brand-charcoal">24.5%</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Catalog feeds for Meta + Google */}
      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardHeader className="p-8">
          <CardTitle className="text-xl font-serif">Catalog feeds (live from database)</CardTitle>
          <CardDescription>
            Register these URLs in Google Merchant Center and Meta Commerce Manager. Product{' '}
            <code className="text-xs bg-brand-stone/40 px-1 rounded">id</code> matches{' '}
            <code className="text-xs bg-brand-stone/40 px-1 rounded">/product/:id</code> on the
            storefront. See <code className="text-xs">TRACKING.md</code> for Pixel / GA4 setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-3 text-sm font-mono text-brand-charcoal break-all">
          <p>
            <span className="font-bold text-brand-text-muted uppercase text-[10px] tracking-wider block mb-1">
              Google Merchant
            </span>
            {feedBase}/feeds/google.xml
          </p>
          <p>
            <span className="font-bold text-brand-text-muted uppercase text-[10px] tracking-wider block mb-1">
              Meta catalog CSV
            </span>
            {feedBase}/feeds/meta-catalog.csv
          </p>
          <p>
            <span className="font-bold text-brand-text-muted uppercase text-[10px] tracking-wider block mb-1">
              Debug JSON
            </span>
            {feedBase}/feeds/products.json
          </p>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardHeader className="p-8">
          <CardTitle className="text-xl font-serif">Customer Acquisition</CardTitle>
          <CardDescription>Where your boutique traffic is coming from.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { source: 'Direct', value: '45%', icon: BarChart3 },
              { source: 'Instagram', value: '30%', icon: Users },
              { source: 'Search', value: '15%', icon: DollarSign },
              { source: 'Email', value: '10%', icon: ShoppingCart },
            ].map((src, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 p-8 rounded-[32px] bg-brand-warm-white border border-brand-stone/50 hover:border-brand-gold/30 transition-all">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-brand-stone/30 text-brand-gold">
                  <src.icon size={24} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-brand-charcoal">{src.value}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-text-hint mt-1">{src.source}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
