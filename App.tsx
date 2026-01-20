
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { storageService, DEFAULT_CONFIG } from './services/storageService';
import { authService } from './services/authService';
import { SiteConfig } from './types';
import { 
  MenuIcon, 
  XIcon, 
  WhatsAppIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  TikTokIcon,
  GlobeIcon,
  LogOutIcon
} from './components/Icons';

// Lazy Load Pages for Performance
const Home = lazy(() => import('./pages/public/Home'));
const Portfolio = lazy(() => import('./pages/public/Portfolio'));
const ProjectDetails = lazy(() => import('./pages/public/ProjectDetails'));
const Legal = lazy(() => import('./pages/public/Legal'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Admin Pages (Lazy Load)
const Login = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminPortfolio = lazy(() => import('./pages/admin/PortfolioManager'));
const AdminProjectEditor = lazy(() => import('./pages/admin/ProjectEditor'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminLegal = lazy(() => import('./pages/admin/LegalManager'));
const LandingPageManager = lazy(() => import('./pages/admin/LandingPageManager'));

// --- Authentication Wrapper ---

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// --- Shared Layout Components ---

const PublicNavbar = ({ config }: { config: SiteConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Work' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled || isOpen 
            ? 'bg-slate-950/80 backdrop-blur-xl border-slate-800 py-4 shadow-lg' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                {config.logoUrl ? (
                    <img 
                      src={config.logoUrl} 
                      className="h-8 md:h-10 w-auto object-contain invert opacity-90 group-hover:opacity-100 transition-all duration-300" 
                      alt="Logo" 
                    />
                ) : (
                    <span className="text-2xl font-bold tracking-tight text-white">NEXUS</span>
                )}
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        location.pathname === link.path 
                        ? 'text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                      {link.label}
                  </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                {isOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 md:hidden flex items-center justify-center ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col items-center space-y-8">
            {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-3xl font-bold text-white hover:text-indigo-400 transition-colors"
                >
                    {link.label}
                </Link>
            ))}
          </div>
      </div>
    </>
  );
};

const PublicFooter = ({ config }: { config: SiteConfig }) => {
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase().trim();
    if (p.includes('facebook')) return FacebookIcon;
    if (p.includes('twitter') || p === 'x') return TwitterIcon;
    if (p.includes('instagram')) return InstagramIcon;
    if (p.includes('linkedin')) return LinkedInIcon;
    if (p.includes('youtube')) return YouTubeIcon;
    if (p.includes('tiktok')) return TikTokIcon;
    return GlobeIcon;
  };

  return (
    <footer className="relative bg-slate-950 pt-32 pb-12 overflow-hidden border-t border-slate-900">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{config.agencyName}</h3>
            <p className="text-slate-400 mb-8 max-w-sm text-lg leading-relaxed font-light">{config.tagline}</p>
            <div className="flex space-x-4">
              {Object.entries(config.socials).map(([key, url]) => {
                if (!url) return null;
                const Icon = getSocialIcon(key);
                return (
                  <a 
                    key={key} 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-600 transition-all duration-300 group"
                    title={key}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-8">Expertise</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-indigo-400 transition-colors cursor-pointer hover:translate-x-1 duration-200 inline-block">Creative Direction</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer hover:translate-x-1 duration-200 inline-block">Web Architecture</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer hover:translate-x-1 duration-200 inline-block">Growth Marketing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-8">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors hover:translate-x-1 duration-200 inline-block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors hover:translate-x-1 duration-200 inline-block">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-indigo-400 transition-colors hover:translate-x-1 duration-200 inline-block">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} {config.agencyName}. Crafted with intelligence.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Layout Wrappers ---

const PublicLayout = ({ children }: { children?: React.ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  
  useEffect(() => {
    storageService.getConfig().then(setConfig);
    const handleStorageChange = () => {
      storageService.getConfig().then(setConfig);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      {/* Global Background Elements */}
      <div className="bg-noise"></div>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <PublicNavbar config={config} />
      
      <main className="flex-grow pt-24 md:pt-32 relative z-10 animate-fade-in-up">
        <Suspense fallback={<div className="min-h-screen"></div>}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore - passing config to children
                    return React.cloneElement(child, { config });
                }
                return child;
            })}
        </Suspense>
      </main>
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/94769255921" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center border border-white/10 backdrop-blur-sm"
        aria-label="Contact on WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      <PublicFooter config={config} />
    </div>
  );
};

const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      <div className="bg-noise"></div>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-center h-20 border-b border-slate-800 bg-slate-900/50">
          <span className="text-xl font-bold tracking-tight text-white">NEXUS <span className="text-indigo-500 text-xs align-top">OS</span></span>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/admin" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition mb-1 text-sm font-medium">Dashboard</Link>
          <Link to="/admin/landing" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition mb-1 text-sm font-medium">Landing Page</Link>
          <Link to="/admin/portfolio" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition mb-1 text-sm font-medium">Portfolio</Link>
          <Link to="/admin/settings" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition mb-1 text-sm font-medium">Settings</Link>
          <Link to="/admin/legal" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition mb-1 text-sm font-medium">Legal Pages</Link>
          <div className="pt-8 mt-8 border-t border-slate-800 space-y-2">
             <Link to="/" className="block px-4 py-2 rounded text-slate-500 hover:text-white transition text-xs uppercase tracking-widest">← Return to Site</Link>
             <button onClick={() => authService.logout()} className="w-full text-left px-4 py-2 rounded text-red-400 hover:bg-red-500/10 transition text-sm font-medium flex items-center gap-2">
                <LogOutIcon className="w-4 h-4" /> Logout
             </button>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="bg-slate-900/50 backdrop-blur border-b border-slate-800 h-16 flex items-center justify-between px-6 md:hidden">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400">
            <MenuIcon />
          </button>
          <span className="font-semibold text-slate-200">Admin</span>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-10">
          <Suspense fallback={<div className="text-slate-500">Loading admin panel...</div>}>
             {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// --- App Component ---

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/portfolio/:id" element={<PublicLayout><ProjectDetails /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        
        {/* Separated Legal Pages */}
        <Route path="/privacy" element={<PublicLayout><Legal type="privacy" /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Legal type="terms" /></PublicLayout>} />
        <Route path="/refund" element={<PublicLayout><Legal type="refund" /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<RequireAuth><AdminLayout><AdminDashboard /></AdminLayout></RequireAuth>} />
        <Route path="/admin/landing" element={<RequireAuth><AdminLayout><LandingPageManager /></AdminLayout></RequireAuth>} />
        <Route path="/admin/portfolio" element={<RequireAuth><AdminLayout><AdminPortfolio /></AdminLayout></RequireAuth>} />
        <Route path="/admin/portfolio/new" element={<RequireAuth><AdminLayout><AdminProjectEditor /></AdminLayout></RequireAuth>} />
        <Route path="/admin/portfolio/edit/:id" element={<RequireAuth><AdminLayout><AdminProjectEditor /></AdminLayout></RequireAuth>} />
        
        <Route path="/admin/settings" element={<RequireAuth><AdminLayout><AdminSettings /></AdminLayout></RequireAuth>} />
        <Route path="/admin/legal" element={<RequireAuth><AdminLayout><AdminLegal /></AdminLayout></RequireAuth>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
