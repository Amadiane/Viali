// import { useEffect } from 'react';
// import { Shield, Users, Calendar, Trophy, BarChart3, Settings, Bell, Activity } from 'lucide-react';

// const DashboardAdmin = ({ navigate }) => {
    
//     useEffect(() => {
//         const accessToken = localStorage.getItem("access");
//         if (!accessToken && navigate) {
//             navigate("/login");
//         }
//     }, [navigate]);

//     const stats = [
//         { 
//             title: "Matchs Totaux", 
//             value: "24", 
//             icon: Calendar, 
//             color: "from-orange-500 to-orange-600",
//             glow: "orange-500",
//             change: "+12%"
//         },
//         { 
//             title: "Joueurs Actifs", 
//             value: "156", 
//             icon: Users, 
//             color: "from-blue-500 to-blue-600",
//             glow: "blue-500",
//             change: "+8%"
//         },
//         { 
//             title: "Trophées", 
//             value: "8", 
//             icon: Trophy, 
//             color: "from-purple-500 to-purple-600",
//             glow: "purple-500",
//             change: "+2"
//         },
//         { 
//             title: "Visiteurs", 
//             value: "3.2K", 
//             icon: Activity, 
//             color: "from-green-500 to-green-600",
//             glow: "green-500",
//             change: "+23%"
//         }
//     ];

//     const quickActions = [
//         { 
//             title: "Gérer les Matchs", 
//             description: "Créer, modifier et supprimer des matchs",
//             icon: Calendar,
//             color: "orange",
//             link: "/admin/matches"
//         },
//         { 
//             title: "Gérer les Joueurs", 
//             description: "Ajouter et gérer les joueurs du club",
//             icon: Users,
//             color: "blue",
//             link: "/admin/players"
//         },
//         { 
//             title: "Statistiques", 
//             description: "Voir les statistiques et analyses",
//             icon: BarChart3,
//             color: "purple",
//             link: "/admin/stats"
//         },
//         { 
//             title: "Paramètres", 
//             description: "Configurer le site et les options",
//             icon: Settings,
//             color: "green",
//             link: "/admin/settings"
//         }
//     ];

//     const recentActivities = [
//         { action: "Nouveau match ajouté", time: "Il y a 2h", type: "success" },
//         { action: "Joueur inscrit", time: "Il y a 3h", type: "info" },
//         { action: "Match modifié", time: "Il y a 5h", type: "warning" },
//         { action: "Résultat publié", time: "Il y a 1j", type: "success" }
//     ];

//     return (
//         <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden w-full">
//             {/* Effets de fond lumineux */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
//                 <div className="absolute top-1/3 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-0 left-1/2 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
//             </div>

//             {/* Grille de fond */}
//             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

//             {/* Contenu principal - Parfaitement centré */}
//             <main className="relative w-full px-4 py-6 md:px-6 lg:px-8 md:py-8 lg:py-12">
//                 <div className="w-full max-w-6xl mx-auto">
//                     {/* Header */}
//                     <div className="text-center mb-8 md:mb-12">
//                         <div className="relative inline-block mb-4 md:mb-6">
//                             <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full animate-pulse"></div>
//                             <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 mx-auto">
//                                 <Shield className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
//                             </div>
//                         </div>
//                         <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-2 md:mb-3 tracking-tight px-4">
//                             DASHBOARD ADMIN
//                         </h1>
//                         <p className="text-blue-300 text-sm md:text-base lg:text-lg font-semibold px-4">
//                             Centre de contrôle - Jorfof Basket Club
//                         </p>
//                         <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-3 md:mt-4 rounded-full"></div>
//                     </div>

//                     {/* Statistiques */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
//                         {stats.map((stat, idx) => {
//                             const Icon = stat.icon;
//                             return (
//                                 <div key={idx} className="relative group">
//                                     <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
//                                     <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border-2 border-white/10 hover:border-orange-500/30 transition-all duration-300">
//                                         <div className="flex items-start justify-between mb-3 md:mb-4">
//                                             <div className="relative">
//                                                 <div className={`absolute inset-0 bg-${stat.glow}/30 blur-xl rounded-lg`}></div>
//                                                 <div className={`relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-xl`}>
//                                                     <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                                                 </div>
//                                             </div>
//                                             <span className="text-green-400 text-xs md:text-sm font-bold bg-green-500/20 px-2 py-1 rounded-lg">
//                                                 {stat.change}
//                                             </span>
//                                         </div>
//                                         <h3 className="text-gray-400 text-xs md:text-sm font-semibold mb-2 text-center">
//                                             {stat.title}
//                                         </h3>
//                                         <p className="text-2xl md:text-3xl font-black text-white text-center">
//                                             {stat.value}
//                                         </p>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     {/* Actions rapides */}
//                     <div className="relative mb-6 md:mb-8">
//                         <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl md:rounded-3xl blur opacity-20"></div>
//                         <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border-2 border-blue-500/30">
//                             <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
//                                 <div className="relative">
//                                     <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-lg"></div>
//                                     <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-xl">
//                                         <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                                     </div>
//                                 </div>
//                                 <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white text-center">
//                                     ACTIONS RAPIDES
//                                 </h2>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//                                 {quickActions.map((action, idx) => {
//                                     const Icon = action.icon;
//                                     const colorMap = {
//                                         orange: { gradient: "from-orange-500 to-orange-600", glow: "orange-500" },
//                                         blue: { gradient: "from-blue-500 to-blue-600", glow: "blue-500" },
//                                         purple: { gradient: "from-purple-500 to-purple-600", glow: "purple-500" },
//                                         green: { gradient: "from-green-500 to-green-600", glow: "green-500" }
//                                     };
//                                     const colors = colorMap[action.color];

//                                     return (
//                                         <a
//                                             key={idx}
//                                             href={action.link}
//                                             className="relative group/action block"
//                                         >
//                                             <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-xl md:rounded-2xl blur opacity-0 group-hover/action:opacity-40 transition duration-300`}></div>
//                                             <div className="relative bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 border-2 border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02]">
//                                                 <div className="flex flex-col items-center text-center gap-3 md:gap-4">
//                                                     <div className="relative">
//                                                         <div className={`absolute inset-0 bg-${colors.glow}/20 blur-lg rounded-xl`}></div>
//                                                         <div className={`relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-xl`}>
//                                                             <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex-1">
//                                                         <h3 className="text-white font-bold text-base md:text-lg mb-1">
//                                                             {action.title}
//                                                         </h3>
//                                                         <p className="text-gray-400 text-xs md:text-sm">
//                                                             {action.description}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </a>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Activités récentes */}
//                     <div className="relative">
//                         <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl md:rounded-3xl blur opacity-20"></div>
//                         <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 border-2 border-purple-500/30">
//                             <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
//                                 <div className="relative">
//                                     <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-lg"></div>
//                                     <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-xl">
//                                         <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                                     </div>
//                                 </div>
//                                 <h2 className="text-lg md:text-xl lg:text-2xl font-black text-white text-center">
//                                     ACTIVITÉS RÉCENTES
//                                 </h2>
//                             </div>

//                             <div className="space-y-2 md:space-y-3">
//                                 {recentActivities.map((activity, idx) => {
//                                     const typeColors = {
//                                         success: "from-green-500/20 to-green-600/20 border-green-500/30",
//                                         info: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
//                                         warning: "from-orange-500/20 to-orange-600/20 border-orange-500/30"
//                                     };

//                                     return (
//                                         <div
//                                             key={idx}
//                                             className={`bg-gradient-to-r ${typeColors[activity.type]} backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border-2 hover:scale-[1.02] transition-all duration-300`}
//                                         >
//                                             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-center sm:text-left">
//                                                 <span className="text-white font-semibold text-sm md:text-base w-full sm:w-auto">
//                                                     {activity.action}
//                                                 </span>
//                                                 <span className="text-gray-400 text-xs md:text-sm w-full sm:w-auto">
//                                                     {activity.time}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default DashboardAdmin;

import { useEffect } from 'react';
import { Shield } from 'lucide-react';

const DashboardAdmin = ({ navigate }) => {
    
    useEffect(() => {
        const accessToken = localStorage.getItem("access");
        if (!accessToken && navigate) {
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
                    {/* Icône animée */}
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full animate-pulse"></div>
                        <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-bounce">
                            <Shield className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-white" />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3">
                            BIENVENUE
                        </span>
                        <span className="block text-white">
                            sur le
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mt-3">
                            DASHBOARD ADMIN
                        </span>
                    </h1>

                    {/* Sous-titre */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-lg"></div>
                        <p className="relative text-blue-300 text-lg md:text-xl lg:text-2xl font-bold bg-white/5 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl px-6 md:px-8 py-3 md:py-4 inline-block">
                            Jorfof Basket Club 🏀
                        </p>
                    </div>

                    {/* Ligne décorative */}
                    <div className="w-32 md:w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-8 rounded-full animate-pulse"></div>

                    {/* Message d'accueil */}
                    <p className="text-gray-400 text-sm md:text-base lg:text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
                        Gérez efficacement votre club de basketball professionnel depuis ce tableau de bord.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DashboardAdmin;