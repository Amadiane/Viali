// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";



import DashboardAdmin from "./components/Admin/DashboardAdmin";
import PartnerList from "./components/Partner/PartnerList";
import PartnerForm from "./components/Partner/PartnerForm";
// import Home from

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page publique */}
        {/* <Route path="/" element={<Home />} /> */}

        {/* Dashboard admin */}
        <Route path="/admin" element={<DashboardAdmin />}>
          <Route path="partners" element={<PartnerList />} />
          <Route path="partners/new" element={<PartnerForm />} />
          <Route path="partners/edit/:id" element={<PartnerForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
