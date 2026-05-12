import React from 'react';
import { Store, Plus, Search, MoreVertical, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/products';

export const Categories: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">Categories</h1>
          <p className="text-brand-text-muted text-xs">Organize your boutique's collections.</p>
        </div>
        <Button size="sm" className="bg-brand-charcoal rounded-xl text-[10px] uppercase font-bold tracking-widest px-6">
          <Plus className="mr-2" size={14} /> Add Category
        </Button>
      </div>

      <Card className="border-none shadow-card rounded-[24px]">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-brand-stone/30">
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Icon</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Name</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest">Subcategories</TableHead>
                <TableHead className="text-[9px] uppercase font-bold tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} className="border-brand-stone/20">
                  <TableCell className="text-xl">{cat.icon}</TableCell>
                  <TableCell className="font-bold text-sm text-brand-charcoal">{cat.name}</TableCell>
                  <TableCell className="text-xs text-brand-text-muted">{cat.subcategories.length} subcategories</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-brand-text-hint">
                      <MoreVertical size={14} />
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
