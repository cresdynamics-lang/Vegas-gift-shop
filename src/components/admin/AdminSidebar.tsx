import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Store
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Categories", icon: Store, path: "/admin/categories" },
  { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { name: "Customers", icon: Users, path: "/admin/customers" },
  { name: "Promotions", icon: Sparkles, path: "/admin/promotions" },
  { name: "Reviews", icon: Users, path: "/admin/reviews" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Staff", icon: Users, path: "/admin/staff" },
]

export function AdminSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" className="border-r border-brand-stone/30 bg-white">
      <SidebarHeader className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-charcoal rounded-xl flex items-center justify-center shadow-lg shadow-brand-charcoal/20">
            <Sparkles className="text-brand-gold" size={20} />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-serif font-bold text-brand-charcoal leading-none">VEGAS</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold">BOUTIQUE</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator className="bg-brand-stone/20" />

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint px-4 py-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`h-9 rounded-lg transition-all duration-300 px-3 group/item ${
                        isActive 
                          ? "bg-brand-gold/10 text-brand-charcoal shadow-sm" 
                          : "text-brand-text-muted hover:bg-brand-stone/20 hover:text-brand-charcoal"
                      }`}
                    >
                      <Link to={item.path} className="flex items-center w-full">
                        <item.icon className={`transition-colors duration-300 ${isActive ? "text-brand-gold" : "group-hover/item:text-brand-gold"}`} size={16} />
                        <span className="ml-2.5 font-bold text-[10px] uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                          {item.name}
                        </span>
                        {isActive && <ChevronRight className="ml-auto opacity-50" size={12} />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-brand-text-hint px-4 py-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === "/admin/settings"}
                  className={`h-9 rounded-lg transition-all duration-300 px-3 group/item ${
                    location.pathname === "/admin/settings"
                      ? "bg-brand-gold/10 text-brand-charcoal shadow-sm" 
                      : "text-brand-text-muted hover:bg-brand-stone/20 hover:text-brand-charcoal"
                  }`}
                >
                  <Link to="/admin/settings" className="flex items-center w-full">
                    <Settings className={`transition-colors duration-300 ${location.pathname === "/admin/settings" ? "text-brand-gold" : "group-hover/item:text-brand-gold"}`} size={16} />
                    <span className="ml-2.5 font-bold text-[10px] uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                      Settings
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-9 rounded-lg transition-all duration-300 px-3 text-brand-text-muted hover:bg-brand-crimson/10 hover:text-brand-crimson group/logout"
                >
                  <Link to="/" className="flex items-center w-full">
                    <Store size={16} className="group-hover/logout:text-brand-crimson" />
                    <span className="ml-2.5 font-bold text-[10px] uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                      Visit Shop
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className="bg-brand-warm-white border border-brand-stone/50 rounded-2xl p-4 group-data-[collapsible=icon]:p-2 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-charcoal flex items-center justify-center text-brand-gold font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-bold text-brand-charcoal">Admin User</span>
              <span className="text-[9px] text-brand-text-hint font-medium uppercase tracking-tighter">Super Admin</span>
            </div>
            <button className="ml-auto p-1.5 hover:bg-brand-stone/30 rounded-lg text-brand-text-hint group-data-[collapsible=icon]:hidden">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
