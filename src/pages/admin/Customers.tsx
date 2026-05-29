import React, { useEffect, useState } from 'react';
import { Users, Mail, Loader2, Star, Calendar, CreditCard, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { API_URL } from '../../config';

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { orders: number };
}

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: customers.length.toString(), icon: Users, color: 'bg-brand-charcoal' },
          { label: 'VIP Members', value: customers.filter(c => c._count.orders > 5).length.toString(), icon: Star, color: 'bg-brand-gold' },
          { label: 'Active This Month', value: customers.length.toString(), icon: Calendar, color: 'bg-emerald-500' },
          { label: 'Avg. Orders', value: (customers.reduce((acc, c) => acc + c._count.orders, 0) / (customers.length || 1)).toFixed(1), icon: CreditCard, color: 'bg-brand-crimson' },
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
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Email</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Orders</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Joined</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-text-hint" />
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-brand-text-muted">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-brand-warm-white border-brand-stone/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-stone/20 flex items-center justify-center text-brand-charcoal font-bold text-xs">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-bold text-sm text-brand-charcoal">{customer.name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-brand-text-muted">
                    <div className="flex items-center gap-2">
                      <Mail size={12} /> {customer.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-brand-charcoal font-bold">{customer._count.orders}</TableCell>
                  <TableCell className="text-xs text-brand-text-muted">{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      customer._count.orders > 5 ? 'bg-brand-gold/10 text-brand-gold' :
                      customer._count.orders > 0 ? 'bg-emerald-50 text-emerald-600' :
                      'bg-brand-stone/50 text-brand-text-muted'
                    }`}>
                      {customer._count.orders > 5 ? 'VIP' : customer._count.orders > 0 ? 'Active' : 'New'}
                    </span>
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