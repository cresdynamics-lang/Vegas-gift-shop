import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const stats = [
  { 
    title: 'Total Revenue', 
    value: '$128,430', 
    change: '+12.5%', 
    trend: 'up', 
    icon: DollarSign,
    color: 'bg-brand-gold/10 text-brand-gold'
  },
  { 
    title: 'Active Orders', 
    value: '342', 
    change: '+8.2%', 
    trend: 'up', 
    icon: Package,
    color: 'bg-brand-crimson/10 text-brand-crimson'
  },
  { 
    title: 'New Customers', 
    value: '1,204', 
    change: '-2.4%', 
    trend: 'down', 
    icon: Users,
    color: 'bg-brand-charcoal/10 text-brand-charcoal'
  },
  { 
    title: 'Avg. Order Value', 
    value: '$375.50', 
    change: '+5.1%', 
    trend: 'up', 
    icon: TrendingUp,
    color: 'bg-brand-stone-dark/20 text-brand-stone-dark'
  },
];

const recentOrders = [
  { id: '#ORD-7234', customer: 'John Smith', product: 'Gold Vegas Deck', amount: '$85.00', status: 'Delivered', date: '2 mins ago' },
  { id: '#ORD-7233', customer: 'Sarah Wilson', product: 'Luxury Gift Basket', amount: '$240.00', status: 'Processing', date: '15 mins ago' },
  { id: '#ORD-7232', customer: 'Michael Brown', product: 'Vegas Neon Sign', amount: '$1,200.00', status: 'Shipped', date: '1 hour ago' },
  { id: '#ORD-7231', customer: 'Emily Davis', product: 'Casino Chip Set', amount: '$150.00', status: 'Delivered', date: '3 hours ago' },
  { id: '#ORD-7230', customer: 'David Miller', product: 'Showgirl Headpiece', amount: '$450.00', status: 'Processing', date: '5 hours ago' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export const Dashboard: React.FC = () => {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="border-none shadow-card hover:shadow-hover transition-all duration-500 rounded-[24px] overflow-hidden group">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                    <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-brand-text-muted text-[9px] font-bold uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-serif font-bold text-brand-charcoal">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Orders Table */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-none shadow-card rounded-[24px] overflow-hidden">
            <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-serif">Recent Orders</CardTitle>
                <CardDescription className="text-xs">Monitor your latest shop sales.</CardDescription>
              </div>
              <button className="text-brand-gold hover:text-brand-gold/80 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                View All <ArrowUpRight size={12} />
              </button>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-brand-stone/30">
                    <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Order ID</TableHead>
                    <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Customer</TableHead>
                    <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Product</TableHead>
                    <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Amount</TableHead>
                    <TableHead className="text-brand-text-muted font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} className="border-brand-stone/20 hover:bg-brand-stone/5 transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-brand-gold">{order.id}</TableCell>
                      <TableCell className="font-medium text-brand-charcoal">{order.customer}</TableCell>
                      <TableCell className="text-brand-text-muted text-sm">{order.product}</TableCell>
                      <TableCell className="font-bold text-brand-charcoal">{order.amount}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                          order.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sales Activity / Feed */}
        <motion.div variants={item}>
          <Card className="border-none shadow-card rounded-[24px] overflow-hidden h-full">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-serif">Store Activity</CardTitle>
              <CardDescription className="text-xs">Real-time shop updates.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              {[1, 2, 3, 4].map((_, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-brand-warm-white border border-brand-stone flex items-center justify-center group-hover:bg-brand-gold/10 group-hover:border-brand-gold/30 transition-all">
                      {idx % 2 === 0 ? <Clock size={18} className="text-brand-gold" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                    </div>
                    {idx !== 3 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-brand-stone"></div>}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-brand-charcoal font-medium">
                      {idx % 2 === 0 ? 'Inventory alert: Low stock on Gold Deck' : 'System update: Shipping labels generated'}
                    </p>
                    <span className="text-[10px] text-brand-text-hint font-bold uppercase tracking-widest mt-1">
                      {idx * 2 + 1} hours ago
                    </span>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-4 py-4 rounded-2xl bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-crimson transition-all shadow-lg hover:-translate-y-0.5">
                Manage Inventory
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
