import React from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ServiceCategoryType, SiteConfig } from '../../types';
import { PaintBrushIcon, BriefcaseIcon, DocumentTextIcon, ChevronRightIcon, ArrowPathIcon, SparklesIcon, GlobeIcon } from '../../components/Icons';

const Home = ({ config }: { config?: SiteConfig }) => {
  const lp = config?.landingPage || {
    hero: { badge: '', headline: '', subheadline: '', ctaPrimary: '', ctaSecondary: '' },
    trust: { visible: false, title: '', logos: [] },
    features: { visible: false, title: '', subtitle: '', items: [] },
    caseStudy: { visible: false, badge: '', title: '', description: '', statValue: '', statLabel: '', ctaText: '' },
    testimonials: { visible: false, title: '', subtitle: '', items: [] },
    cta: { visible: false, title: '', subtitle: '', buttonText: '' }
  };
  const services = storageService.getServices();

  const categories = [
    { type: ServiceCategoryType.CREATIVE, icon: <PaintBrushIcon className="w-8 h-8 text-purple-400" />, desc: "Visual storytelling that stops the scroll." },
    { type: ServiceCategoryType.DEVELOPMENT, icon: <BriefcaseIcon className="w-8 h-8 text-cyan-400" />, desc: "Engineering the future of your platform." },
    { type: ServiceCategoryType.GROWTH, icon: <DocumentTextIcon className="w-8 h-8 text-emerald-400" />, desc: "Data-driven strategies for rapid scaling." },
  ];

  // Helper to get distinct icons for the feature section based on index
  const getFeatureIcon = (index: number) => {
      switch(index) {
          case 0: return <SparklesIcon className="w-8 h-8" />;
          case 1: return <ArrowPathIcon className="w-8 h-8" />;
          case 2: return <GlobeIcon className="w-8 h-8" />; // Using Globe as proxy for Partnership/Growth
          default: return <BriefcaseIcon className="w-8 h-8" />;
      }
  };

  const getFeatureColor = (index: number) => {
      switch(index) {
          case 0: return "text-purple-400 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]";
          case 1: return "text-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]";
          case 2: return "text-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(52,211,153,0.15)]";
          default: return "text-indigo-400 bg-indigo-500/10";
      }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-float"></div>
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {lp.hero?.badge && (
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 text-sm font-medium mb-10 backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                <span className="flex h-2 w-2 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                {lp.hero.badge}
            </div>
          )}
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
            <span className="block">{lp.hero?.headline}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 pb-2">
               {config?.tagline}
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 leading-relaxed font-light">
            {lp.hero?.subheadline}
          </p>
          
          <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact" className="group relative px-10 py-5 rounded-full bg-white text-slate-950 font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] text-lg overflow-hidden">
              <span className="relative z-10">{lp.hero?.ctaPrimary || 'Start'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out"></div>
            </Link>
            <Link to="/portfolio" className="px-10 py-5 rounded-full bg-slate-900/50 text-white font-bold border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all backdrop-blur-md text-lg">
              {lp.hero?.ctaSecondary || 'Explore'}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      {lp.trust?.visible && (
        <section className="border-y border-white/5 bg-slate-900/30 py-16 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-10">{lp.trust.title}</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                {lp.trust.logos.map((logo, idx) => (
                    <div key={idx} className="h-10 md:h-12 w-32 relative flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110">
                       {typeof logo === 'string' ? (
                          <span className="text-xl font-bold text-white tracking-widest font-serif uppercase">{logo}</span>
                       ) : (
                          <img 
                            src={logo.url} 
                            alt={logo.name} 
                            className="h-full w-full object-contain"
                            title={logo.name}
                          />
                       )}
                    </div>
                ))}
            </div>
            </div>
        </section>
      )}

      {/* Services Grid (Bento Style) */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Expertise</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Holistic digital services tailored to elevate your market position.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div key={cat.type} className="group p-10 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-500 relative overflow-hidden backdrop-blur-sm hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                   {React.cloneElement(cat.icon as React.ReactElement<{ className?: string }>, { className: "w-40 h-40 text-white" })}
                </div>
                
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 border border-slate-700 shadow-lg">
                  {cat.icon}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">{cat.type}</h3>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">{cat.desc}</p>
                
                <ul className="space-y-6 relative z-10">
                  {services.filter(s => s.category === cat.type).map(service => (
                    <li key={service.id} className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-3 shadow-[0_0_10px_rgba(99,102,241,0.8)] flex-shrink-0"></span>
                       <div>
                         <span className="block text-white font-bold text-lg mb-1">{service.title}</span>
                         <span className="block text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">{service.description}</span>
                       </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (Why Partner With Us) */}
      {lp.features?.visible && (
          <section className="py-32 bg-slate-950 relative overflow-hidden border-t border-slate-900">
             <div className="absolute inset-0 bg-indigo-950/10 skew-y-3 transform origin-bottom-left pointer-events-none"></div>
             {/* Gradient Orb */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none"></div>
             
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{lp.features.title}</h2>
                      <p className="text-xl text-slate-400 font-light">{lp.features.subtitle}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                      {lp.features.items?.map((feature, idx) => (
                          <div key={feature.id} className="group p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:bg-slate-900/80 hover:-translate-y-2 hover:shadow-2xl">
                              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform duration-500 group-hover:scale-110 ${getFeatureColor(idx)}`}>
                                  {getFeatureIcon(idx)}
                              </div>
                              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-200 transition-colors">{feature.title}</h3>
                              <p className="text-slate-400 leading-relaxed text-lg">{feature.description}</p>
                          </div>
                      )) || null}
                  </div>
              </div>
          </section>
      )}

      {/* Featured Case Study */}
      {lp.caseStudy?.visible && (
        <section className="py-32 px-4">
            <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-900/40 to-slate-900/80 rounded-[3rem] border border-white/10 overflow-hidden relative backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
            
            <div className="grid md:grid-cols-2 gap-16 p-12 md:p-24 items-center">
                <div>
                <div className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-500/30">
                    {lp.caseStudy.badge}
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">{lp.caseStudy.title}</h2>
                <p className="text-slate-300 text-xl mb-10 leading-relaxed font-light">
                    {lp.caseStudy.description}
                </p>
                <Link to="/portfolio" className="inline-flex items-center text-white font-bold text-lg hover:text-indigo-400 transition-colors group">
                    {lp.caseStudy.ctaText} 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform"><ChevronRightIcon className="w-6 h-6"/></span>
                </Link>
                </div>
                <div className="relative">
                <div className="bg-slate-950/80 rounded-2xl border border-slate-700/50 p-10 shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500 backdrop-blur-xl">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">{lp.caseStudy.statLabel}</div>
                            <div className="text-5xl font-bold text-white tracking-tight">{lp.caseStudy.statValue}</div>
                        </div>
                        <div className="text-emerald-400 font-mono text-sm font-bold flex items-center bg-emerald-500/10 px-3 py-1 rounded-full">
                            +124% <span className="ml-1">▲</span>
                        </div>
                    </div>
                    {/* Fake Graph */}
                    <div className="h-40 flex items-end gap-3">
                        {[40, 65, 45, 70, 85, 60, 95].map((h, i) => (
                            <div key={i} style={{height: `${h}%`}} className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"></div>
                        ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
      )}

      {/* Testimonials */}
      {lp.testimonials?.visible && (
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white text-center mb-6">{lp.testimonials.title}</h2>
            <p className="text-center text-slate-400 mb-20 text-lg">{lp.testimonials.subtitle}</p>
            <div className="grid md:grid-cols-2 gap-10">
            {lp.testimonials.items?.map((item) => (
                <div key={item.id} className="bg-gradient-to-b from-slate-900 to-slate-950 p-12 rounded-[2rem] border border-white/5 relative group hover:border-indigo-500/30 transition-colors">
                    <div className="text-8xl text-indigo-900/50 absolute top-4 left-8 font-serif select-none">"</div>
                    <p className="text-slate-200 text-xl relative z-10 mb-10 pt-4 font-light leading-relaxed">"{item.quote}"</p>
                    <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-5 text-2xl shadow-lg">
                        {item.author.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-white text-lg">{item.author}</div>
                        <div className="text-sm text-indigo-400">{item.role}, {item.company}</div>
                    </div>
                    </div>
                </div>
            )) || null}
            </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      {lp.cta?.visible && (
          <section className="py-40 px-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-600/5 z-0"></div>
              <div className="max-w-4xl mx-auto relative z-10">
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">{lp.cta.title}</h2>
                  <p className="text-2xl text-slate-400 mb-12 font-light">{lp.cta.subtitle}</p>
                  <Link to="/contact" className="px-14 py-6 rounded-full bg-white text-slate-950 font-bold hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] transform duration-300 inline-block text-xl">
                      {lp.cta.buttonText}
                  </Link>
              </div>
          </section>
      )}
    </div>
  );
};

export default Home;