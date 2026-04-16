import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DraftingCompass, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GoogleLoginButton from './GoogleLoginButton';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        if (data.user && data.session) {
          setSuccessMessage('Registration successful! Logging you in...');
        } else {
          setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      name: 'Guest Architect',
      email: 'guest@example.com',
      picture: 'https://ui-avatars.com/api/?name=Guest+Architect&background=001736&color=fff'
    };
    
    // Use the auth store to set the user
    const { setUser } = useAuthStore.getState();
    setUser(guestUser);
    
    // Also set a flag in localStorage to indicate guest mode
    localStorage.setItem('is_guest', 'true');
    
    // Force a reload or state update
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/20">
            <DraftingCompass size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Monolith Task</h1>
          <p className="text-on-surface-variant/60 font-medium">Architectural precision in every task.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 p-10 border border-outline-variant/10">
          <h2 className="text-2xl font-bold text-primary mb-8">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-4">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-primary font-medium focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-primary font-medium focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-primary font-medium focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-red-600 text-xs font-bold leading-relaxed">
                  {error.includes('identity-credentials-get') 
                    ? 'Google Login is restricted in this preview. Please use Email/Password or Guest Login.' 
                    : error}
                </p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-2xl mb-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-green-600 text-xs font-bold leading-relaxed">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors block w-full"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-outline-variant/10 flex-1"></div>
              <span className="text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-widest">OR</span>
              <div className="h-px bg-outline-variant/10 flex-1"></div>
            </div>

            <GoogleLoginButton />

            <button
              onClick={handleGuestLogin}
              className="w-full py-3 rounded-2xl border-2 border-surface-container-high text-on-surface-variant/60 text-sm font-bold hover:bg-surface-container-low transition-all"
            >
              Continue as Guest (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
