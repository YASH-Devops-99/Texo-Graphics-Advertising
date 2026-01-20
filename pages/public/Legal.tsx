import { SiteConfig } from '../../types';

interface LegalProps {
  type: 'privacy' | 'terms' | 'refund';
  config?: SiteConfig;
}

const Legal = ({ type, config }: LegalProps) => {

  const contentMap = {
    privacy: config?.legal.privacyPolicy || '',
    terms: config?.legal.termsConditions || '',
    refund: config?.legal.refundPolicy || ''
  };

  const titleMap = {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    refund: "Refund Policy"
  };

  return (
    <div className="min-h-screen py-10 md:py-20 px-4">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 mb-6 backdrop-blur-md">
                Legal Documentation
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">{titleMap[type]}</h1>
            <p className="text-slate-400 text-lg">Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 md:p-16 shadow-2xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
           <div className="prose prose-invert prose-lg max-w-none text-slate-300">
             {/* Simple Markdown-like renderer */}
             {(contentMap[type] || 'No content available.').split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold text-white mt-12 mb-6 pb-4 border-b border-white/5">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold text-indigo-400 mt-8 mb-4">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('* ')) {
                    return <li key={i} className="ml-4 list-disc marker:text-indigo-500 mb-2 pl-2 text-slate-300">{line.replace('* ', '')}</li>;
                }
                if (line.trim() === '') {
                    return <br key={i}/>;
                }
                return <p key={i} className="mb-4 leading-relaxed font-light text-slate-300">{line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>;
             })}
           </div>
           
           <div className="mt-16 pt-8 border-t border-white/10 text-sm text-slate-500 text-center font-medium">
             For any legal inquiries, please contact our team at <span className="text-indigo-400">{config?.contact.email}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;