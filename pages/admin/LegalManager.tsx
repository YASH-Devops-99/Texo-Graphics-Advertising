import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { SiteConfig } from '../../types';

const AdminLegal = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'privacyPolicy' | 'termsConditions' | 'refundPolicy'>('privacyPolicy');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storageService.getConfig().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    await storageService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!config) return <div className="text-slate-400">Loading Legal Docs...</div>;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Legal Pages Editor</h1>
        <button 
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-600/20"
        >
          {saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(['privacyPolicy', 'termsConditions', 'refundPolicy'] as const).map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'}`}
           >
             {tab.replace(/([A-Z])/g, ' $1').trim()}
           </button>
        ))}
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl shadow-sm border border-slate-800 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center p-3 bg-slate-950 border-b border-slate-800">
           <span className="text-xs text-slate-500 uppercase tracking-wide font-bold px-2">Markdown Editor</span>
        </div>
        <textarea
          value={config.legal[activeTab]}
          onChange={(e) => setConfig({
            ...config,
            legal: { ...config.legal, [activeTab]: e.target.value }
          })}
          className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-sm text-slate-300 bg-slate-900"
          placeholder="Start typing your policy here..."
        />
      </div>
    </div>
  );
};

export default AdminLegal;