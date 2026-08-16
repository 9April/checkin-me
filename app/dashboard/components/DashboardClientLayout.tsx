'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ShieldCheck,
  Film,
  Building,
  Check,
  ChevronDown
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { setActiveProperty } from '@/lib/property-actions';

export default function DashboardClientLayout({
  children,
  properties,
  activePropertyId
}: {
  children: React.ReactNode;
  properties: { id: string, name: string, isActive: boolean }[];
  activePropertyId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/dashboard/properties', icon: Building },
    { name: 'Bookings', href: '/dashboard/bookings', icon: ClipboardList },
    { name: 'Media Studio', href: '/media-preview', icon: Film },
    { name: 'Privacy Policy', href: '/dashboard/privacy', icon: ShieldCheck },
    { name: 'PDF Designer', href: '/dashboard/pdf-design', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Trash', href: '/dashboard/trash', icon: Trash2 },
  ];

  const activeProperty = properties.find(p => p.id === activePropertyId) || properties[0];

  const handlePropertySwitch = async (id: string) => {
    await setActiveProperty(id);
    setIsPropertyDropdownOpen(false);
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
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

        {/* Property Selector */}
        <div className="relative mt-4">
          <button 
            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Building size={16} className="text-gray-500 shrink-0" />
              <span className="font-medium text-sm truncate text-gray-700">
                {activeProperty ? activeProperty.name : 'Select Property'}
              </span>
            </div>
            <ChevronDown size={16} className="text-gray-400 shrink-0" />
          </button>

          {isPropertyDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="max-h-60 overflow-y-auto">
                {properties.filter(p => p.isActive).map(prop => (
                  <button
                    key={prop.id}
                    onClick={() => handlePropertySwitch(prop.id)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-left text-sm"
                  >
                    <span className="truncate">{prop.name}</span>
                    {activeProperty?.id === prop.id && <Check size={14} className="text-[#B08D43] shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  href="/dashboard/properties"
                  onClick={() => setIsPropertyDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#B08D43] hover:bg-gray-50 font-medium"
                >
                  Manage Properties
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
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

      <div className="p-4 border-t border-[#F4EBD0]/50 mt-auto">
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
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E5E7EB] flex-col relative">
        <SidebarContent />
      </aside>

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
