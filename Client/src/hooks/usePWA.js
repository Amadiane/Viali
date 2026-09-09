// ══════════════════════════════════════════════
// usePWA.js — Hook React pour gérer la PWA
// Place ce fichier dans src/hooks/usePWA.js
// ══════════════════════════════════════════════
import { useState, useEffect } from "react";

const usePWA = () => {
  const [installPrompt, setInstallPrompt]   = useState(null);
  const [isInstalled, setIsInstalled]       = useState(false);
  const [isOnline, setIsOnline]             = useState(navigator.onLine);
  const [showBanner, setShowBanner]         = useState(false);
  const [swUpdated, setSwUpdated]           = useState(false);

  useEffect(() => {
    // ── Détecter si déjà installée ──
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // ── Écouter le prompt d'installation ──
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Afficher la bannière après 3 secondes
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // ── Détecter l'installation ──
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    });

    // ── Statut réseau ──
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);

    // ── Enregistrer le Service Worker ──
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker enregistré:", registration.scope);

          // Détecter une mise à jour disponible
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setSwUpdated(true);
              }
            });
          });
        })
        .catch((err) => console.error("[PWA] Erreur SW:", err));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ── Déclencher l'installation ──
  const installApp = async () => {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    if (result.outcome === "accepted") {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setInstallPrompt(null);
  };

  // ── Appliquer la mise à jour SW ──
  const updateApp = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage("skipWaiting");
      window.location.reload();
    }
  };

  return {
    installApp,
    updateApp,
    isInstalled,
    isOnline,
    showBanner,
    setShowBanner,
    swUpdated,
    canInstall: !!installPrompt,
  };
};

export default usePWA;