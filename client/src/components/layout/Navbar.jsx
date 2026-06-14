"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, User, Bell, Menu, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const pathname = usePathname();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('bharatbenefit_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bharatbenefit_token');
    localStorage.removeItem('bharatbenefit_user');
    setUser(null);
    window.location.href = '/login';
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Smart Finder', href: '/find-schemes', icon: Search },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-green-200">
                <Globe size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 leading-tight">myScheme</span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Digital India</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 ml-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      isActive ? 'text-green-700 bg-green-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                Sign In <User size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
