import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const DashboardAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    // Si pas de token → redirection vers login
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden w-full">
      {/* Effets de fond lumineux */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      {/* Contenu principal */}
      <main className="relative w-full h-screen flex items-center justify-center px-4 py-6">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-bounce">
              <Shield className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3">
              BIENVENUE
            </span>
            <span className="block text-white">sur le</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mt-3">
              DASHBOARD ADMIN
            </span>
          </h1>

          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-lg"></div>
            <p className="relative text-blue-300 text-lg md:text-xl lg:text-2xl font-bold bg-white/5 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl px-6 md:px-8 py-3 md:py-4 inline-block">
              Jorfof Basket Club 🏀
            </p>
          </div>

          <div className="w-32 md:w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-8 rounded-full animate-pulse"></div>

          <p className="text-gray-400 text-sm md:text-base lg:text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            Gérez efficacement votre club de basketball professionnel depuis ce tableau de bord.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
