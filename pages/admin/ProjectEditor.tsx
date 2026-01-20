import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { Project, ServiceCategoryType } from '../../types';
import { XIcon } from '../../components/Icons';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  
  // Form State
  const [formData, setFormData] = useState<Project>({
    id: crypto.randomUUID(),
    title: '',
    category: ServiceCategoryType.CREATIVE,
    description: '',
    details: '',
    imageUrl: `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600`,
    gallery: [],
    client: ''
  });

  // State for Gallery Input
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (id) {
        storageService.getProjectById(id).then(data => {
            if (data) {
                setFormData(data);
            }
            setLoading(false);
        });
    }
  }, [id]);

  const handleSave = async () => {
    const projects = await storageService.getProjects();
    let newProjects;
    
    if (id) {
      newProjects = projects.map(p => p.id === id ? formData : p);
    } else {
      newProjects = [formData, ...projects];
    }
    
    await storageService.saveProjects(newProjects);
    navigate('/admin/portfolio');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = true) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { 
            alert("Warning: Large images may slow down the app. Try to use images under 2MB.");
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            if (isMain) {
                setFormData(prev => ({ ...prev, imageUrl: base64String }));
            } else {
                setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), base64String] }));
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const addGalleryUrl = () => {
      if (newGalleryUrl) {
          setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), newGalleryUrl] }));
          setNewGalleryUrl('');
      }
  };

  const removeGalleryImage = (index: number) => {
      setFormData(prev => ({ 
          ...prev, 
          gallery: (prev.gallery || []).filter((_, i) => i !== index) 
      }));
  };

  if (loading) return <div className="text-slate-400">Loading Project...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
       <div className="flex justify-between items-center mb-8">
        <div>
            <Link to="/admin/portfolio" className="text-slate-500 text-sm hover:text-slate-300 mb-2 block">← Back to Portfolio</Link>
            <h1 className="text-2xl font-bold text-white">{id ? 'Edit Project' : 'New Project'}</h1>
        </div>
        <div className="flex gap-3">
             <Link to="/admin/portfolio" className="px-4 py-2 text-slate-400 hover:text-white transition bg-slate-900 rounded-lg border border-slate-800">Cancel</Link>
             <button 
                onClick={handleSave} 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 font-medium"
            >
                Save Project
            </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-8 space-y-8">
          
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
                <input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none text-lg font-semibold"
                  placeholder="e.g. Neon Brand Refresh"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as ServiceCategoryType})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                >
                    {Object.values(ServiceCategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Client Name</label>
                <input 
                value={formData.client} 
                onChange={e => setFormData({...formData, client: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Client Name"
                />
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Short Summary (Visible on Project Card)</label>
            <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Brief summary..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-400 mb-2 uppercase tracking-wider">Detailed Case Study (Visible on Project Page)</label>
            <textarea 
                value={formData.details} 
                onChange={e => setFormData({...formData, details: e.target.value})}
                rows={12}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-indigo-500 focus:outline-none font-mono text-sm leading-relaxed"
                placeholder="Write the full case study here. Describe the challenge, the solution, and the results..."
            />
          </div>

          <hr className="border-slate-800" />

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Main Cover Image</label>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <input 
                        value={formData.imageUrl} 
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        placeholder="Image URL..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 rounded border border-slate-700 transition flex items-center justify-center font-medium">
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                    </label>
                </div>

                {formData.imageUrl && (
                    <div className="relative h-64 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group">
                        <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <span className="text-white font-bold">Cover Image</span>
                        </div>
                    </div>
                )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gallery Images</label>
            <div className="space-y-4">
                <div className="flex gap-2">
                    <input 
                        value={newGalleryUrl} 
                        onChange={e => setNewGalleryUrl(e.target.value)}
                        placeholder="Add Gallery Image URL..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                    <button 
                        onClick={addGalleryUrl}
                        className="bg-indigo-600/20 text-indigo-400 px-4 rounded border border-indigo-600/50 hover:bg-indigo-600 hover:text-white transition"
                    >
                        + Add
                    </button>
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 rounded border border-slate-700 transition flex items-center justify-center font-medium">
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                    </label>
                </div>

                {/* Gallery List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(formData.gallery || []).map((img, i) => (
                        <div key={i} className="relative aspect-square bg-slate-950 rounded-lg border border-slate-800 group overflow-hidden">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeGalleryImage(i)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-red-400"
                            >
                                <XIcon className="w-8 h-8"/>
                            </button>
                        </div>
                    ))}
                    {(formData.gallery || []).length === 0 && (
                        <div className="col-span-4 py-8 text-center text-slate-600 border border-dashed border-slate-800 rounded-lg">
                            No gallery images added yet.
                        </div>
                    )}
                </div>
            </div>
          </div>

      </div>
    </div>
  );
};

export default ProjectEditor;