import React from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  Search,
  MoreVertical,
  Star
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

const customers = [
  { name: 'John Smith', email: 'john@example.com', spent: 'KES 45,000', orders: 12, joined: 'Jan 2026', status: 'VIP' },
  { name: 'Sarah Wilson', email: 'sarah@example.com', spent: 'KES 24,000', orders: 5, joined: 'Feb 2026', status: 'Active' },
  { name: 'Michael Brown', email: 'mike@example.com', spent: 'KES 120,000', orders: 28, joined: 'Dec 2025', status: 'VIP' },
  { name: 'Emily Davis', email: 'emily@example.com', spent: 'KES 8,000', orders: 2, joined: 'Mar 2026', status: 'Active' },
  { name: 'David Miller', email: 'david@example.com', spent: 'KES 0', orders: 0, joined: 'May 2026', status: 'New' },
];

export const Customers: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-charcoal">Customer Relationships</h1>
          <p className="text-brand-text-muted text-sm font-medium">Manage your boutique's most valued customers.</p>
        </div>
        <Button className="btn-primary rounded-2xl">
          <Mail className="mr-2" size={18} />
          Send Newsletter
        </Button>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: '1,284', icon: Users, color: 'bg-brand-charcoal' },
          { label: 'VIP Members', value: '42', icon: Star, color: 'bg-brand-gold' },
          { label: 'Active This Month', value: '342', icon: Calendar, color: 'bg-emerald-500' },
          { label: 'Avg. Lifetime Value', value: 'KES 12k', icon: CreditCard, color: 'bg-brand-crimson' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-card rounded-[32px] overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint">{stat.label}</p>
                <h4 className="text-xl font-bold text-brand-charcoal">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customers Table */}
      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-serif">Customer Directory</CardTitle>
              <CardDescription>A list of registered customers and their activity.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-hint" size={16} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="bg-brand-warm-white border border-brand-stone rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-brand-stone/30">
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Customer</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Total Spent</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Orders</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Joined</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, idx) => (
                <TableRow key={idx} className="border-brand-stone/20 hover:bg-brand-stone/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-stone-dark/10 flex items-center justify-center text-brand-charcoal font-bold text-sm">
                        {customer.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-charcoal text-sm">{customer.name}</span>
                        <span className="text-[10px] text-brand-text-hint">{customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-brand-charcoal">{customer.spent}</TableCell>
                  <TableCell className="text-sm text-brand-text-muted">{customer.orders} orders</TableCell>
                  <TableCell className="text-sm text-brand-text-muted">{customer.joined}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      customer.status === 'VIP' ? 'bg-brand-gold/10 text-brand-gold' : 
                      customer.status === 'New' ? 'bg-blue-50 text-blue-600' : 
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-brand-text-hint hover:text-brand-charcoal">
                      <MoreVertical size={16} />
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
