import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import CONFIG from '../../config/config.js';
import Logo from '../../assets/logo.png';


// 🎨 Centralisation des couleurs VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
};

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Effets de fond décoratifs - réduits */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-[#E84E1B]/20 to-[#FDB71A]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Carte de login - compacte */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl blur opacity-40"></div>
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-orange-200 p-8 md:p-10">
          {/* Logo et Header - compact */}
          <div className="text-center mb-6">
            <img src={Logo} alt="Logo VIALI" className="w-32 h-36 mx-auto mb-4" />
            {/* <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#F47920] blur-xl opacity-40"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-full flex items-center justify-center mx-auto shadow-xl shadow-orange-400/50">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div> */}
            
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] mb-1 tracking-tight">
              ADMIN ACCESS
            </h1>
            <p className="text-gray-600 text-xs font-bold">Espace réservé aux administrateurs</p>
          </div>

          {/* Message d'erreur - compact */}
          {error && (
            <div className="mb-4 relative">
              <div className="relative bg-red-50 border border-red-200 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-xs font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire - compact */}
          <div className="space-y-4">
            {/* Champ Username */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-xs font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F47920]" />
                Nom d'utilisateur
              </label>
              <div className="relative group">
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-9 h-9 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-lg flex items-center justify-center shadow-md z-10">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-14 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:bg-orange-50/30 transition-all duration-300 font-semibold"
                    placeholder="Entrez votre username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            </div>

            {/* Champ Password */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F47920]" />
                Mot de passe
              </label>
              <div className="relative group">
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-9 h-9 bg-gradient-to-br from-[#F47920] to-[#E84E1B] rounded-lg flex items-center justify-center shadow-md z-10">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="w-full pl-14 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:bg-orange-50/30 transition-all duration-300 font-semibold"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 p-1.5 hover:bg-orange-100 rounded-lg transition-all duration-300 z-10"
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-4 h-4 text-[#F47920]" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a 
                href="/forgot-password" 
                className="text-xs text-[#F47920] hover:text-[#E84E1B] font-bold transition-colors duration-300 flex items-center gap-1 group"
              >
                Mot de passe oublié ?
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>

            {/* Bouton de connexion */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || !username || !password}
              className="relative w-full group overflow-hidden mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-xl font-black text-base shadow-xl shadow-orange-400/50 border-2 border-orange-300 group-hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white">CONNEXION...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white">SE CONNECTER</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Badge sécurisé - compact */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-1.5 text-gray-600 text-xs">
              <Lock className="w-3.5 h-3.5 text-green-500" />
              <span className="font-bold">Connexion sécurisée SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Particules décoratives - réduites */}
      <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-[#FDB71A] rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#F47920] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-[#E84E1B] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 right-10 w-2 h-2 bg-[#FDB71A] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};

export default Login;