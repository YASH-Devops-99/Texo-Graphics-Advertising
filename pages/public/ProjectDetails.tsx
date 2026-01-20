import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { Project } from '../../types';
import { ChevronRightIcon } from '../../components/Icons';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        storageService.getProjectById(id).then(data => {
            setProject(data);
            setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!project) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
              <Link to="/portfolio" className="text-indigo-400 hover:text-indigo-300">Return to Portfolio</Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
        {/* Hero Image */}
        <div className="w-full h-[60vh] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10"></div>
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-80" />
            
            <div className="absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 max-w-7xl mx-auto">
                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                    {project.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{project.title}</h1>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
            <div className="grid md:grid-cols-3 gap-12">
                {/* Sidebar Info */}
                <div className="md:col-span-1 space-y-8 order-2 md:order-1">
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
                        <div className="mb-6">
                            <h3 className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-1">Client</h3>
                            <p className="text-xl text-white font-medium">{project.client || 'Confidential'}</p>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-1">Service</h3>
                            <p className="text-lg text-slate-300">{project.category}</p>
                        </div>
                        <Link to="/contact" className="w-full py-3 bg-white text-slate-950 font-bold rounded-lg text-center block hover:bg-indigo-50 transition shadow-lg">
                            Start Similar Project
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 order-1 md:order-2">
                    <div className="prose prose-invert prose-lg max-w-none mb-12">
                        <p className="text-xl text-slate-300 leading-relaxed font-light mb-8 border-l-4 border-indigo-500 pl-6">
                            {project.description}
                        </p>
                        
                        {/* Render Rich Details (Basic Paragraph splitting for now) */}
                        <div className="text-slate-400 space-y-6">
                            {(project.details || '').split('\n').map((line, i) => (
                                line.trim() ? <p key={i}>{line}</p> : <br key={i}/>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white">Project Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.gallery.map((imgUrl, index) => (
                                    <div key={index} className="rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition duration-300 group">
                                        <img 
                                            src={imgUrl} 
                                            alt={`Gallery ${index + 1}`} 
                                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Back Nav */}
            <div className="mt-20 pt-8 border-t border-slate-800 flex justify-between">
                <Link to="/portfolio" className="flex items-center text-slate-500 hover:text-white transition">
                    ← Back to Work
                </Link>
            </div>
        </div>
    </div>
  );
};

export default ProjectDetails;