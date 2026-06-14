"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, IndianRupee, ArrowRight, CheckCircle2, 
  AlertCircle, X, ExternalLink, ShieldCheck, FileText, Info,
  Heart, MapPin, Building2
} from 'lucide-react';


const SchemeCard = ({ 
  _id, title, category, ministry, amount, deadline, status, 
  matchPercentage, description, officialLink, requiredDocuments,
  schemeType = 'Central', tags = [],
  isSaved: initialSaved = false,
  onSaveToggle 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    if (onSaveToggle && _id) {
      onSaveToggle(_id);
    }
  };

  const statusColors = {
    'Eligible': 'bg-green-50 text-green-700 border-green-100',
    'Likely Eligible': 'bg-amber-50 text-amber-700 border-amber-100',
    'Not Eligible': 'bg-red-50 text-red-700 border-red-100',
    'Pending Profile': 'bg-slate-50 text-slate-700 border-slate-200',
    'Not Calculated': 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-green-700 transition-colors cursor-pointer" onClick={() => setShowModal(true)}>
              {title}
            </h3>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Building2 size={14} className="text-green-600" /> {ministry}
            </p>
          </div>
          <button 
            onClick={handleSave}
            className={`p-2 rounded-full transition-all ${isSaved ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-500 hover:bg-slate-50'}`}
          >
            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {description?.raw || "This scheme provides comprehensive support to eligible beneficiaries as per the ministry guidelines."}
        </p>

        <div className="flex items-center gap-1.5 mb-6 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg w-max">
          <Calendar size={14} /> 
          Deadline: {deadline ? new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Ongoing'}
        </div>

        {/* Tags from screenshot style */}
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-100">
            {category}
          </span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-full border border-indigo-100 flex items-center gap-1">
            <MapPin size={10} /> {schemeType}
          </span>
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full border border-slate-200">
              {tag}
            </span>
          ))}
          {tags.length > 3 && <span className="text-[11px] font-bold text-slate-400">+{tags.length - 3} more</span>}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility Score</span>
            <span className="text-lg font-black text-green-600">{matchPercentage ? `${matchPercentage}%` : '-'}</span>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100"
          >
            View Details <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl relative overflow-hidden z-10 flex flex-col max-h-[90vh]">
              <div className="p-8 pb-4 border-b border-slate-100 flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                  <p className="text-green-600 font-bold uppercase text-xs tracking-widest">{ministry}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <div className="overflow-y-auto p-8 space-y-8">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Info size={18} className="text-green-600" /> Scheme Description
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-base">{description?.raw}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Benefits</p>
                    <p className="text-xl font-bold text-slate-900">{amount ? `₹${amount.toLocaleString()}` : 'Varies based on eligibility'}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[status]}`}>{status}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={18} className="text-green-600" /> Required Documents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(requiredDocuments || ['Aadhaar Card', 'Income Certificate']).map((doc, i) => (
                      <span key={i} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100 flex items-center gap-2">
                        <CheckCircle2 size={14} /> {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 flex gap-4">
                <a href={officialLink || "#"} target="_blank" className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all">
                  Apply on Official Portal <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SchemeCard;
