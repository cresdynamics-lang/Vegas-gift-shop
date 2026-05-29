import React, { useEffect, useState } from 'react';
import { Eye, Loader2, Download, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { API_URL } from '../../config';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: any[];
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-charcoal">Orders Management</h1>
          <p className="text-brand-text-muted text-sm font-medium">Track and process your customer orders.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-brand-stone text-brand-charcoal hover:bg-brand-stone/20 h-auto py-4">
            <Download className="mr-2" size={18} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-card rounded-[32px] bg-brand-charcoal text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Clock size={24} className="text-brand-gold" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Pending</span>
            </div>
            <h3 className="text-3xl font-serif font-bold">{orders.filter(o => o.status === 'PENDING').length} Orders</h3>
            <p className="text-brand-stone-dark text-xs mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-card rounded-[32px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Truck size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">Processing</span>
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-charcoal">{orders.filter(o => o.status === 'PROCESSING').length} Orders</h3>
            <p className="text-brand-text-muted text-xs mt-1">Being prepared</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-card rounded-[32px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">Completed</span>
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-charcoal">{orders.filter(o => o.status === 'DELIVERED').length} Orders</h3>
            <p className="text-brand-text-muted text-xs mt-1">Delivered successfully</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-serif">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-brand-stone/30">
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Order ID</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Customer</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Date</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Total</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-text-hint" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-brand-text-muted">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-brand-warm-white border-brand-stone/20">
                  <TableCell className="font-bold text-sm text-brand-charcoal">#{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-brand-charcoal">{order.user?.name || 'Guest'}</div>
                    <div className="text-xs text-brand-text-muted">{order.user?.email}</div>
                  </TableCell>
                  <TableCell className="text-sm text-brand-charcoal">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-bold text-sm text-brand-charcoal">KShs {order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'PROCESSING' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-hint hover:text-brand-crimson">
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
