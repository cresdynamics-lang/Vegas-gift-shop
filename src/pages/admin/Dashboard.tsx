import React, { useEffect, useState } from 'react';
import { Package, Tags, ShoppingCart, Users, TrendingUp, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { API_URL } from '../../config';

export default function AdminDashboard() {
  const { token, user } = useAuthStore();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    { name: 'Total Revenue', value: `KShs ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-700', shadow: 'shadow-emerald-500/20' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'from-blue-500 to-blue-700', shadow: 'shadow-blue-500/20' },
    { name: 'Total Products', value: stats.products, icon: Package, color: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-500/20' },
    { name: 'Categories', value: stats.categories, icon: Tags, color: 'from-orange-500 to-orange-700', shadow: 'shadow-orange-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0a0a0a] to-gray-800 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-gray-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-20" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-gray-400 max-w-xl text-sm sm:text-base">
            Here's what's happening with your store today. You have full access to manage products, orders, and customer data.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                +12% <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{item.name}</p>
              <h3 className="text-2xl font-black text-gray-900">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <select className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-xl px-4 py-2 focus:ring-0 cursor-pointer">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Activity className="w-12 h-12 mb-4 text-gray-300" />
            <p className="font-medium">Live revenue charts will be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-red-100">
                  <Package className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 group-hover:text-red-600">Add New Product</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-100">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 group-hover:text-blue-600">View Pending Orders</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-purple-100">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-gray-700 group-hover:text-purple-600">Manage Customers</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
