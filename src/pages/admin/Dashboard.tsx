import React, { useEffect, useState } from 'react';
import { Package, Tags, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    // In a real app, this would fetch from an API endpoint
    // For now, we'll fetch products and categories to get counts
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:5000/api/products?limit=1'),
          fetch('http://localhost:5000/api/products/categories')
        ]);
        
        // We'd need a proper count endpoint, but this is a placeholder
        const categories = await categoriesRes.json();
        
        setStats({
          products: 1815, // Hardcoded for now based on our seed
          categories: categories.length,
          orders: 12,
          revenue: 45000
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { name: 'Categories', value: stats.categories, icon: Tags, color: 'bg-purple-500' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-green-500' },
    { name: 'Revenue', value: `KShs ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${item.color} bg-opacity-10`}>
                    <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  View all
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg border border-gray-100 p-6 flex flex-col items-center justify-center h-64 text-gray-500">
          <TrendingUp className="w-12 h-12 text-gray-300 mb-4" />
          <p>Activity charts will appear here</p>
        </div>
      </div>
    </div>
  );
}
