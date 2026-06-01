import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Settings, LogOut, Menu, X, ShieldAlert, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatRoleLabel(role?: string): string {
  if (!role) return 'Admin';
  const labels: Record<string, string> = {
    SUPER_ADMIN: 'Admin',
    MANAGER: 'Manager',
    SALES: 'Sales',
    ACCOUNTANT: 'Accountant',
  };
  return labels[role] ?? role.replace(/_/g, ' ');
}

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
      {/* Sidebar (Hidden by default on all screens, toggled by menu) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0a0a0a] border-r border-gray-800 shadow-2xl"
            >
              <div className="flex items-center h-16 flex-shrink-0 px-6 bg-[#0a0a0a] border-b border-gray-800/50 justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform">
                    <span className="text-white font-serif font-bold text-lg">V</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs tracking-widest uppercase">Admin</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 mt-4">
                <nav className="flex-1 px-4 space-y-2">
                  {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-red-600/10 to-transparent text-red-500 border border-red-500/20'
                            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                        }`}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-5 w-5 transition-colors ${
                            isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                        {isActive && (
                          <motion.div 
                            layoutId="activeTab" 
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" 
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User Profile Section */}
              <div className="flex-shrink-0 flex p-4 m-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-gray-500 shadow-inner">
                    <ShieldAlert size={18} className="text-gray-300" />
                  </div>
                  <div className="ml-3 w-full flex justify-between items-center">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-white">{user?.name}</p>
                      <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider">{formatRoleLabel(user?.role)}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header (Visible on all screens) */}
      <div className="fixed top-0 w-full z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#0a0a0a] border-b border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-gray-300 hover:text-white focus:outline-none p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-serif font-bold text-lg">V</span>
            </div>
            <span className="text-white font-bold text-xs tracking-widest uppercase hidden sm:block">Admin Portal</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-white">{user?.name}</span>
            <span className="text-[10px] font-medium text-red-400 uppercase tracking-wider">{formatRoleLabel(user?.role)}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pt-16">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
