import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Lead, SiteConfig } from '../../types';

const Contact = ({ config }: { config?: SiteConfig }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceInterest: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newLead: Lead = {
      id: crypto.randomUUID(),
      ...formData,
      date: new Date().toISOString()
    };
    await storageService.addLead(newLead);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg p-10 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Message Received</h2>
          <p className="text-slate-400 mb-8 text-lg">Thanks for initiating contact. Our team will analyze your request and respond within 24 hours.</p>
          <button onClick={() => setSubmitted(false)} className="text-indigo-400 hover:text-indigo-300 font-medium uppercase tracking-wide text-sm">Send another message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Contact Info */}
        <div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">Let's build the extraordinary.</h1>
          <p className="text-slate-400 text-xl mb-12">
            Whether you need a brand revolution, a digital platform, or a growth engine, we are ready to deploy.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-indigo-500 border border-slate-800">
                 <span>✉️</span>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-white">Email Us</h3>
                <p className="text-slate-400">{config?.contact.email}</p>
              </div>
            </div>
            <div className="flex items-start">
               <div className="flex-shrink-0 mt-1 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-indigo-500 border border-slate-800">
                 <span>📍</span>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-white">Headquarters</h3>
                <p className="text-slate-400">{config?.contact.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg bg-slate-950 border-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border placeholder-slate-600 transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg bg-slate-950 border-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border placeholder-slate-600 transition"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="serviceInterest" className="block text-sm font-medium text-slate-300 mb-2">Objective</label>
              <select
                name="serviceInterest"
                value={formData.serviceInterest}
                onChange={handleChange}
                className="block w-full rounded-lg bg-slate-950 border-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border transition"
              >
                <option>General Inquiry</option>
                <option>Branding & Design</option>
                <option>Web Development</option>
                <option>SEO & Growth</option>
                <option>Video Production</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Project Details</label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-lg bg-slate-950 border-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border placeholder-slate-600 transition"
                placeholder="Tell us about your vision..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-4 rounded-lg font-bold hover:from-indigo-500 hover:to-indigo-400 transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Initiate Contact'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;