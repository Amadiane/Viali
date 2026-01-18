import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, ArrowRight, Sparkles } from 'lucide-react';
import CONFIG from '../../config/config.js';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.API_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('user', JSON.stringify({ username }));

        navigate('/dashboardAdmin');
      } else {
        setError(data.detail || "Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      console.log(err);
      setError("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && username && password) {
      handleLogin(e);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border-radius: 24px;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(145deg, #FFC727, #F77F00, #FFC727);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.5;
        }
        
        .shine-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 199, 39, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shine 3s ease-in-out infinite;
        }
        
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(255, 199, 39, 0.2);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-yellow-50/30 relative overflow-hidden flex items-center justify-center p-4">
        
        {/* Formes géométriques d'arrière-plan - Style VIALI */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grandes formes */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          
          {/* Formes géométriques - Inspirées du logo VIALI */}
          <div className="absolute top-20 left-20 w-32 h-32 border-l-4 border-t-4 border-yellow-400/20 transform rotate-45"></div>
          <div className="absolute bottom-40 right-40 w-40 h-40 border-r-4 border-b-4 border-orange-400/20 transform -rotate-12"></div>
          <svg className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10" viewBox="0 0 200 200">
            <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="url(#gradient1)" strokeWidth="2"/>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFC727" />
                <stop offset="100%" stopColor="#F77F00" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Grille subtile */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        {/* Carte de login principale */}
        <div className="relative w-full max-w-md animate-slide-up">
          
          {/* Glow effect externe */}
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 rounded-3xl blur-2xl"
               style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}></div>
          
          <div className="relative gradient-border backdrop-blur-xl shadow-2xl p-8 md:p-12">
            
            {/* Header avec logo */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                {/* Glow pulsant */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur-xl opacity-40"
                     style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}></div>
                
                {/* Icône principale */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#FFC727] to-[#F77F00] rounded-2xl 
                              flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/50
                              transform hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>

                {/* Badge "Admin" */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 
                              text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg
                              border-2 border-white">
                  ADMIN
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC727] via-[#F77F00] to-[#FFC727] bg-[length:200%_auto]">
                  Espace Administrateur
                </span>
              </h1>
              
              <p className="text-gray-600 text-sm font-medium flex items-center justify-center gap-2"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                <Lock className="w-4 h-4 text-orange-500" />
                Connexion sécurisée
              </p>

              {/* Ligne décorative */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-300"></div>
                <Sparkles className="w-4 h-4 text-orange-400" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-300"></div>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 animate-slide-up">
                <div className="relative bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-800 text-sm font-semibold">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Champ Username */}
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-bold flex items-center gap-2"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                  <User className="w-4 h-4 text-orange-500" />
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 
                                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 
                                  rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-16 pr-4 py-4 bg-white border-2 border-gray-200 
                               rounded-xl text-gray-800 placeholder-gray-400
                               focus:outline-none focus:border-orange-400 focus:bg-white
                               transition-all duration-300 font-medium input-glow"
                      placeholder="Entrez votre identifiant"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Champ Password */}
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-bold flex items-center gap-2"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Lock className="w-4 h-4 text-orange-500" />
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 
                                rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 
                                  rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-orange-600" />
                    </div>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="w-full pl-16 pr-14 py-4 bg-white border-2 border-gray-200 
                               rounded-xl text-gray-800 placeholder-gray-400
                               focus:outline-none focus:border-orange-400 focus:bg-white
                               transition-all duration-300 font-medium input-glow"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-4 p-2 hover:bg-orange-50 rounded-lg 
                               transition-all duration-300 group/eye"
                    >
                      {passwordVisible ? (
                        <EyeOff className="w-5 h-5 text-gray-400 group-hover/eye:text-orange-500 transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 group-hover/eye:text-orange-500 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-gray-300 text-orange-500 
                             focus:ring-2 focus:ring-orange-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                    Se souvenir de moi
                  </span>
                </label>
                
                <a 
                  href="/forgot-password" 
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 
                           transition-colors duration-300 flex items-center gap-1 group"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Mot de passe oublié ?
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="relative w-full group/btn overflow-hidden mt-8"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 
                              blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 shine-effect"></div>
                
                {/* Bouton principal */}
                <div className="relative flex items-center justify-center gap-3 py-4 
                              bg-gradient-to-r from-[#FFC727] to-[#F77F00] 
                              rounded-xl font-bold text-base shadow-2xl shadow-orange-500/30
                              group-hover/btn:shadow-orange-500/50
                              group-hover/btn:scale-[1.02] 
                              active:scale-[0.98]
                              transition-all duration-300 
                              disabled:opacity-50 disabled:cursor-not-allowed
                              disabled:hover:scale-100"
                     style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white tracking-wide">CONNEXION EN COURS...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                      <span className="text-white tracking-wide">SE CONNECTER</span>
                      <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Footer sécurisé */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                    SSL Sécurisé
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-700"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                    Chiffré AES-256
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs flottants */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
    </>
  );
};

export default Login;