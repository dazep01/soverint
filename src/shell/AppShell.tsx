import { useEffect, useRef, useState, ReactNode } from "react";
import * as anime_lib from 'animejs';

// ================================================
// SOLUSI FIXED: Penanganan animejs yang lebih robust
// ================================================

// Debug: Lihat struktur animejs yang diimpor
console.log("[Audit] Struktur anime_lib:", anime_lib);

// Fungsi untuk mendapatkan anime yang benar
const getAnime = () => {
  // Cek semua kemungkinan ekspor
  if (typeof anime_lib === 'function') {
    console.log("[Audit] Menggunakan anime_lib langsung sebagai fungsi");
    return anime_lib;
  }
  
  if ((anime_lib as any).default && typeof (anime_lib as any).default === 'function') {
    console.log("[Audit] Menggunakan anime_lib.default");
    return (anime_lib as any).default;
  }
  
  if ((anime_lib as any).anime && typeof (anime_lib as any).anime === 'function') {
    console.log("[Audit] Menggunakan anime_lib.anime");
    return (anime_lib as any).anime;
  }
  
  // Fallback: coba window.anime jika ada (untuk CDN)
  if (typeof window !== 'undefined' && (window as any).anime) {
    console.log("[Audit] Menggunakan window.anime");
    return (window as any).anime;
  }
  
  console.error("[Audit] AnimeJS tidak bisa di-load!");
  return null;
};

const anime = getAnime();

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(1); // Default: Command Center

  // --- EFFECT 1: Menangani Animasi & Update UI Navigasi ---
  useEffect(() => {
    const track = trackRef.current;

    // AUDIT: Cek apakah state berubah
    console.log(`[Audit] State ActiveIndex: ${activeIndex}`);

    if (!track) {
      console.error("[Audit] Error: trackRef.current tidak ditemukan di DOM!");
      return;
    }

    // AUDIT: Verifikasi anime adalah fungsi sebelum digunakan
    if (!anime || typeof anime !== 'function') {
      console.warn("[Audit] Anime tidak tersedia, menggunakan CSS transition fallback");
      track.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      
      // Update class active
      updateActiveClass(activeIndex);
      return;
    }

    // AUDIT: Jalankan Animasi dengan animejs
    console.log(`[Audit] Animating track to: -${activeIndex * 100}%`);
    try {
      anime({
        targets: track,
        translateX: `-${activeIndex * 100}%`,
        duration: 600,
        easing: "cubicBezier(0.2, 0.8, 0.2, 1)",
        complete: () => console.log("[Audit] Animasi perpindahan selesai.")
      });
    } catch (error) {
      console.error("[Audit] Error saat animasi:", error);
      // Fallback ke CSS
      track.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
    }

    // Update class active
    updateActiveClass(activeIndex);
  }, [activeIndex]);

  // Fungsi helper untuk update class active
  const updateActiveClass = (index: number) => {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach((btn) => btn.classList.remove("active"));

    const panelIds = ['panel-magnify', 'panel-misi', 'panel-agents', 'panel-gear'];
    const targetPanelId = panelIds[index];

    if (targetPanelId) {
      const activeBtn = document.querySelector(
        `.nav-btn[data-target="${targetPanelId}"]`
      ) as HTMLElement;

      if (activeBtn) {
        activeBtn.classList.add("active");
        console.log(`[Audit] Nav UI Berhasil Update: ${targetPanelId}`);
      } else {
        console.warn(`[Audit] Warning: Tombol untuk ${targetPanelId} tidak ditemukan.`);
      }
    }
  };

  // --- HANDLER: Klik Navigasi ---
  const handleNavClick = (targetId: string) => {
    console.log(`[Audit] User Click: ${targetId}`);
    const panelIds = ['panel-magnify', 'panel-misi', 'panel-agents', 'panel-gear'];
    const index = panelIds.indexOf(targetId);

    if (index !== -1) {
      setActiveIndex(index);
    } else {
      console.error(`[Audit] Error: ID "${targetId}" tidak terdaftar di panelIds!`);
    }
  };

  // --- EFFECT 2: Menangani Resize Window ---
  useEffect(() => {
    const handleResize = () => {
      const track = trackRef.current;
      if (track) {
        // AUDIT: Pastikan posisi tetap benar saat layar diputar/resize
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
        console.log("[Audit] Layout adjusted due to resize.");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  return (
    <div className="app-container">
      {/* Container Utama untuk Konten Panel */}
      <main className="main-content">
        <div ref={trackRef} className="panels-track" id="panelsTrack">
          {children}
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-track">
          <button
            className="nav-btn"
            data-target="panel-magnify"
            onClick={() => handleNavClick('panel-magnify')}
          >
            <i className="ph ph-magnifying-glass"></i>
          </button>

          <button
            className="nav-btn"
            data-target="panel-misi"
            onClick={() => handleNavClick('panel-misi')}
          >
            <i className="ph ph-squares-four"></i>
          </button>

          {/* Floating Action Button (FAB) */}
          <button className="nav-btn fab" id="fabAction">
            <i className="ph ph-plus"></i>
          </button>

          <button
            className="nav-btn"
            data-target="panel-agents"
            onClick={() => handleNavClick('panel-agents')}
          >
            <i className="ph ph-users-four"></i>
          </button>

          <button
            className="nav-btn"
            data-target="panel-gear"
            onClick={() => handleNavClick('panel-gear')}
          >
            <i className="ph ph-gear"></i>
          </button>

          <div className="nav-indicator"></div>
        </div>
      </nav>
    </div>
  );
}
