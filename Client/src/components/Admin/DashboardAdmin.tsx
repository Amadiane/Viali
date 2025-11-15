// import React, { useState } from "react";
// import NavbarAdmin from "../Nav/NavbarAdmin";
// import PartnerList from "../Partner/PartnerList";
// import PartnerForm from "../Partner/PartnerForm";

// const DashboardAdmin: React.FC = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [refreshList, setRefreshList] = useState(false);

//   // Callback après création / modification pour rafraîchir la liste
//   const handleSuccess = () => {
//     setRefreshList(prev => !prev); // toggle pour forcer PartnerList à se re-render
//     setShowForm(false); // cacher le form après succès
//   };

//   return (
//     <div className="dashboard-admin">
//       <NavbarAdmin />

//       <div className="dashboard-content">
//         <h1>Dashboard Admin</h1>

//         {/* Bouton toggle pour afficher / cacher le form */}
//         <button onClick={() => setShowForm(prev => !prev)}>
//           {showForm ? "Annuler" : "Ajouter un Partner"}
//         </button>

//         {/* Formulaire collapsible */}
//         {showForm && <PartnerForm onSuccess={handleSuccess} />}

//         {/* Liste des partenaires */}
//         <PartnerList key={refreshList ? "r1" : "r2"} /> 
//         {/* key toggle pour forcer re-render quand refreshList change */}
//       </div>
//     </div>
//   );
// };

// export default DashboardAdmin;


import React, { useState } from "react";
import { Menu, X, Home, Users, Settings, BarChart3, Package, FileText, Bell, Search, ChevronDown, Plus, TrendingUp, Activity, DollarSign, ShoppingCart } from "lucide-react";

const DashboardAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "partners", icon: Users, label: "Partenaires" },
    { id: "products", icon: Package, label: "Produits" },
    { id: "orders", icon: ShoppingCart, label: "Commandes" },
    { id: "analytics", icon: BarChart3, label: "Analytiques" },
    { id: "reports", icon: FileText, label: "Rapports" },
    { id: "settings", icon: Settings, label: "Paramètres" },
  ];

  const stats = [
    { label: "Revenus Total", value: "245,850 DH", change: "+12.5%", icon: DollarSign, color: "bg-gradient-to-br from-orange-400 to-orange-600" },
    { label: "Partenaires Actifs", value: "156", change: "+8.2%", icon: Users, color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
    { label: "Commandes", value: "1,429", change: "+15.3%", icon: ShoppingCart, color: "bg-gradient-to-br from-orange-500 to-red-500" },
    { label: "Taux de Croissance", value: "23.5%", change: "+4.1%", icon: TrendingUp, color: "bg-gradient-to-br from-amber-400 to-orange-600" },
  ];

  const recentActivities = [
    { action: "Nouveau partenaire ajouté", user: "Admin", time: "Il y a 5 min", type: "success" },
    { action: "Commande #4521 traitée", user: "Système", time: "Il y a 12 min", type: "info" },
    { action: "Rapport mensuel généré", user: "Admin", time: "Il y a 1h", type: "warning" },
    { action: "Mise à jour produit #234", user: "Manager", time: "Il y a 2h", type: "info" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                V
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                VIALI
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                {sidebarOpen && (
                  <span className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-gray-400">admin@viali.com</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30">
                <Plus size={18} />
                <span className="font-medium">Nouveau</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                            <Icon size={24} className="text-white" />
                          </div>
                          <span className="text-green-600 text-sm font-semibold flex items-center">
                            <TrendingUp size={16} className="mr-1" />
                            {stat.change}
                          </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts & Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Aperçu des Revenus</h2>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>7 derniers jours</option>
                      <option>30 derniers jours</option>
                      <option>12 derniers mois</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-around space-x-2">
                    {[65, 78, 90, 81, 56, 85, 95].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg hover:from-orange-600 hover:to-orange-500 transition-all cursor-pointer"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">J{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Activités Récentes</h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "success" ? "bg-green-500" :
                          activity.type === "warning" ? "bg-yellow-500" :
                          "bg-blue-500"
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "partners" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Gestion des Partenaires</h2>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                  >
                    {showForm ? "Annuler" : "Ajouter un Partenaire"}
                  </button>
                </div>
                {showForm && (
                  <div className="mb-6 p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-gray-700">Formulaire de partenaire ici (PartnerForm component)</p>
                  </div>
                )}
                <div className="text-gray-700">
                  <p>Liste des partenaires ici (PartnerList component)</p>
                </div>
              </div>
            </div>
          )}

          {activeSection !== "dashboard" && activeSection !== "partners" && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="text-center">
                <Activity size={48} className="mx-auto text-orange-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Section {menuItems.find(item => item.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600">Cette section est en cours de développement</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;