import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Navlinks from "./Navlinks";
// import Loginbtn from "./Loginbtn";


const Header = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      setScrollWidth(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-white body-font fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* <Logo /> */}
        <Navlinks />
        {/* <LanguageSwitcher /> */}
        {/* <Loginbtn /> */}
      </div>

      {/* Barre de progression positionnée en bas du header */}
      <div
  className="absolute bottom-0 left-0 h-[10px] transition-all duration-150"
  style={{
    width: `${scrollWidth}%`,
    backgroundColor: "#142B57", // Bleu du footer de Tamkine
  }}
></div>

    </header>
  );
};

export default Header;


// import React, { useEffect, useState } from "react";
// import Logo from "./Logo";
// import Navlinks from "./Navlinks";

// const Header = () => {
//   const [scrollWidth, setScrollWidth] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//       const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
//       const scrollPercentage = (scrollTop / scrollHeight) * 100;
//       setScrollWidth(scrollPercentage);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className="bg-[#0a0e27] body-font fixed top-0 left-0 w-full z-50 shadow-2xl border-b-2 border-orange-500/30 overflow-hidden">
//       {/* Effets de fond lumineux */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-10 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute -top-10 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Grille de fond */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

//       <div className="container mx-auto relative flex flex-wrap p-5 flex-col md:flex-row items-center">
//         <Logo />
//         <Navlinks />
//       </div>

//       {/* Barre de progression avec effet néon - positionnée en bas du header */}
//       <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/40">
//         <div className="relative h-full overflow-hidden">
//           {/* Effet glow derrière la barre */}
//           <div
//             className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 blur-sm opacity-75 transition-all duration-300"
//             style={{ width: `${scrollWidth}%` }}
//           ></div>
//           {/* Barre principale */}
//           <div
//             className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 transition-all duration-300"
//             style={{ width: `${scrollWidth}%` }}
//           >
//             {/* Effet shine animé */}
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
//           </div>
//           {/* Points de progression */}
//           <div className="absolute top-1/2 left-0 w-full flex justify-between px-2 -translate-y-1/2 pointer-events-none">
//             {[0, 25, 50, 75, 100].map((point) => (
//               <div
//                 key={point}
//                 className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
//                   scrollWidth >= point
//                     ? 'bg-white shadow-lg shadow-orange-500/50 scale-125'
//                     : 'bg-gray-700 scale-100'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Particules décoratives */}
//       <div className="absolute top-4 left-20 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
//       <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

//       <style jsx>{`
//         @keyframes shine {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(400%);
//           }
//         }

//         .animate-shine {
//           animation: shine 3s ease-in-out infinite;
//         }
//       `}</style>
//     </header>
//   );
// };

// export default Header;