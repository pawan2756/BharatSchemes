"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { User, Mail, MapPin, Briefcase, Camera, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const defaultProfile = {
  name: '',
  email: '',
  age: '',
  gender: '',
  state: '',
  income: '',
  caste: '',
  isStudent: false,
  isFarmer: false,
  verified: false
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(defaultProfile);
  const [documents, setDocuments] = useState(['Aadhaar Card', 'Income Certificate']);
  const [savedCount, setSavedCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('bharatbenefit_token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
        
        const mappedProfile = {
          name: data.name || '',
          email: data.email || '',
          age: data.profile?.age || '',
          gender: data.profile?.gender || '',
          state: data.profile?.location?.state || '',
          income: data.profile?.socioEconomic?.familyIncome || '',
          caste: data.profile?.socioEconomic?.caste || '',
          isStudent: data.profile?.status?.isStudent || false,
          isFarmer: data.profile?.status?.isFarmer || false,
          verified: data.profile?.documents?.length > 0
        };
        
        setProfile(mappedProfile);
        setEditedProfile(mappedProfile);
        setSavedCount(data.profile?.savedSchemes?.length || 0);
        setAppliedCount(data.profile?.appliedSchemes?.length || 0);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('bharatbenefit_token');
    if (!token) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:5000/api/auth/profile', editedProfile, config);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to save profile details to database');
    }
  };

  const handleAddDocument = () => {
    const docName = prompt("Enter Document Name (e.g., PAN Card, Caste Certificate):");
    if (docName && docName.trim() !== '') {
      const newDocs = [...documents, docName.trim()];
      setDocuments(newDocs);
      localStorage.setItem('bharatbenefit_docs', JSON.stringify(newDocs));
    }
  };


  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto pt-32 pb-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border rounded-[2rem] p-8 text-center shadow-sm">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-inner">
                  {profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : <User size={48} />}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full border-4 border-white">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-xl font-black text-slate-900">{profile.name || 'New Citizen'}</h2>
              <p className="text-sm text-muted-foreground font-medium mb-4">{profile.email || 'No email added'}</p>
              
              <div className={`inline-flex items-center space-x-2 px-4 py-1 rounded-full text-xs font-bold border ${profile.verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {profile.verified ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                <span>{profile.verified ? 'Verified Citizen' : 'Pending Verification'}</span>
              </div>
            </div>

            <div className="bg-white border rounded-[2rem] p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Saved Schemes</span>
                  <span className="font-bold">{savedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Applied</span>
                  <span className="font-bold text-emerald-600">{appliedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-[2rem] shadow-sm overflow-hidden">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">Personal Details</h2>
                {isEditing ? (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-all">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                      Save
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                    {profile.name ? 'Edit Profile' : 'Add Details'}
                  </button>
                )}
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                      <input type="text" value={editedProfile.name} onChange={e => setEditedProfile({...editedProfile, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                      <input type="email" value={editedProfile.email} onChange={e => setEditedProfile({...editedProfile, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
                      <input type="number" value={editedProfile.age} onChange={e => setEditedProfile({...editedProfile, age: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                      <select value={editedProfile.gender} onChange={e => setEditedProfile({...editedProfile, gender: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">State</label>
                      <input type="text" value={editedProfile.state} onChange={e => setEditedProfile({...editedProfile, state: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Caste Category</label>
                      <select value={editedProfile.caste} onChange={e => setEditedProfile({...editedProfile, caste: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                        <option value="">Select</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Annual Income</label>
                      <input type="number" value={editedProfile.income} onChange={e => setEditedProfile({...editedProfile, income: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600" />
                    </div>
                    <div className="space-y-3 col-span-1 md:col-span-2 mt-2 border-t pt-6">
                      <label className="text-xs font-bold text-slate-400 uppercase">Occupation Status</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer font-bold">
                          <input type="checkbox" checked={editedProfile.isStudent} onChange={e => setEditedProfile({...editedProfile, isStudent: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-primary" />
                          I am a Student
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-bold">
                          <input type="checkbox" checked={editedProfile.isFarmer} onChange={e => setEditedProfile({...editedProfile, isFarmer: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-primary" />
                          I am a Farmer
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Age</p>
                      <p className="font-bold text-slate-900 text-lg">{profile.age ? `${profile.age} Years` : '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Gender</p>
                      <p className="font-bold text-slate-900 text-lg">{profile.gender || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">State of Residence</p>
                      <p className="font-bold text-slate-900 text-lg">{profile.state || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Caste Category</p>
                      <p className="font-bold text-slate-900 text-lg">{profile.caste || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Annual Income</p>
                      <p className="font-bold text-emerald-600 text-lg">{profile.income ? `₹${Number(profile.income).toLocaleString()}` : '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase">Occupation</p>
                      <div className="flex gap-2 mt-1">
                        {profile.isStudent && <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold">Student</span>}
                        {profile.isFarmer && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold">Farmer</span>}
                        {!profile.isStudent && !profile.isFarmer && <span className="text-slate-500 font-bold">-</span>}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Uploaded Documents</h3>
                  <button onClick={handleAddDocument} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-emerald-600 transition-colors">
                    Add New <AlertCircle size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.length === 0 && (
                    <p className="text-sm font-medium text-slate-400 col-span-2">No documents uploaded yet.</p>
                  )}
                  {documents.map((doc, idx) => (
                    <div key={idx} className="p-4 bg-white border rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{doc}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
