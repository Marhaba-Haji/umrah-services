import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React, { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function usePWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setShowInstall(false));
    }
  };

  return { showInstall, promptInstall };
}

function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setUpdateAvailable(true);
              }
            };
          }
        };
      });
    }
  }, []);

  const reloadPage = () => window.location.reload();

  return { updateAvailable, reloadPage };
}

const InstallPrompt: React.FC<{ onInstall: () => void }> = ({ onInstall }) => (
  <div
    style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      background: "#fff",
      border: "1px solid #10b981",
      borderRadius: 8,
      padding: 16,
      zIndex: 1000,
      boxShadow: "0 2px 8px #0002",
    }}
  >
    <span style={{ color: "#10b981", fontWeight: "bold" }}>
      Install Marhaba Haji on your device!
    </span>
    <button
      style={{
        marginLeft: 16,
        background: "#10b981",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "6px 12px",
        cursor: "pointer",
      }}
      onClick={onInstall}
    >
      Install
    </button>
  </div>
);

const UpdatePrompt: React.FC<{ onReload: () => void }> = ({ onReload }) => (
  <div
    style={{
      position: "fixed",
      bottom: 70,
      right: 20,
      background: "#fff",
      border: "1px solid #f59e42",
      borderRadius: 8,
      padding: 16,
      zIndex: 1000,
      boxShadow: "0 2px 8px #0002",
    }}
  >
    <span style={{ color: "#f59e42", fontWeight: "bold" }}>
      A new version is available!
    </span>
    <button
      style={{
        marginLeft: 16,
        background: "#f59e42",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "6px 12px",
        cursor: "pointer",
      }}
      onClick={onReload}
    >
      Update
    </button>
  </div>
);

function PWAWrappers({ children }: { children: React.ReactNode }) {
  const { showInstall, promptInstall } = usePWAInstallPrompt();
  const { updateAvailable, reloadPage } = useServiceWorkerUpdate();
  return (
    <>
      {showInstall && <InstallPrompt onInstall={promptInstall} />}
      {updateAvailable && <UpdatePrompt onReload={reloadPage} />}
      {children}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <PWAWrappers>
    <App />
  </PWAWrappers>,
);
