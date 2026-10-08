import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import Home from "@/pages/Home";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BackToTop from "@/components/BackToTop";
import { Toaster } from "sonner";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App relative bg-[#111111] text-white grain-fixed">
      <Preloader onDone={() => setReady(true)} />
      <ScrollProgress />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home ready={ready} />} />
        </Routes>
      </BrowserRouter>
      <WhatsAppFloat />
      <BackToTop />
      <Toaster
        position="bottom-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "#171717",
            border: "1px solid rgba(200,169,106,0.35)",
            color: "#f5f2ec",
            fontFamily: "Poppins, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default App;
