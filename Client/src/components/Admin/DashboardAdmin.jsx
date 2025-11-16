import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";

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
    // Occupe tout l'écran en position fixed - ignore complètement la sidebar
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Contenu centré avec décalage vers la droite pour compenser la sidebar */}
      <div className="text-center px-4 z-10 max-w-4xl ml-8 md:ml-10 lg:ml-36">
        {/* Logo Viali 3D avec effet lumineux */}
        <div className="relative inline-block mb-6">
          {/* Halo lumineux */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-40 blur-3xl rounded-full animate-pulse"></div>
          
          {/* Logo principal */}
          <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-400/60 transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-4xl md:text-5xl lg:text-6xl drop-shadow-2xl">V</span>
            
            {/* Effet de brillance */}
            <div className="absolute top-2 right-2 w-6 h-6 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          </div>

          {/* Étoiles décoratives */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FDB71A] animate-bounce" />
          <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-[#F47920] animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Titre principal avec dégradé Viali */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] mb-2 drop-shadow-lg animate-pulse">
            BIENVENUE
          </span>
          <span className="block text-gray-800 text-lg md:text-xl lg:text-2xl font-bold mb-2">
            sur le
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] drop-shadow-lg">
            DASHBOARD ADMIN
          </span>
        </h1>

        {/* Badge Viali avec effet glassmorphism */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] opacity-30 blur-xl rounded-xl animate-pulse"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border-3 border-[#F47920] rounded-xl px-6 md:px-8 py-2 md:py-3 inline-block shadow-2xl shadow-orange-400/50 transform hover:scale-105 transition-transform duration-300">
            <p className="text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] bg-clip-text text-transparent">
              VIALI ⚡
            </p>
          </div>
        </div>

        {/* Ligne de séparation animée */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-transparent via-[#FDB71A] to-[#F47920] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gradient-to-br from-[#FDB71A] to-[#E84E1B] rounded-full animate-bounce"></div>
          <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-[#F47920] via-[#E84E1B] to-transparent rounded-full animate-pulse"></div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm md:text-base lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-6">
          Gérez efficacement votre plateforme professionnelle depuis ce tableau de bord moderne et intuitif.
        </p>

        {/* Badges de statut avec effet glassmorphism */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <div className="bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-lg px-4 py-2 shadow-lg shadow-yellow-400/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FDB71A] rounded-full animate-pulse shadow-lg shadow-yellow-400"></div>
              <span className="text-[#F47920] font-bold text-sm md:text-base">En ligne</span>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md border-2 border-[#F47920] rounded-lg px-4 py-2 shadow-lg shadow-orange-400/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#F47920]" />
              <span className="text-[#E84E1B] font-bold text-sm md:text-base">Système Actif</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md border-2 border-[#E84E1B] rounded-lg px-4 py-2 shadow-lg shadow-red-400/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E84E1B]" />
              <span className="text-[#F47920] font-bold text-sm md:text-base">Opérationnel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement - positionné en bas au centre de l'écran */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-3 border-[#F47920] rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;