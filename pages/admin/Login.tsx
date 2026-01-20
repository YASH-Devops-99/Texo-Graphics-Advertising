
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { LockIcon } from '../../components/Icons';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authService.login(password)) {
      navigate('/admin');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="bg-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
                    <LockIcon className="w-8 h-8 text-indigo-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                <p className="text-slate-400 text-sm">Restricted area. Authorized personnel only.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition"
                        placeholder="••••••••"
                        autoFocus
                    />
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>
                
                <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                >
                    Authenticate
                </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-500">
                    Default Password for Demo: <span className="font-mono text-indigo-400">admin123</span>
                </p>
            </div>
        </div>
    </div>
  );
};

export default Login;
