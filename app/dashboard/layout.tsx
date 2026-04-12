'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  LogOut,
  Home,
  Menu,
  X,
  FileText,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', href: '/dashboard/bookings', icon: ClipboardList },
    { name: 'Privacy Policy', href: '/dashboard/privacy', icon: ShieldCheck },
    { name: 'PDF Designer', href: '/dashboard/pdf-design', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Trash', href: '/dashboard/trash', icon: Trash2 },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#B08D43] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#C5A059]/30">
            C
          </div>
          <span className="font-bold text-xl tracking-tighter text-[#1A1A1A] font-serif italic">Checkin-Me</span>
        </Link>
        <button 
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight ${
                isActive 
                  ? 'bg-[#F4EBD0] text-[#B08D43] shadow-inner shadow-[#B08D43]/5' 
                  : 'text-[#6B635C] hover:bg-[#FDFCF9] hover:text-[#C5A059] border border-transparent hover:border-[#F4EBD0]'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#F4EBD0]/50">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-5 py-3.5 w-full text-left text-xs font-bold text-[#6B635C] hover:text-red-500 hover:bg-red-50/50 transition-all rounded-2xl"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen min-h-0 min-w-0 bg-[#F9FAFB] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E5E7EB] flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden w-full bg-[#FDFCF9]">
        <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-[#F4EBD0]/50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#B08D43] hover:bg-[#F4EBD0] rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight font-serif italic">
              {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <Link 
              href="/dashboard/view-form" 
              className="px-5 py-2.5 text-xs font-bold text-[#B08D43] bg-[#F4EBD0] hover:bg-[#C5A059] hover:text-white rounded-full transition-all duration-500 shadow-sm flex items-center gap-2 uppercase tracking-widest"
            >
              <Home size={14} />
              <span className="hidden xs:inline">View Form</span>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
