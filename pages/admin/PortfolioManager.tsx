import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { Project } from '../../types';

const AdminPortfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await storageService.getProjects();
    setProjects(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const newProjects = projects.filter(p => p.id !== id);
      setProjects(newProjects);
      await storageService.saveProjects(newProjects);
    }
  };

  if (loading) return <div className="text-slate-400">Loading Portfolio...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Portfolio Manager</h1>
        <Link 
          to="/admin/portfolio/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 font-medium"
        >
          + Add Project
        </Link>
      </div>

      <div className="bg-slate-900 rounded-lg shadow-sm border border-slate-800 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Project</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            {projects.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No projects found. Click "Add Project" to start building your portfolio.
                    </td>
                </tr>
            ) : projects.map(project => (
              <tr key={project.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-16 flex-shrink-0 bg-slate-800 rounded overflow-hidden">
                      <img className="h-full w-full object-cover" src={project.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{project.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                    {project.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {project.client || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/portfolio/edit/${project.id}`} className="text-indigo-400 hover:text-indigo-300 mr-4 font-bold">Edit</Link>
                  <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPortfolio;