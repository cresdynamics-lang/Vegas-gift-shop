import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, Loader2, Download, Clock, Truck, CheckCircle2, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { API_URL } from '../../config';
import { formatOrderInstructions, parseOrderSnapshot } from '../../utils/orderDisplay';
import { getStaticAssetUrl } from '../../utils/imageUtils';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customerEmail?: string | null;
  shippingName?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingPhone?: string | null;
  paymentMethod?: string | null;
  itemsSnapshot?: unknown;
  user?: { name: string | null; email: string } | null;
}

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDraft, setStatusDraft] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
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

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatusDraft(order.status);
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setStatusDraft('');
  };

  const saveStatus = async () => {
    if (!selectedOrder || !statusDraft) return;
    setSavingStatus(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusDraft }),
      });
      if (!response.ok) throw new Error('Failed to update');
      const updated = await response.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
    } catch {
      alert('Could not update order status.');
    } finally {
      setSavingStatus(false);
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

  const selectedSnapshot = selectedOrder ? parseOrderSnapshot(selectedOrder.itemsSnapshot) : null;

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
                        {order.shippingName || order.user?.name || 'Guest'}
                      </div>
                      <div className="text-xs text-brand-text-muted truncate max-w-[140px] sm:max-w-none">
                        {order.customerEmail || order.user?.email}
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
                        onClick={() => openOrder(order)}
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

      {selectedOrder && selectedSnapshot && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close order details"
            onClick={closeOrder}
          />
          <div className="relative bg-white w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order #{selectedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-xs text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button type="button" onClick={closeOrder} className="p-2 text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.shippingName || selectedOrder.user?.name || 'Guest'}</p>
                  <p className="text-gray-600">{selectedOrder.customerEmail || selectedOrder.user?.email}</p>
                  <p className="text-gray-600">{selectedOrder.shippingPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery</p>
                  <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                  <p className="text-gray-700">{selectedOrder.shippingCity}</p>
                  {selectedSnapshot.shippingMethod && (
                    <p className="text-gray-600 mt-1 capitalize">
                      Shipping: {selectedSnapshot.shippingMethod}
                    </p>
                  )}
                  {selectedOrder.paymentMethod && (
                    <p className="text-gray-600 capitalize">Payment: {selectedOrder.paymentMethod}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Items</p>
                <div className="space-y-3">
                  {selectedSnapshot.lineItems.map((item) => {
                    const instructions = formatOrderInstructions(item.options);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                      >
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white border border-gray-100">
                          <img
                            src={getStaticAssetUrl(item.image)}
                            alt={item.name}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty {item.quantity} · KShs {(item.price * item.quantity).toLocaleString()}
                          </p>
                          {instructions.length > 0 && (
                            <ul className="mt-2 text-xs text-gray-700 space-y-0.5">
                              {instructions.map((line) => (
                                <li key={line} className="bg-white/80 rounded px-2 py-1 border border-gray-100">
                                  {line}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 shrink-0">Update status</label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={saveStatus}
                  disabled={savingStatus || statusDraft === selectedOrder.status}
                  className="shrink-0"
                >
                  {savingStatus ? 'Saving…' : 'Save'}
                </Button>
              </div>

              <p className="text-right text-lg font-bold text-gray-900">
                Total: KShs {selectedOrder.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
