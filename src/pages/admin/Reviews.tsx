import React from 'react';
import { Star, MessageSquare, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Reviews: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">Customer Reviews</h1>
          <p className="text-brand-text-muted text-xs">Manage your store's social proof.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
            <Star size={16} className="fill-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest">4.8 Avg Rating</span>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-card rounded-[24px] overflow-hidden">
        <CardContent className="p-6 space-y-6">
          {[
            { user: 'Alice M.', product: 'Golden Prestige Plaque', rating: 5, comment: 'Absolutely stunning! The engraving was perfect.', date: '2 hours ago', status: 'Approved' },
            { user: 'Kevin O.', product: 'Men\'s Business Watch', rating: 4, comment: 'Good quality, but shipping took a bit longer than expected.', date: '1 day ago', status: 'Pending' },
            { user: 'Jane D.', product: 'Maasai Fleece Blanket', rating: 5, comment: 'So soft and warm. My husband loved it!', date: '3 days ago', status: 'Approved' },
          ].map((review, idx) => (
            <div key={idx} className="p-5 bg-brand-warm-white rounded-2xl border border-brand-stone/50 hover:border-brand-gold/30 transition-all space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-stone flex items-center justify-center font-bold text-xs text-brand-charcoal">
                    {review.user[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-charcoal">{review.user}</h4>
                    <p className="text-[10px] text-brand-text-hint">Reviewing <span className="text-brand-gold">{review.product}</span></p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-stone-dark'} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-brand-text-muted italic">"{review.comment}"</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">{review.date}</span>
                <div className="flex gap-2">
                  {review.status === 'Pending' ? (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 text-[9px] uppercase font-bold tracking-widest text-emerald-600 hover:bg-emerald-50">
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[9px] uppercase font-bold tracking-widest text-brand-crimson hover:bg-brand-crimson/5">
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
