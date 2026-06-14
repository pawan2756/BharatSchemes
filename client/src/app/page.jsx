"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [schemeCount, setSchemeCount] = useState('...');

  useEffect(() => {
    axios.get('http://localhost:5000/api/schemes')
      .then(res => setSchemeCount(res.data.length))
      .catch(() => setSchemeCount('3,500+'));
  }, []);
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:pt-48 md:pb-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-300 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8">


          <h1 className="text-5xl md:text-7xl font-heading font-black text-slate-900 tracking-tighter leading-[1.1]">
            Empowering Every Indian <br />
            With <span className="text-primary">BharatBenefit.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium">
            Discover every government scheme, scholarship, and grant you qualify for. 
            Powered by AI to simplify complex rules and bureaucratic language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center pt-4">
            <Link 
              href="/dashboard"
              className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Dashboard</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900">{schemeCount}</span>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Schemes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900">5M+</span>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Citizens</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900">28</span>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-500">States</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900">₹100B+</span>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Disbursed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">Eligibility Engine</h3>
            <p className="text-slate-400">Our advanced algorithms match your profile against thousands of scheme rules in seconds.</p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-violet-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">AI Explainer</h3>
            <p className="text-slate-400">No more legalese. Get simple, easy-to-understand summaries of every benefit in your language.</p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-fuchsia-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold">Multilingual</h3>
            <p className="text-slate-400">Support for Hindi, English, and regional languages to reach every corner of India.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
