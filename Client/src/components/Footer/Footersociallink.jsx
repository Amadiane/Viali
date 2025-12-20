import React from 'react';

const Footersociallink = () => {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-4 sm:mt-0">
      {/* Facebook */}
      <a 
        href="https://www.facebook.com/profile.php?id=100063491919629" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center text-gray-500 hover:text-blue-600 transition"
        aria-label="Visitez notre page Facebook"
      >
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
        <span className="ml-2">Facebook</span>
      </a>

      {/* Instagram */}
      <a 
        href="https://www.instagram.com/viali_gn?igsh=YjQ5dWphaTV5bHJ1&utm_source=qr" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center text-gray-500 hover:text-pink-500 transition"
        aria-label="Visitez notre page Instagram"
      >
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
        <span className="ml-2">Instagram</span>
      </a>

      {/* YouTube - Décommentez quand vous aurez le lien */}
      {/* <a 
        href="https://www.youtube.com/@viali" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center text-gray-500 hover:text-red-600 transition"
        aria-label="Visitez notre chaîne YouTube"
      >
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M10 7L15 12L10 17V7Z"></path>
          <path d="M0 5C0 3.89543 0.89543 3 2 3H22C23.1046 3 24 3.89543 24 5V19C24 20.1046 23.1046 21 22 21H2C0.89543 21 0 20.1046 0 19V5ZM2 5V19H22V5H2Z"></path>
        </svg>
        <span className="ml-2">YouTube</span>
      </a> */}
    </div>
  )
}

export default Footersociallink;