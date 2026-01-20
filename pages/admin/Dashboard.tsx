import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { EnvelopeIcon } from '../../components/Icons';
import { Project, Lead } from '../../types';

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const l = await storageService.getLeads();
        const p = await storageService.getProjects();
        setLeads(l);
        setProjects(p);
        setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="text-slate-400">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <EnvelopeIcon className="w-20 h-20 text-white" />
          </div>
          <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Leads</div>
          <div className="text-4xl font-bold text-white">{leads.length}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Active Projects</div>
          <div className="text-4xl font-bold text-indigo-400">{projects.length}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
           <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Conversion Rate</div>
           <div className="text-4xl font-bold text-emerald-400">~4.2%</div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-white">Recent Inquiries</h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">Last 30 Days</span>
        </div>
        {leads.length === 0 ? (
           <div className="p-12 text-center text-slate-500">No leads yet. They'll appear here.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="p-6 hover:bg-slate-800/50 transition">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-indigo-500/10 p-2 rounded-full mr-3 border border-indigo-500/20">
                       <EnvelopeIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.email}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{new Date(lead.date).toLocaleDateString()}</span>
                </div>
                <div className="ml-11">
                   <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 mb-3 border border-slate-700">
                      {lead.serviceInterest}
                   </span>
                   <p className="text-sm text-slate-400 bg-slate-950 p-4 rounded-lg border border-slate-800/50 leading-relaxed italic">"{lead.message}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;