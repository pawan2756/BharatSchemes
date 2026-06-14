"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import SchemeCard from '@/components/dashboard/SchemeCard';
import { 
  Search, Filter, Globe, TrendingUp, Heart, ChevronDown, 
  Plus, Minus, MapPin, Building2, RefreshCcw, ShieldCheck, Check
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedState, setSelectedState] = useState('Select');
  const [expandedFilters, setExpandedFilters] = useState(['Scheme Category', 'Gender', 'Area', 'Caste', 'Student Status']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedCaste, setSelectedCaste] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState('All');
  const [selectedFarmer, setSelectedFarmer] = useState('All');
  const [selectedAgeBracket, setSelectedAgeBracket] = useState('Any');
  const [sortBy, setSortBy] = useState('Relevance');

  useEffect(() => {
    fetchSchemes();
    const token = localStorage.getItem('bharatbenefit_token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data.profile?.savedSchemes) {
          setSavedIds(new Set(res.data.profile.savedSchemes));
        }
      })
      .catch(e => console.error("Could not fetch saved schemes"));
    }
  }, []);

  const fetchSchemes = async () => {
    try {
      let isProfileFilled = false;
      const saved = localStorage.getItem('bharatbenefit_profile');
      if (saved) {
        try {
          const profile = JSON.parse(saved);
          if (profile.age || profile.state || profile.income) isProfileFilled = true;
        } catch(e) {}
      }

      const response = await axios.get('http://localhost:5000/api/schemes');
      const normalized = response.data.map((s) => {
        const score = null;
        const calcStatus = 'Not Calculated';

        // Mongoose sets empty array [] by default, which is truthy, so we check length
        const docs = s.requiredDocuments && s.requiredDocuments.length > 0 
          ? s.requiredDocuments 
          : ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'].slice(0, 2);
          
        const link = s.officialLink && s.officialLink.trim() !== '' 
          ? s.officialLink 
          : 'https://www.myscheme.gov.in';

        return {
          ...s,
          status: calcStatus,
          matchPercentage: s.matchPercentage || score,
          requiredDocuments: docs,
          officialLink: link
        };
      });
      setSchemes(normalized);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToggle = async (id) => {
    const token = localStorage.getItem('bharatbenefit_token');
    if (!token) return alert('Please login to save schemes!');

    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await axios.post('http://localhost:5000/api/auth/saved', { schemeId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to save scheme");
      // Revert UI on failure
      setSavedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const getCategoryCount = (cat) => {
    return schemes.filter(s => s.category === cat).length;
  };

  const toggleFilter = (name) => {
    setExpandedFilters(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedState('Select');
    setSearchQuery('');
    setSelectedGender('All');
    setSelectedArea('All');
    setSelectedCaste('All');
    setSelectedStudent('All');
    setSelectedFarmer('All');
    setSelectedAgeBracket('Any');
    setSortBy('Relevance');
  };

  const getFilteredSchemes = () => {
    let list = [...schemes];

    // Tab Filtering
    if (activeTab === 'State/UT') list = list.filter(s => s.schemeType === 'State');
    if (activeTab === 'Central') list = list.filter(s => s.schemeType === 'Central');
    if (activeTab === 'Saved') list = list.filter(s => savedIds.has(s._id));

    // Sidebar Filtering
    if (selectedCategories.length > 0) list = list.filter(s => selectedCategories.includes(s.category));
    
    if (selectedState !== 'Select' && selectedState !== 'All India') {
      list = list.filter(s => s.eligibilityRules?.states?.includes('All') || s.eligibilityRules?.states?.includes(selectedState));
    }

    // Gender Filtering
    if (selectedGender !== 'All') {
      list = list.filter(s => s.eligibilityRules?.gender?.includes('All') || s.eligibilityRules?.gender?.includes(selectedGender));
    }

    // Area Filtering
    if (selectedArea !== 'All') {
      const isRural = selectedArea === 'Rural';
      list = list.filter(s => s.eligibilityRules?.isRural === null || s.eligibilityRules?.isRural === isRural);
    }
    
    // Caste Filtering
    if (selectedCaste !== 'All') {
       list = list.filter(s => s.eligibilityRules?.castes?.includes('All') || s.eligibilityRules?.castes?.includes(selectedCaste));
    }

    // Student Filtering
    if (selectedStudent !== 'All') {
      const isStudent = selectedStudent === 'Student';
      list = list.filter(s => s.eligibilityRules?.isStudent === null || s.eligibilityRules?.isStudent === isStudent);
    }

    // Farmer Filtering
    if (selectedFarmer !== 'All') {
      const isFarmer = selectedFarmer === 'Farmer';
      list = list.filter(s => s.eligibilityRules?.isFarmer === null || s.eligibilityRules?.isFarmer === isFarmer);
    }

    // Age Bracket Filtering
    if (selectedAgeBracket !== 'Any') {
      list = list.filter(s => {
        const min = s.eligibilityRules?.age?.min ?? 0;
        const max = s.eligibilityRules?.age?.max ?? 150;
        
        if (selectedAgeBracket === 'Minor (<18)') return min < 18;
        if (selectedAgeBracket === 'Adult (18-60)') return max >= 18 && min <= 60;
        if (selectedAgeBracket === 'Senior (60+)') return max >= 60;
        return true;
      });
    }

    // Search
    if (searchQuery) {
      list = list.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ministry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'Newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'Deadline') {
      list.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }

    return list;
  };

  const filteredSchemes = getFilteredSchemes();

  const categories = [
    'Social welfare & Empowerment', 
    'Education & Learning', 
    'Agriculture,Rural & Environment', 
    'Business & Entrepreneurship', 
    'Women and Child',
    'Health & Wellness',
    'Banking,Financial Services and Insurance'
  ];

  const FilterSection = ({ title, children }) => (
    <div className="border-b border-slate-100 py-5">
      <button 
        onClick={() => toggleFilter(title)}
        className="flex items-center justify-between w-full text-slate-800 font-bold text-sm mb-3 hover:text-green-700 transition-colors"
      >
        <span>{title}</span>
        {expandedFilters.includes(title) ? <Minus size={16} className="text-green-600" /> : <Plus size={16} />}
      </button>
      <AnimatePresence>
        {expandedFilters.includes(title) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3 pt-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-10">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sticky top-28 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Filter By</h2>
              <button onClick={resetFilters} className="text-green-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-all">
                <RefreshCcw size={14} /> Reset
              </button>
            </div>

            <div className="space-y-2">
              <div className="space-y-3 mb-6">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">State/UT</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-green-500/10 focus:border-green-500 transition-all cursor-pointer"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    <option value="Select">Select State</option>
                    <option value="All India">All India</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <FilterSection title="Scheme Category">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCategories.includes(cat) ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                        {selectedCategories.includes(cat) && <Check size={14} className="text-white" />}
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => setSelectedCategories(prev => 
                            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                          )}
                        />
                      </div>
                      <span className={`text-sm font-bold ${selectedCategories.includes(cat) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{cat}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{getCategoryCount(cat)}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Gender">
                {['Male', 'Female', 'Transgender', 'All'].map((g) => (
                  <label key={g} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedGender === g ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                      {selectedGender === g && <div className="w-2 h-2 rounded-full bg-white" />}
                      <input 
                        type="radio" 
                        name="gender"
                        className="hidden"
                        checked={selectedGender === g}
                        onChange={() => setSelectedGender(g)}
                      />
                    </div>
                    <span className={`text-sm font-bold ${selectedGender === g ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{g}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Area">
                {['Rural', 'Urban', 'All'].map((a) => (
                  <label key={a} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedArea === a ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                      {selectedArea === a && <div className="w-2 h-2 rounded-full bg-white" />}
                      <input 
                        type="radio" 
                        name="area"
                        className="hidden"
                        checked={selectedArea === a}
                        onChange={() => setSelectedArea(a)}
                      />
                    </div>
                    <span className={`text-sm font-bold ${selectedArea === a ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{a}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Caste/Category">
                {['General', 'OBC', 'SC', 'ST', 'All'].map((c) => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedCaste === c ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                      {selectedCaste === c && <div className="w-2 h-2 rounded-full bg-white" />}
                      <input 
                        type="radio" 
                        name="caste"
                        className="hidden"
                        checked={selectedCaste === c}
                        onChange={() => setSelectedCaste(c)}
                      />
                    </div>
                    <span className={`text-sm font-bold ${selectedCaste === c ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{c}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Student Status">
                {['Student', 'Non-Student', 'All'].map((st) => (
                  <label key={st} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedStudent === st ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                      {selectedStudent === st && <div className="w-2 h-2 rounded-full bg-white" />}
                      <input 
                        type="radio" 
                        name="student"
                        className="hidden"
                        checked={selectedStudent === st}
                        onChange={() => setSelectedStudent(st)}
                      />
                    </div>
                    <span className={`text-sm font-bold ${selectedStudent === st ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{st}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Farmer Status">
                {['Farmer', 'Non-Farmer', 'All'].map((fm) => (
                  <label key={fm} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedFarmer === fm ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                      {selectedFarmer === fm && <div className="w-2 h-2 rounded-full bg-white" />}
                      <input 
                        type="radio" 
                        name="farmer"
                        className="hidden"
                        checked={selectedFarmer === fm}
                        onChange={() => setSelectedFarmer(fm)}
                      />
                    </div>
                    <span className={`text-sm font-bold ${selectedFarmer === fm ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{fm}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Age Bracket">
                {['Minor (<18)', 'Adult (18-60)', 'Senior (60+)', 'Any'].map((ab) => (
                  <label key={ab} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedAgeBracket === ab ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-green-400'}`}>
                      {selectedAgeBracket === ab && <div className="w-2 h-2 rounded-full bg-white" />}
                      <input 
                        type="radio" 
                        name="ageBracket"
                        className="hidden"
                        checked={selectedAgeBracket === ab}
                        onChange={() => setSelectedAgeBracket(ab)}
                      />
                    </div>
                    <span className={`text-sm font-bold ${selectedAgeBracket === ab ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{ab}</span>
                  </label>
                ))}
              </FilterSection>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-8">
          {/* Search Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Find Government Schemes</h1>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search schemes by name, keyword or ministry..." 
                  className="w-full pl-8 pr-16 py-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-8 ring-green-500/5 focus:border-green-500 outline-none text-lg font-bold text-slate-800 transition-all placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-200">
                  <Search size={24} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <ShieldCheck size={18} className="text-green-600" />
                <span>Verified schemes from official Central and State government portals.</span>
              </div>
            </div>
          </div>

          {/* TAB SYSTEM */}
          <div className="flex border-b border-slate-200 gap-12 px-2 overflow-x-auto no-scrollbar">
            {['All Schemes', 'State/UT Schemes', 'Central Schemes', 'Saved Schemes'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(
                  tab.startsWith('All') ? 'All' : 
                  tab.startsWith('State') ? 'State/UT' : 
                  tab.startsWith('Central') ? 'Central' : 
                  'Saved'
                )}
                className={`py-5 text-base font-black transition-all relative whitespace-nowrap ${
                  (activeTab === 'All' && tab.startsWith('All')) || 
                  (activeTab === 'State/UT' && tab.startsWith('State')) || 
                  (activeTab === 'Central' && tab.startsWith('Central')) ||
                  (activeTab === 'Saved' && tab.startsWith('Saved'))
                    ? 'text-green-700' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
                {((activeTab === 'All' && tab.startsWith('All')) || 
                  (activeTab === 'State/UT' && tab.startsWith('State')) || 
                  (activeTab === 'Central' && tab.startsWith('Central')) ||
                  (activeTab === 'Saved' && tab.startsWith('Saved'))) && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[4px] bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Results Metadata */}
          <div className="flex items-center justify-between">
            <p className="text-slate-600 font-bold">Total <span className="text-slate-900 text-lg px-2 py-1 bg-green-50 rounded-lg">{filteredSchemes.length}</span> schemes available</p>
            <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sort By:</span>
              <div className="relative">
                <select 
                  className="appearance-none text-sm font-black text-slate-800 bg-transparent pr-6 pl-2 outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Relevance">Relevance</option>
                  <option value="Newest">Newest First</option>
                  <option value="Deadline">Deadline Soon</option>
                </select>
                <ChevronDown size={16} className="text-green-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Cards List */}
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white border border-slate-100 rounded-[2rem] animate-pulse" />)}
              </div>
            ) : filteredSchemes.length > 0 ? (
              <div className="space-y-8">
                {filteredSchemes.map((scheme) => (
                  <motion.div 
                    key={scheme._id} 
                    layout
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SchemeCard 
                      {...scheme} 
                      isSaved={savedIds.has(scheme._id)}
                      onSaveToggle={handleSaveToggle}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white border-4 border-dashed border-slate-100 rounded-[3rem]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6"><Globe size={48} /></div>
                <h3 className="text-2xl font-black text-slate-900">No matching schemes found</h3>
                <p className="text-slate-500 mt-2 font-medium">Try resetting your filters or using different keywords.</p>
                <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">Clear All Filters</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
