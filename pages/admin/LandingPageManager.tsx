import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { SiteConfig, FeatureItem, TestimonialItem, TrustLogo } from '../../types';
import { XIcon } from '../../components/Icons';

const LandingPageManager = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [saved, setSaved] = useState(false);

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

  const updateHero = (key: string, val: string) => {
    if (!config) return;
    setConfig(prev => {
        if (!prev) return null;
        return { ...prev, landingPage: { ...prev.landingPage, hero: { ...prev.landingPage.hero, [key]: val } } }
    });
  };

  const updateTrust = (key: string, val: any) => {
     if (!config) return;
     setConfig(prev => {
        if (!prev) return null;
        return { ...prev, landingPage: { ...prev.landingPage, trust: { ...prev.landingPage.trust, [key]: val } } }
    });
  };

  const updateTrustLogo = (index: number, field: keyof TrustLogo, val: string) => {
      if (!config) return;
      const newLogos = [...config.landingPage.trust.logos];
      newLogos[index] = { ...newLogos[index], [field]: val };
      updateTrust('logos', newLogos);
  };

  const addTrustLogo = () => {
      if (!config) return;
      const newLogo: TrustLogo = {
          id: Date.now().toString(),
          name: 'New Partner',
          url: 'https://via.placeholder.com/150x50?text=LOGO'
      };
      updateTrust('logos', [...config.landingPage.trust.logos, newLogo]);
  };

  const removeTrustLogo = (index: number) => {
      if (!config) return;
      const newLogos = config.landingPage.trust.logos.filter((_, i) => i !== index);
      updateTrust('logos', newLogos);
  };

  const handleTrustLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
            alert("Image is too large. Please use an image under 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            updateTrustLogo(index, 'url', base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const updateSection = (section: 'features' | 'caseStudy' | 'testimonials' | 'cta', key: string, val: any) => {
    if (!config) return;
    setConfig(prev => {
        if (!prev) return null;
        return { ...prev, landingPage: { ...prev.landingPage, [section]: { ...prev.landingPage[section], [key]: val } } }
    });
  };

  // Features Helpers
  const updateFeature = (index: number, field: keyof FeatureItem, val: string) => {
      if (!config) return;
      const newItems = [...config.landingPage.features.items];
      newItems[index] = { ...newItems[index], [field]: val };
      updateSection('features', 'items', newItems);
  };
  const addFeature = () => {
      if (!config) return;
      const newItem: FeatureItem = { id: Date.now().toString(), title: "New Feature", description: "Description here." };
      updateSection('features', 'items', [...config.landingPage.features.items, newItem]);
  };
  const removeFeature = (index: number) => {
      if (!config) return;
      const newItems = config.landingPage.features.items.filter((_, i) => i !== index);
      updateSection('features', 'items', newItems);
  };

  // Testimonial Helpers
  const updateTestimonial = (index: number, field: keyof TestimonialItem, val: string) => {
      if (!config) return;
      const newItems = [...config.landingPage.testimonials.items];
      newItems[index] = { ...newItems[index], [field]: val };
      updateSection('testimonials', 'items', newItems);
  };
  const addTestimonial = () => {
      if (!config) return;
      const newItem: TestimonialItem = { id: Date.now().toString(), quote: "Amazing work.", author: "Name", role: "Role", company: "Company" };
      updateSection('testimonials', 'items', [...config.landingPage.testimonials.items, newItem]);
  };
  const removeTestimonial = (index: number) => {
      if (!config) return;
      const newItems = config.landingPage.testimonials.items.filter((_, i) => i !== index);
      updateSection('testimonials', 'items', newItems);
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'trust', label: 'Trust Bar' },
    { id: 'features', label: 'Features' },
    { id: 'caseStudy', label: 'Case Study' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'cta', label: 'Bottom CTA' },
  ];

  if (!config) return <div className="text-slate-400">Loading Landing Page...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Landing Page Content</h1>
        <button 
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-lg shadow-indigo-600/20"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-sm">
        
        {/* Hero Editor */}
        {activeTab === 'hero' && (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Top Badge</label>
                    <input 
                        value={config.landingPage.hero.badge}
                        onChange={e => updateHero('badge', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Headline</label>
                    <input 
                        value={config.landingPage.hero.headline}
                        onChange={e => updateHero('headline', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Subheadline</label>
                    <textarea 
                        value={config.landingPage.hero.subheadline}
                        onChange={e => updateHero('subheadline', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Primary CTA</label>
                        <input 
                            value={config.landingPage.hero.ctaPrimary}
                            onChange={e => updateHero('ctaPrimary', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Secondary CTA</label>
                        <input 
                            value={config.landingPage.hero.ctaSecondary}
                            onChange={e => updateHero('ctaSecondary', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Trust Bar Editor */}
        {activeTab === 'trust' && (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <input 
                        type="checkbox" 
                        checked={config.landingPage.trust.visible} 
                        onChange={e => updateTrust('visible', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-white font-medium">Show Section</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Section Title</label>
                    <input 
                        value={config.landingPage.trust.title}
                        onChange={e => updateTrust('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Client Logos</label>
                    <div className="space-y-4">
                        {config.landingPage.trust.logos.map((logo, i) => (
                            <div key={i} className="bg-slate-950 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-start">
                                <div className="h-20 w-32 bg-slate-900 rounded border border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                   {typeof logo === 'string' ? (
                                      <span className="text-xs text-slate-500">{logo}</span>
                                   ) : (
                                      <img src={logo.url} alt={logo.name} className="h-full w-full object-contain p-2" />
                                   )}
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="flex justify-between">
                                        <input 
                                            value={typeof logo === 'string' ? logo : logo.name}
                                            onChange={e => updateTrustLogo(i, 'name', e.target.value)}
                                            placeholder="Client Name"
                                            className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm w-full mr-2"
                                        />
                                        <button onClick={() => removeTrustLogo(i)} className="text-red-400 hover:text-red-300 p-1"><XIcon /></button>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                       <input 
                                          value={typeof logo === 'string' ? '' : logo.url}
                                          onChange={e => updateTrustLogo(i, 'url', e.target.value)}
                                          placeholder="Image URL"
                                          className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-xs w-full"
                                       />
                                       <span className="text-xs text-slate-500">OR</span>
                                       <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded border border-slate-700 transition whitespace-nowrap">
                                          Upload
                                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTrustLogoUpload(e, i)} />
                                       </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addTrustLogo} className="mt-4 w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition text-sm font-medium">
                        + Add Client Logo
                    </button>
                </div>
            </div>
        )}

        {/* Features Editor */}
        {activeTab === 'features' && (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <input 
                        type="checkbox" 
                        checked={config.landingPage.features.visible} 
                        onChange={e => updateSection('features', 'visible', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-white font-medium">Show Section</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                    <input 
                        value={config.landingPage.features.title}
                        onChange={e => updateSection('features', 'title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle</label>
                    <textarea 
                        value={config.landingPage.features.subtitle}
                        onChange={e => updateSection('features', 'subtitle', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <label className="block text-sm font-medium text-slate-400">Feature Items</label>
                    {config.landingPage.features.items.map((item, i) => (
                        <div key={item.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs text-slate-500">Feature #{i + 1}</span>
                                <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300"><XIcon className="w-4 h-4" /></button>
                            </div>
                            <input 
                                value={item.title} 
                                onChange={e => updateFeature(i, 'title', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded mb-2 p-2 text-white text-sm"
                                placeholder="Title"
                            />
                            <textarea 
                                value={item.description} 
                                onChange={e => updateFeature(i, 'description', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                placeholder="Description"
                                rows={2}
                            />
                        </div>
                    ))}
                    <button onClick={addFeature} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition text-sm font-medium">
                        + Add Feature
                    </button>
                </div>
            </div>
        )}

        {/* Case Study Editor */}
        {activeTab === 'caseStudy' && (
             <div className="space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                    <input 
                        type="checkbox" 
                        checked={config.landingPage.caseStudy.visible} 
                        onChange={e => updateSection('caseStudy', 'visible', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-white font-medium">Show Section</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Badge Text</label>
                    <input 
                        value={config.landingPage.caseStudy.badge}
                        onChange={e => updateSection('caseStudy', 'badge', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                    <input 
                        value={config.landingPage.caseStudy.title}
                        onChange={e => updateSection('caseStudy', 'title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                    <textarea 
                        value={config.landingPage.caseStudy.description}
                        onChange={e => updateSection('caseStudy', 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Stat Value</label>
                        <input 
                            value={config.landingPage.caseStudy.statValue}
                            onChange={e => updateSection('caseStudy', 'statValue', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Stat Label</label>
                        <input 
                            value={config.landingPage.caseStudy.statLabel}
                            onChange={e => updateSection('caseStudy', 'statLabel', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">CTA Button Text</label>
                    <input 
                        value={config.landingPage.caseStudy.ctaText}
                        onChange={e => updateSection('caseStudy', 'ctaText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
             </div>
        )}

        {/* Testimonials Editor */}
        {activeTab === 'testimonials' && (
             <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <input 
                        type="checkbox" 
                        checked={config.landingPage.testimonials.visible} 
                        onChange={e => updateSection('testimonials', 'visible', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-white font-medium">Show Section</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                    <input 
                        value={config.landingPage.testimonials.title}
                        onChange={e => updateSection('testimonials', 'title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <label className="block text-sm font-medium text-slate-400">Testimonials</label>
                    {config.landingPage.testimonials.items.map((item, i) => (
                        <div key={item.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs text-slate-500">Testimonial #{i + 1}</span>
                                <button onClick={() => removeTestimonial(i)} className="text-red-400 hover:text-red-300"><XIcon className="w-4 h-4" /></button>
                            </div>
                            <textarea 
                                value={item.quote} 
                                onChange={e => updateTestimonial(i, 'quote', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                placeholder="Quote"
                                rows={2}
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <input 
                                    value={item.author} 
                                    onChange={e => updateTestimonial(i, 'author', e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                    placeholder="Author"
                                />
                                <input 
                                    value={item.role} 
                                    onChange={e => updateTestimonial(i, 'role', e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                    placeholder="Role"
                                />
                                <input 
                                    value={item.company} 
                                    onChange={e => updateTestimonial(i, 'company', e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                                    placeholder="Company"
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={addTestimonial} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition text-sm font-medium">
                        + Add Testimonial
                    </button>
                </div>
             </div>
        )}

        {/* CTA Editor */}
        {activeTab === 'cta' && (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <input 
                        type="checkbox" 
                        checked={config.landingPage.cta.visible} 
                        onChange={e => updateSection('cta', 'visible', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="text-white font-medium">Show Section</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                    <input 
                        value={config.landingPage.cta.title}
                        onChange={e => updateSection('cta', 'title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle</label>
                    <input 
                        value={config.landingPage.cta.subtitle}
                        onChange={e => updateSection('cta', 'subtitle', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Button Text</label>
                    <input 
                        value={config.landingPage.cta.buttonText}
                        onChange={e => updateSection('cta', 'buttonText', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default LandingPageManager;