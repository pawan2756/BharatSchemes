"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('bharatbenefit_token', data.token);
      localStorage.setItem('bharatbenefit_user', JSON.stringify(data));
      
      const defaultProfile = {
        name: data.name, email: data.email, age: '', gender: '', state: '', income: '', caste: '', isStudent: false, isFarmer: false, verified: false
      };
      localStorage.setItem('bharatbenefit_profile', JSON.stringify(defaultProfile));
      router.push('/profile');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Email might already exist.';
      alert(`Error: ${msg}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Sparkles size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
            <p className="text-slate-500 mt-2 font-medium">Join BharatBenefit to find schemes</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all" placeholder="Pawan Kumar" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold transition-all" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-200">
              Register
            </button>
          </form>
          <p className="text-center mt-6 text-slate-500 font-bold text-sm">
            Already have an account? <Link href="/login" className="text-emerald-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
