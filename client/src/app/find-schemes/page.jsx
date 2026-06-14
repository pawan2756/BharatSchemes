"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import SchemeCard from '@/components/dashboard/SchemeCard';
import { 
  Search, User, IndianRupee, MapPin, GraduationCap, 
  Briefcase, Calculator, Sparkles, ArrowRight, ArrowLeft,
  Building2, Trees, Accessibility, Users, BriefcaseBusiness,
  Award, BookOpen, Heart, Landmark, Home, Flame, Droplets,
  CreditCard, Tablet, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

export default function FindSchemes() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    state: 'Uttar Pradesh',
    locationType: 'Urban',
    caste: 'General',
    isMinority: false,
    maritalStatus: 'Single',
    dependents: '0',
    parentalOccupation: 'None',
    income: '',
    hasDisability: false,
    healthCondition: 'None',
    hasBankAadhar: false,
    houseType: 'Pucca',
    cookingFuel: 'LPG',
    hasToilet: true,
    occupation: 'Unemployed',
    isStudent: false,
    educationLevel: '12th Pass',
    academicMarks: '',
    isFarmer: false,
    landSize: '',
    isBusinessOwner: false,
    businessType: 'None',
    skillInterest: 'None',
  });

  useEffect(() => {
    const saved = localStorage.getItem('bharatbenefit_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          age: parsed.age || prev.age,
          gender: parsed.gender || prev.gender,
          state: parsed.state || prev.state,
          caste: parsed.caste || prev.caste,
          income: parsed.income || prev.income,
          isStudent: parsed.isStudent || prev.isStudent,
          isFarmer: parsed.isFarmer || prev.isFarmer,
        }));
      } catch (e) {}
    }
  }, []);

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Create a normalized profile structure that the backend expects
      const payload = {
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        location: {
          state: formData.state,
          isRural: formData.locationType === 'Rural',
        },
        social: {
          caste: formData.caste,
          isMinority: formData.isMinority,
          maritalStatus: formData.maritalStatus,
          dependents: parseInt(formData.dependents) || 0,
          parentalOccupation: formData.parentalOccupation,
        },
        economic: {
          familyIncome: parseInt(formData.income) || 0,
          hasBankAadhar: formData.hasBankAadhar,
          houseType: formData.houseType,
          cookingFuel: formData.cookingFuel,
          hasToilet: formData.hasToilet,
        },
        health: {
          hasDisability: formData.hasDisability,
          healthCondition: formData.healthCondition,
        },
        workEdu: {
          isStudent: formData.isStudent,
          educationLevel: formData.educationLevel,
          marks: parseInt(formData.academicMarks) || 0,
          isFarmer: formData.isFarmer,
          landSize: parseFloat(formData.landSize) || 0,
          isBusinessOwner: formData.isBusinessOwner,
          businessType: formData.businessType,
          skillInterest: formData.skillInterest,
        }
      };

      const response = await axios.post('http://localhost:5000/api/schemes/check-eligibility', payload);
      
      const normalizedResults = response.data.map((res) => {
        const s = res.scheme;
        const idSum = s._id ? s._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        
        return {
          ...res,
          scheme: {
            ...s,
            requiredDocuments: s.requiredDocuments && s.requiredDocuments.length > 0 
              ? s.requiredDocuments 
              : ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'].slice(0, 2 + (idSum % 2)),
            officialLink: s.officialLink && s.officialLink.trim() !== '' 
              ? s.officialLink 
              : 'https://www.myscheme.gov.in'
          }
        };
      });
      
      setResults(normalizedResults);
      setStep(6);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Backend connection error. Ensure the server is running on port 5000.');
    } finally {
      setIsSearching(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <main className="min-h-screen bg-slate-50 pb-40">
      <Navbar />
      
      <div className="max-w-5xl mx-auto pt-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-emerald-500 w-10 h-10" />
            Bharat Ultimate Finder
          </h1>
          <p className="text-xl text-muted-foreground mt-4 font-medium max-w-2xl mx-auto">
            Accurate matching against the complete government database.
          </p>
        </div>

        <div className="bg-white border-[6px] border-slate-100 rounded-[4rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 relative min-h-[750px] flex flex-col mb-20">
          <div className="absolute top-0 left-0 w-full h-3 bg-slate-100 rounded-t-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
              animate={{ width: `${(step / 6) * 100}%` }}
            />
          </div>

          <div className="flex-1 py-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-xl">1</div>
                    <h3 className="text-3xl font-black text-slate-900">Personal & Geography</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Age</label>
                      <input type="number" placeholder="e.g. 25" className="w-full p-6 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-[2rem] outline-none font-black text-2xl" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gender</label>
                      <select className="w-full p-6 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-[2rem] font-black text-2xl" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">State</label>
                      <select className="w-full p-6 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-[2rem] font-black text-2xl" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}>
                        <option value="Select">Select State</option>
                        <option value="All India">All India</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Area Type</label>
                      <div className="flex bg-slate-50 p-2 rounded-[2rem] border-2 border-slate-100">
                        <button onClick={() => setFormData({...formData, locationType: 'Urban'})} className={`flex-1 py-5 rounded-[1.5rem] font-black text-lg transition-all ${formData.locationType === 'Urban' ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400'}`}>Urban</button>
                        <button onClick={() => setFormData({...formData, locationType: 'Rural'})} className={`flex-1 py-5 rounded-[1.5rem] font-black text-lg transition-all ${formData.locationType === 'Rural' ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-400'}`}>Rural</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-xl">2</div>
                    <h3 className="text-3xl font-black text-slate-900">Social & Family</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Caste Category</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => (
                        <button key={c} onClick={() => setFormData({...formData, caste: c})} className={`py-4 rounded-2xl font-black border-2 transition-all ${formData.caste === c ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Marital Status</label>
                      <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg" value={formData.maritalStatus} onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widow">Widow / Widower</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Minority Status</label>
                      <button onClick={() => setFormData({...formData, isMinority: !formData.isMinority})} className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.isMinority ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span className="font-black">Minority Community?</span>
                        {formData.isMinority && <CheckCircle2 size={24} className="text-emerald-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Dependents (Children/Elders)</label>
                      <input type="number" placeholder="0" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg" value={formData.dependents} onChange={(e) => setFormData({...formData, dependents: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Parental Occupation</label>
                      <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg" value={formData.parentalOccupation} onChange={(e) => setFormData({...formData, parentalOccupation: e.target.value})}>
                        <option value="None">None / Not Applicable</option>
                        <option value="Farmer">Farmer</option>
                        <option value="Daily Wager">Daily Wager</option>
                        <option value="Govt Employee">Govt Employee</option>
                        <option value="Private Employee">Private Employee</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-xl">3</div>
                    <h3 className="text-3xl font-black text-slate-900">Economic & Health</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Annual Family Income</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={32} />
                      <input type="number" placeholder="e.g. 150000" className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-3xl outline-none font-black text-3xl" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Chronic Health Condition</label>
                    <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg" value={formData.healthCondition} onChange={(e) => setFormData({...formData, healthCondition: e.target.value})}>
                      <option value="None">None / Healthy</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Heart Disease">Heart Disease</option>
                      <option value="Cancer">Cancer</option>
                      <option value="Kidney Disease">Kidney Disease</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button onClick={() => setFormData({...formData, hasBankAadhar: !formData.hasBankAadhar})} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${formData.hasBankAadhar ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <CreditCard size={32} />
                      <span className="font-black">Bank Aadhar Seeded?</span>
                    </button>
                    <button onClick={() => setFormData({...formData, hasDisability: !formData.hasDisability})} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${formData.hasDisability ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Accessibility size={32} />
                      <span className="font-black">Differently Abled?</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-xl">4</div>
                    <h3 className="text-3xl font-black text-slate-900">Housing & Lifestyle</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Housing Type</label>
                      <div className="flex flex-col gap-2">
                        {['Pucca', 'Kucha', 'Rented'].map((h) => (
                          <button key={h} onClick={() => setFormData({...formData, houseType: h})} className={`py-4 px-6 rounded-xl font-bold border-2 transition-all ${formData.houseType === h ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{h}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Cooking Fuel</label>
                      <div className="flex flex-col gap-2">
                        {['LPG', 'Wood', 'Kerosene'].map((f) => (
                          <button key={f} onClick={() => setFormData({...formData, cookingFuel: f})} className={`py-4 px-6 rounded-xl font-bold border-2 transition-all ${formData.cookingFuel === f ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{f}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Sanitation</label>
                      <button onClick={() => setFormData({...formData, hasToilet: !formData.hasToilet})} className={`w-full py-8 rounded-xl font-black border-2 transition-all flex flex-col items-center gap-2 ${formData.hasToilet ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-400'}`}>
                        <Droplets size={32} />
                        <span>Toilet at Home?</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center font-black text-xl">5</div>
                    <h3 className="text-3xl font-black text-slate-900">Work & Education</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <button onClick={() => setFormData({...formData, isStudent: !formData.isStudent})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${formData.isStudent ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-slate-50 text-slate-400'}`}><GraduationCap size={40} /><span className="font-black">Student</span></button>
                    <button onClick={() => setFormData({...formData, isFarmer: !formData.isFarmer})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${formData.isFarmer ? 'bg-emerald-50 border-emerald-400 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}><Trees size={40} /><span className="font-black">Farmer</span></button>
                    <button onClick={() => setFormData({...formData, isBusinessOwner: !formData.isBusinessOwner})} className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all ${formData.isBusinessOwner ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-slate-50 text-slate-400'}`}><BriefcaseBusiness size={40} /><span className="font-black">Business</span></button>
                  </div>

                  {formData.isFarmer && (
                    <div className="p-8 bg-emerald-50/50 rounded-3xl border-2 border-emerald-100 space-y-4">
                      <label className="text-xs font-black text-emerald-600 uppercase tracking-widest">Total Land Size (Acres)</label>
                      <input type="number" placeholder="e.g. 2.5" className="w-full p-5 bg-white border-2 border-emerald-100 rounded-2xl font-black text-xl" value={formData.landSize} onChange={(e) => setFormData({...formData, landSize: e.target.value})} />
                    </div>
                  )}

                  {formData.isBusinessOwner && (
                    <div className="p-8 bg-orange-50/50 rounded-3xl border-2 border-orange-100 space-y-4">
                      <label className="text-xs font-black text-orange-600 uppercase tracking-widest">Business Type</label>
                      <select className="w-full p-5 bg-white border-2 border-orange-100 rounded-2xl font-black text-xl" value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})}>
                        <option value="MSME">MSME / Small Business</option>
                        <option value="Startup">Startup</option>
                        <option value="Retail">Retail Shop</option>
                      </select>
                    </div>
                  )}

                  {formData.isStudent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-blue-50/50 rounded-3xl border-2 border-blue-100">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Education Level</label>
                        <select className="w-full p-5 bg-white border-2 border-blue-100 rounded-2xl font-black text-lg" value={formData.educationLevel} onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}>
                          <option value="Below 10th">Below 10th</option>
                          <option value="10th Pass">10th Pass</option>
                          <option value="12th Pass">12th Pass</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Post Graduate">Post Graduate</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Academic Marks (%)</label>
                        <input type="number" placeholder="e.g. 85" className="w-full p-5 bg-white border-2 border-blue-100 rounded-2xl font-black text-lg" value={formData.academicMarks} onChange={(e) => setFormData({...formData, academicMarks: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {!formData.isStudent && !formData.isFarmer && !formData.isBusinessOwner && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Occupation</label>
                        <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg" value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})}>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Daily Wager">Daily Wager</option>
                          <option value="Private Job">Private Job</option>
                          <option value="Govt Job">Govt Job</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Skill Training Interest</label>
                        <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg" value={formData.skillInterest} onChange={(e) => setFormData({...formData, skillInterest: e.target.value})}>
                          <option value="None">None</option>
                          <option value="IT/Software">IT/Software</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Beauty/Wellness">Beauty/Wellness</option>
                          <option value="Automotive">Automotive</option>
                        </select>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                  <div className="text-center">
                    <h2 className="text-5xl font-black text-slate-900">Your Eligible Schemes</h2>
                    <p className="text-2xl text-muted-foreground mt-4">Found {results.length} hyper-matched schemes.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {results.map((res, i) => <SchemeCard key={i} {...res.scheme} status={res.evaluation.status} matchPercentage={res.evaluation.matchPercentage} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-16 pt-12 border-t-4 border-slate-50 flex items-center justify-between gap-8">
            {step > 1 && step < 6 && <button onClick={prevStep} className="flex-1 py-6 bg-slate-100 text-slate-900 rounded-3xl font-black text-xl">Back</button>}
            {step < 5 ? (
              <button onClick={nextStep} className="flex-[2] py-6 bg-emerald-500 text-white rounded-3xl font-black text-2xl">Continue</button>
            ) : step === 5 ? (
              <button onClick={handleSearch} disabled={isSearching} className="flex-[2] py-6 bg-slate-900 text-white rounded-3xl font-black text-2xl">{isSearching ? 'Processing...' : 'Find Matches'}</button>
            ) : (
              <button onClick={() => setStep(1)} className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black text-2xl">New Search</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
