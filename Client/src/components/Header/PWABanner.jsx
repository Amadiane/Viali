// ══════════════════════════════════════════════
// PWABanner.jsx — Bannière d'installation PWA
// Place dans src/components/PWABanner.jsx
// Importe dans App.jsx et utilise usePWA()
// ══════════════════════════════════════════════
import { useState } from "react";

const PWABanner = ({ onInstall, onDismiss, isOnline, swUpdated, onUpdate }) => {
  return (
    <>
      {/* ── Bannière hors ligne ── */}
      {!isOnline && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
          background: "#1f2937",
          color: "white",
          padding: "0.6rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "0.75rem",
          fontSize: "0.85rem", fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          <span>📡</span>
          <span>Vous êtes hors ligne — certaines données peuvent être obsolètes</span>
        </div>
      )}

      {/* ── Bannière mise à jour disponible ── */}
      {swUpdated && (
        <div style={{
          position: "fixed", bottom: "5rem", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9998,
          background: "#111",
          color: "white",
          padding: "0.875rem 1.5rem",
          borderRadius: "9999px",
          display: "flex", alignItems: "center", gap: "1rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.85rem",
          whiteSpace: "nowrap",
        }}>
          <span>🔄 Mise à jour disponible</span>
          <button onClick={onUpdate} style={{
            background: "#FF8C00", color: "white", border: "none",
            padding: "0.4rem 1rem", borderRadius: "9999px",
            fontWeight: 700, cursor: "pointer", fontSize: "0.8rem",
          }}>
            Mettre à jour
          </button>
        </div>
      )}

      {/* ── Bannière installation ── */}
      {onInstall && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 9997,
          background: "white",
          borderTop: "1px solid #f0f0f0",
          padding: "1rem 1.5rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {/* Logo + texte */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 44, height: 44,
              background: "linear-gradient(135deg, #FFC107, #FF8C00)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "1.3rem" }}>🐟</span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "#111", margin: 0 }}>
                Installer VIALI
              </p>
              <p style={{ fontSize: "0.75rem", color: "#666", margin: 0 }}>
                Accès rapide depuis votre écran d'accueil
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <button onClick={onDismiss} style={{
              padding: "0.5rem 1rem",
              border: "1px solid #e5e5e5",
              borderRadius: "9999px",
              background: "white",
              color: "#666",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}>
              Plus tard
            </button>
            <button onClick={onInstall} style={{
              padding: "0.5rem 1.25rem",
              background: "linear-gradient(135deg, #FFC107, #FF8C00)",
              border: "none",
              borderRadius: "9999px",
              color: "white",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}>
              Installer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWABanner;