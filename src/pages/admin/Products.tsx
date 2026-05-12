import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter, 
  MoreHorizontal,
  ArrowUpRight,
  Package,
  Eye
} from 'lucide-react';
import { products as initialProducts } from '@/data/products';
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

export const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-charcoal">Products Management</h1>
          <p className="text-brand-text-muted text-sm font-medium">Add, edit, or manage your boutique inventory.</p>
        </div>
        <Button className="bg-brand-charcoal text-white rounded-2xl px-8 py-6 h-auto hover:bg-brand-crimson transition-all shadow-lg group">
          <Plus className="mr-2 group-hover:rotate-90 transition-transform" size={18} />
          Add New Product
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-hint" size={18} />
            <input 
              type="text" 
              placeholder="Search products by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-brand-gold/50 transition-all"
            />
          </div>
          <Button variant="outline" className="rounded-2xl px-6 py-4 h-auto border-brand-stone text-brand-charcoal hover:bg-brand-stone/20">
            <Filter className="mr-2" size={18} />
            Filters
          </Button>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-none shadow-card rounded-[32px] overflow-hidden">
        <CardHeader className="p-8 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-serif">Inventory List</CardTitle>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full">
              {filteredProducts.length} Total Items
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-brand-stone/30">
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] w-[80px]">Image</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Product Name</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Category</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Price</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Stock</TableHead>
                <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.slice(0, 10).map((product) => (
                <TableRow key={product.id} className="border-brand-stone/20 hover:bg-brand-stone/5 transition-colors group">
                  <TableCell>
                    <div className="w-12 h-12 rounded-xl bg-brand-stone/20 overflow-hidden border border-brand-stone/30 group-hover:border-brand-gold/50 transition-all">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-charcoal text-sm">{product.name}</span>
                      <span className="text-[10px] font-medium text-brand-text-hint">ID: {product.id.slice(0, 8)}...</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium px-2 py-1 bg-brand-warm-white border border-brand-stone rounded-lg text-brand-text-muted">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-charcoal">KES {product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                        <span className="text-[10px] line-through text-brand-text-hint">KES {product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-medium">In Stock</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-brand-text-hint hover:text-brand-gold hover:bg-brand-gold/10">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-brand-text-hint hover:text-brand-crimson hover:bg-brand-crimson/10">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs text-brand-text-hint font-medium">Showing 1-10 of {filteredProducts.length} products</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-brand-stone text-[10px] font-bold uppercase tracking-widest disabled:opacity-50" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="rounded-xl border-brand-stone text-[10px] font-bold uppercase tracking-widest">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
