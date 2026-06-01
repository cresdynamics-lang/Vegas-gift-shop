import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, Loader2, Download, Clock, Truck, CheckCircle2, X } from 'lucide-react';
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
  items: unknown[];
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const processingCount = orders.filter((o) => o.status === 'PROCESSING').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  const clearFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('status');
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">
            Orders Management
          </h1>
          <p className="text-brand-text-muted text-sm font-medium">
            Track and process your customer orders.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-2xl border-brand-stone text-brand-charcoal hover:bg-brand-stone/20 h-auto py-3 sm:py-4 w-full sm:w-auto"
          >
            <Download className="mr-2" size={18} />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/admin/orders?status=PENDING"
          className={`block rounded-[24px] sm:rounded-[32px] transition-all ${
            statusFilter === 'PENDING' ? 'ring-2 ring-brand-gold' : ''
          }`}
        >
          <Card className="border-none shadow-card rounded-[24px] sm:rounded-[32px] bg-brand-charcoal text-white h-full">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Clock size={24} className="text-brand-gold" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Pending
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold">{pendingCount} Orders</h3>
              <p className="text-brand-stone-dark text-xs mt-1">Awaiting processing</p>
            </CardContent>
          </Card>
        </Link>
        <Link
          to="/admin/orders?status=PROCESSING"
          className={`block rounded-[24px] sm:rounded-[32px] transition-all ${
            statusFilter === 'PROCESSING' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <Card className="border-none shadow-card rounded-[24px] sm:rounded-[32px] h-full">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Truck size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">
                  Processing
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold">{processingCount} Orders</h3>
              <p className="text-brand-text-muted text-xs mt-1">Being prepared</p>
            </CardContent>
          </Card>
        </Link>
        <Link
          to="/admin/orders?status=DELIVERED"
          className={`block rounded-[24px] sm:rounded-[32px] transition-all ${
            statusFilter === 'DELIVERED' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <Card className="border-none shadow-card rounded-[24px] sm:rounded-[32px] h-full">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">
                  Delivered
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold">{deliveredCount} Orders</h3>
              <p className="text-brand-text-muted text-xs mt-1">Delivered successfully</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {statusFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-brand-text-muted">
            Showing <strong className="text-brand-charcoal">{statusFilter}</strong> orders (
            {filteredOrders.length})
          </span>
          <button
            type="button"
            onClick={clearFilter}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-crimson hover:underline"
          >
            <X size={14} />
            Clear filter
          </button>
          <Link to="/admin/orders" className="text-sm font-bold text-gray-600 hover:underline">
            View all
          </Link>
        </div>
      )}

      <Card className="border-none shadow-card rounded-[24px] sm:rounded-[32px] overflow-hidden">
        <CardHeader className="p-5 sm:p-8 pb-0 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg sm:text-xl font-serif">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-brand-stone/30">
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                  Order ID
                </TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                  Customer
                </TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] whitespace-nowrap hidden sm:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                  Total
                </TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                  Status
                </TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] text-right whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-text-hint" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-brand-text-muted">
                    No orders found{statusFilter ? ` with status ${statusFilter}` : ''}.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-brand-warm-white border-brand-stone/20">
                    <TableCell className="font-bold text-sm text-brand-charcoal whitespace-nowrap">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="text-sm font-bold text-brand-charcoal truncate max-w-[140px] sm:max-w-none">
                        {order.user?.name || 'Guest'}
                      </div>
                      <div className="text-xs text-brand-text-muted truncate max-w-[140px] sm:max-w-none">
                        {order.user?.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-brand-charcoal hidden sm:table-cell whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-sm text-brand-charcoal whitespace-nowrap">
                      KShs {order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-600'
                            : order.status === 'PROCESSING'
                              ? 'bg-amber-50 text-amber-600'
                              : order.status === 'PENDING'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-brand-text-hint hover:text-brand-crimson"
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
