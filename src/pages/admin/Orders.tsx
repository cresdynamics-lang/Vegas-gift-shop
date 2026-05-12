import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const orders = [
  { id: 'VG-7234', customer: 'John Smith', email: 'john@example.com', date: 'May 12, 2026', total: 'KES 8,500', status: 'Delivered', items: 2 },
  { id: 'VG-7233', customer: 'Sarah Wilson', email: 'sarah@example.com', date: 'May 12, 2026', total: 'KES 24,000', status: 'Processing', items: 4 },
  { id: 'VG-7232', customer: 'Michael Brown', email: 'mike@example.com', date: 'May 11, 2026', total: 'KES 120,000', status: 'Shipped', items: 1 },
  { id: 'VG-7231', customer: 'Emily Davis', email: 'emily@example.com', date: 'May 11, 2026', total: 'KES 15,000', status: 'Cancelled', items: 3 },
  { id: 'VG-7230', customer: 'David Miller', email: 'david@example.com', date: 'May 10, 2026', total: 'KES 45,000', status: 'Delivered', items: 2 },
  { id: 'VG-7229', customer: 'Linda Johnson', email: 'linda@example.com', date: 'May 10, 2026', total: 'KES 12,500', status: 'Processing', items: 1 },
];

const statusStyles = {
  Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Processing: 'bg-amber-50 text-amber-600 border-amber-100',
  Shipped: 'bg-blue-50 text-blue-600 border-blue-100',
  Cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
};

export const Orders: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-card rounded-[32px] bg-brand-charcoal text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Clock size={24} className="text-brand-gold" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Pending</span>
            </div>
            <h3 className="text-3xl font-serif font-bold">12 Orders</h3>
            <p className="text-brand-stone-dark text-xs mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-card rounded-[32px]">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Truck size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">In Transit</span>
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-charcoal">8 Orders</h3>
            <p className="text-brand-text-muted text-xs mt-1">On the way to customers</p>
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
            <h3 className="text-3xl font-serif font-bold text-brand-charcoal">145 Orders</h3>
            <p className="text-brand-text-muted text-xs mt-1">Delivered successfully this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-serif">All Orders</CardTitle>
            <CardDescription>Manage your sales pipeline.</CardDescription>
          </div>
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-hint" size={16} />
            <input 
              type="text" 
              placeholder="Filter orders..." 
              className="w-full bg-brand-warm-white border border-brand-stone rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none"
            />
          </div>
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
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-brand-stone/20 hover:bg-brand-stone/5 transition-colors group">
                  <TableCell className="font-mono text-xs font-bold text-brand-gold">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-charcoal text-sm">{order.customer}</span>
                      <span className="text-[10px] text-brand-text-hint">{order.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-brand-text-muted">{order.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-charcoal">{order.total}</span>
                      <span className="text-[10px] text-brand-text-hint">{order.items} items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[order.status as keyof typeof statusStyles]}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="rounded-xl hover:bg-brand-gold/10 text-brand-gold font-bold text-[10px] uppercase tracking-widest">
                      Details <ArrowUpRight className="ml-1" size={12} />
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
