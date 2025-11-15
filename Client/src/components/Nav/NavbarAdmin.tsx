import React from "react";

const NavbarAdmin: React.FC = () => {
  return (
    <nav className="navbar-admin">
      <ul>
        <li>Dashboard</li>
        <li>Partners</li>
        {/* tu peux ajouter d'autres liens si nécessaire */}
      </ul>
    </nav>
  );
};

export default NavbarAdmin;
