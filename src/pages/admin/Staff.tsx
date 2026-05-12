import React from 'react';
import { Users, Shield, Mail, Plus, MoreHorizontal, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export const Staff: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">Staff Management</h1>
          <p className="text-brand-text-muted text-xs">Control access and roles for your team.</p>
        </div>
        <Button size="sm" className="bg-brand-charcoal rounded-xl text-[10px] uppercase font-bold tracking-widest px-6">
          <Plus className="mr-2" size={14} /> Add Staff Member
        </Button>
      </div>

      <Card className="border-none shadow-card rounded-[24px] overflow-hidden">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-brand-stone/30">
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Member</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Role</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Status</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Last Active</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Admin User', email: 'admin@vegasgifts.co.ke', role: 'Super Admin', status: 'Active', lastActive: 'Now' },
                { name: 'Sarah Manager', email: 'sarah@vegasgifts.co.ke', role: 'Manager', status: 'Active', lastActive: '10 mins ago' },
                { name: 'John Sales', email: 'john@vegasgifts.co.ke', role: 'Sales', status: 'Offline', lastActive: '2 days ago' },
              ].map((staff, idx) => (
                <TableRow key={idx} className="border-brand-stone/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center font-bold text-xs">
                        {staff.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-brand-charcoal">{staff.name}</span>
                        <span className="text-[10px] text-brand-text-hint">{staff.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className={staff.role === 'Super Admin' ? 'text-brand-crimson' : 'text-brand-gold'} />
                      <span className="text-xs font-medium text-brand-text-muted">{staff.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${staff.status === 'Active' ? 'text-emerald-600' : 'text-brand-text-hint'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-600' : 'bg-brand-stone-dark'}`}></div>
                      {staff.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-brand-text-muted">{staff.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-hint">
                      <MoreHorizontal size={14} />
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
