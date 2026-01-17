import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Globe, Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { AppContext, CategoryBackground } from '../shared';
import { api } from '../services/api';
import { ProductCategory } from '../types';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('signup') === 'true' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(email, password);
      context?.setUser(user);
      
      const redirectTo = searchParams.get('redirect');
      if (redirectTo === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.register(name, email, password);
      context?.setUser(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-3 md:px-6 py-6 md:py-12 overflow-x-hidden">
      <CategoryBackground category="Security" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center p-2.5 md:p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl text-white mb-5 md:mb-8 shadow-lg shadow-indigo-500/40">
            <ShoppingBag size={32} className="md:w-11 md:h-11" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-pink-300 bg-clip-text text-transparent mb-2 md:mb-3">
            {mode === 'login' ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-medium">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-indigo-500/20 p-5 md:p-8 mb-4 md:mb-6">
          {searchParams.get('redirect') === 'checkout' && (
            <div className="mb-5 md:mb-6 p-3 md:p-4 bg-green-50/10 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              Sign in to complete checkout
            </div>
          )}

          {error && (
            <div className="mb-5 md:mb-6 p-3 md:p-4 bg-red-50/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4 md:space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-slate-700/50 border border-indigo-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 ml-1 flex items-center gap-2">
                <Mail size={14} className="md:w-4 md:h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-700/50 border border-indigo-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 ml-1 flex items-center gap-2">
                <Lock size={14} className="md:w-4 md:h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-700/50 border border-indigo-500/30 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {loading && <Loader2 size={16} className="md:w-5 md:h-5 animate-spin" />}
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-gray-400 text-xs md:text-sm text-center">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 md:mt-12 flex flex-col items-center gap-3 md:gap-4 px-2">
          <div className="flex items-center justify-center gap-4 md:gap-6 text-gray-400">
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <ShieldCheck size={18} className="md:w-5 md:h-5 text-indigo-400" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Globe size={18} className="md:w-5 md:h-5 text-purple-400" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold">Verified</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              <div className="p-2 rounded-lg bg-pink-500/20">
                <ShoppingBag size={18} className="md:w-5 md:h-5 text-pink-400" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold">Trusted</span>
            </div>
          </div>
          <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">256-Bit SSL • PCI-DSS</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
