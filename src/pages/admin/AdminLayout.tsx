import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Bell, Search, User } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-brand-warm-white">
        {/* Admin Header */}
        <header className="h-20 border-b border-brand-stone/30 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-brand-stone/20 rounded-xl" />
            <div className="h-6 w-px bg-brand-stone/30 mx-2 hidden sm:block"></div>
            <div className="relative hidden md:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-hint" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="w-full bg-brand-warm-white border border-brand-stone/50 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-brand-gold/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-brand-text-muted hover:bg-brand-stone/20 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-crimson rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-xl border border-brand-stone/50 overflow-hidden cursor-pointer hover:border-brand-gold transition-colors">
              <div className="w-full h-full bg-brand-stone/20 flex items-center justify-center">
                <User className="text-brand-charcoal" size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
