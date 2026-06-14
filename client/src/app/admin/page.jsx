"use client";
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { LayoutDashboard, Plus, Settings, Users, BookOpen, IndianRupee, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [schemes, setSchemes] = useState([
    { id: 1, title: 'PM-Kisan', ministry: 'Agriculture', category: 'Farmer', active: true },
    { id: 2, title: 'Lakhpati Didi', ministry: 'Rural Dev', category: 'Women', active: true },
    { id: 3, title: 'Post-Matric Scholarship', ministry: 'Social Justice', category: 'Scholarship', active: false },
  ]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:flex flex-col p-6 space-y-8">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Management</h3>
            <nav className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm">
                <LayoutDashboard size={18} />
                <span>Schemes</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">
                <Users size={18} />
                <span>Users</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">
                <BookOpen size={18} />
                <span>Verification</span>
              </button>
            </nav>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">System</h3>
            <nav className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-sm transition-all">
                <ShieldAlert size={18} />
                <span>Security</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scheme Management</h1>
              <p className="text-muted-foreground font-medium">Add, update, or remove government benefits from the system.</p>
            </div>
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all">
              <Plus size={20} />
              <span>Add New Scheme</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Schemes', value: '142', icon: BookOpen, color: 'text-primary' },
              { label: 'Active', value: '128', icon: IndianRupee, color: 'text-emerald-600' },
              { label: 'Drafts', value: '14', icon: Edit3, color: 'text-amber-600' },
              { label: 'Flagged', value: '2', icon: ShieldAlert, color: 'text-rose-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm flex items-center space-x-4">
                <div className={`p-3 bg-slate-50 rounded-2xl ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scheme Table */}
          <div className="bg-white border rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheme Title</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ministry</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schemes.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-slate-900">{scheme.title}</div>
                      <div className="text-xs text-muted-foreground font-medium">Updated 2 days ago</div>
                    </td>
                    <td className="p-6 font-medium text-slate-600 text-sm">{scheme.ministry}</td>
                    <td className="p-6 font-medium text-slate-600 text-sm">{scheme.category}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${scheme.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {scheme.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
