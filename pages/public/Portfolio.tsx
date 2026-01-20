import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ServiceCategoryType, Project } from '../../types';

const Portfolio = () => {
  const [filter, setFilter] = useState<string>('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storageService.getProjects().then((data) => {
        setProjects(data);
        setLoading(false);
    });
  }, []);

  const categories = ['All', ...Object.values(ServiceCategoryType)];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Our Work</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            A curated selection of projects that showcase our passion for design, development, and growth.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat 
                  ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
             <div className="flex justify-center p-20">
                 <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : (
            <>
                <div className="grid md:grid-cols-2 gap-10">
                {filteredProjects.map(project => (
                    <Link to={`/portfolio/${project.id}`} key={project.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl block">
                    <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                        <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            View Project →
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                        <span className="text-xs font-bold uppercase px-3 py-1 bg-slate-800 text-indigo-300 rounded-full tracking-wider">
                            {project.category.split(' ')[0]}
                        </span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed line-clamp-2">{project.description}</p>
                        {project.client && (
                        <div className="flex items-center pt-6 border-t border-slate-800">
                            <span className="text-xs text-slate-500 uppercase tracking-widest mr-2">Client</span>
                            <span className="text-sm font-semibold text-slate-300">{project.client}</span>
                        </div>
                        )}
                    </div>
                    </Link>
                ))}
                </div>

                {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-slate-600 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                    No projects found in this category yet.
                </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Portfolio;