import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { SiteConfig } from '../../types';
import { XIcon } from '../../components/Icons';

const AdminSettings = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

  useEffect(() => {
    storageService.getConfig().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (!config) return;
    await storageService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.dispatchEvent(new Event('storage'));
  };

  const handleChange = (section: keyof SiteConfig, key: string, value: string) => {
    if (!config) return;
    setConfig(prev => {
        if (!prev) return null;
        if (section === 'socials' || section === 'contact') {
            return {
                ...prev,
                [section]: {
                    ...prev[section as 'socials' | 'contact'],
                    [key]: value
                }
            };
        }
        return { ...prev, [key]: value };
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
            alert("Image is too large. Please use an image under 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleChange('logoUrl', 'logoUrl', base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const addSocial = () => {
    if (!config) return;
    if (newSocial.platform && newSocial.url) {
        setConfig(prev => {
            if (!prev) return null;
            return {
                ...prev,
                socials: {
                    ...prev.socials,
                    [newSocial.platform.toLowerCase()]: newSocial.url
                }
            };
        });
        setNewSocial({ platform: '', url: '' });
    }
  };

  const removeSocial = (platform: string) => {
      if (!config) return;
      const newSocials = { ...config.socials };
      delete newSocials[platform];
      setConfig({ ...config, socials: newSocials });
  };

  if (!config) return <div className="text-slate-400">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Global Settings</h1>
        <button 
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-600/20"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Identity */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Agency Name</label>
              <input 
                type="text" 
                value={config.agencyName}
                onChange={(e) => handleChange('agencyName', 'agencyName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Tagline</label>
              <input 
                type="text" 
                value={config.tagline}
                onChange={(e) => handleChange('tagline', 'tagline', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-400 mb-2">Logo</label>
               <div className="flex gap-4 items-start">
                 <div className="flex-1 space-y-3">
                    <input 
                        type="text" 
                        value={config.logoUrl}
                        onChange={(e) => handleChange('logoUrl', 'logoUrl', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none text-sm font-mono"
                        placeholder="Image URL or Base64..."
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 uppercase">OR</span>
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded border border-slate-700 transition">
                            Upload File
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                    </div>
                 </div>
                 <div className="h-24 w-24 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden relative">
                    {config.logoUrl ? (
                        <img src={config.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                        <span className="text-xs text-slate-500">No Logo</span>
                    )}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input 
                type="text" 
                value={config.contact.email}
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
              <input 
                type="text" 
                value={config.contact.phone}
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
              <input 
                type="text" 
                value={config.contact.address}
                onChange={(e) => handleChange('contact', 'address', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Social Suite</h2>
          
          <div className="space-y-4 mb-6">
            {Object.entries(config.socials).map(([platform, url]) => (
                <div key={platform} className="flex gap-4 items-end">
                    <div className="w-1/3">
                        <label className="block text-xs font-medium text-slate-500 mb-1 capitalize">Platform</label>
                        <div className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 capitalize cursor-not-allowed">
                            {platform}
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">URL</label>
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => handleChange('socials', platform, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => removeSocial(platform)}
                        className="bg-red-500/10 text-red-400 p-3 rounded-lg hover:bg-red-500/20 border border-red-500/20 transition mb-[2px]"
                        title="Remove"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
             <h3 className="text-sm font-bold text-slate-400 mb-4">Add New Platform</h3>
             <div className="flex gap-4 items-end">
                <div className="w-1/3">
                    <input 
                        placeholder="e.g. TikTok"
                        value={newSocial.platform}
                        onChange={(e) => setNewSocial({...newSocial, platform: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div className="flex-1">
                    <input 
                        placeholder="https://..."
                        value={newSocial.url}
                        onChange={(e) => setNewSocial({...newSocial, url: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <button 
                    onClick={addSocial}
                    disabled={!newSocial.platform || !newSocial.url}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                    Add
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;