import { useState, useEffect } from "react";
import { watchModels } from "./data/watchModels";
import { type WatchModel, type CartItem } from "./types";
import CanvasWatch, { playHorologySound } from "./components/CanvasWatch";
import SpecsView from "./components/SpecsView";
import CollectionCard from "./components/CollectionCard";
import CartDrawer from "./components/CartDrawer";
import BrandStory from "./components/BrandStory";
import AIChatbot from "./components/AIChatbot";
import CustomCursor from "./components/CustomCursor";

import { 
  ShoppingBag, 
  ChevronRight, 
  HelpCircle, 
  Cpu, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Heart,
  Globe,
  Lock,
  Menu,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation & Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<WatchModel>(watchModels[0]);
  const [isExploded, setIsExploded] = useState(false);
  
  // Custom alerts triggers
  const [showAlert, setShowAlert] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-clear alert notices
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Cart Management Functions
  const handleAddToCart = (product: WatchModel) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowAlert(`RESERVED SATELLITE ENTRY: ${product.name}`);
    playHorologySound("explode");
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setShowAlert("RESERVED ESCROW ITEM REMOVED");
  };

  const handleCustomEngraving = (productId: string, text: string) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, engraving: text } : item))
    );
    setShowAlert("LASER ETCH SPEC APPLIED");
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setShowAlert("ESCROW SIGNATURE COMPLETE. PACKAGE EN ROUTE.");
  };

  // Helper smooth scroll to a section id
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
    playHorologySound("click");
  };

  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E0D8D0] font-sans overflow-x-hidden selection:bg-[#C5A059] selection:text-black">
      {/* Ambient Background Lighting */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-[#2A1D12] rounded-full blur-[130px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#1A1A1A] rounded-full blur-[110px] opacity-60 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-[#C5A059] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

      {/* Side Details (Artistic Rails) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden xl:flex flex-col gap-8 items-center">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#C5A059]/40 to-transparent"></div>
        <div className="[writing-mode:vertical-rl] text-[8px] uppercase tracking-[0.5em] text-[#C5A059]/50 select-none">Est. 1894 Switzerland</div>
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#C5A059]/40 to-transparent"></div>
      </div>

      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden xl:flex flex-col gap-6 items-center">
        <div className="w-2 h-2 rounded-full border border-[#C5A059] animate-pulse"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
      </div>

      {/* Immersive Cyber Custom Cursor */}
      <CustomCursor themeColor={activeModel.primaryColor} />

      {/* Background static noise overlay (Luxury matte feel) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPGZpbHRlciBpZD0ibm9pc2UiPgo8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtc09jdGF2ZXM9IjMiIHN0aWNoVGltZXM9Im缝I+PC9mZVR1cmJ1bGVuY2U+CjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIj48L3JlY3Q+Cjwvc3ZnPg==')]" />

      {/* Dynamic Ambient Header Panel */}
      <nav className="sticky top-0 left-0 right-0 z-45 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] select-none h-18 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            {/* Elegant classic compass rotating logo indicator */}
            <Compass className="w-[18px] h-[18px] text-[#C5A059] animate-[spin_12s_linear_infinite]" />
            <span className="text-sm tracking-[0.3em] font-display uppercase font-bold text-white">
              AETHERIS
              <span className="font-serif italic font-light text-[#C5A059] ml-1.5 capitalize tracking-normal text-xs">Chrono</span>
            </span>
          </div>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center gap-8 text-[9px] tracking-[0.25em] font-sans text-[#E0D8D0]/60 uppercase">
            <button onClick={() => scrollToId("sandbox-showcase")} className="hover:text-[#C5A059] transition-all cursor-pointer gold-glow-hover">
              Deconstruction Lab
            </button>
            <button onClick={() => scrollToId("bento-features")} className="hover:text-[#C5A059] transition-all cursor-pointer gold-glow-hover">
              Laboratories
            </button>
            <button onClick={() => scrollToId("collections-grid")} className="hover:text-[#C5A059] transition-all cursor-pointer gold-glow-hover">
              Masterworks
            </button>
            <button onClick={() => scrollToId("storytelling-section")} className="hover:text-[#C5A059] transition-all cursor-pointer gold-glow-hover">
              Brand Ancestry
            </button>
          </div>

          {/* Right Accessories Block */}
          <div className="flex items-center gap-4">
            {/* Direct Digital Clock */}
            <span className="hidden lg:inline-block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
              UTC GVA {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>

            {/* Cart Trigger */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                playHorologySound("click");
              }}
              className="relative p-2.5 rounded-full border border-white/[0.08] hover:border-white/25 bg-neutral-900/60 transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              {cartTotalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold font-mono w-4 h-4 rounded-full flex items-center justify-center border border-black animate-pulse">
                  {cartTotalQty}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                playHorologySound("click");
              }}
              className="p-2.5 md:hidden text-neutral-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden sticky top-18 left-0 right-0 z-40 bg-neutral-950 border-b border-white/[0.08] p-6 flex flex-col gap-4 text-xs font-mono tracking-widest uppercase text-neutral-400"
          >
            <button onClick={() => scrollToId("sandbox-showcase")} className="text-left py-2 hover:text-white">Interactive Sandbox</button>
            <button onClick={() => scrollToId("bento-features")} className="text-left py-2 hover:text-white">Laboratories</button>
            <button onClick={() => scrollToId("collections-grid")} className="text-left py-2 hover:text-white">Catalog Masterworks</button>
            <button onClick={() => scrollToId("storytelling-section")} className="text-left py-2 hover:text-white">Our Ancestry</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Alerts Prompt */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 p-4 rounded-xl border border-white/[0.12] bg-neutral-900/95 shadow-2xl font-mono text-[10px] text-white flex items-center gap-3 backdrop-blur-md max-w-sm"
          >
            <span className="w-2 h-2 rounded-full animate-ping bg-emerald-400" />
            <div className="flex-1">
              <span className="text-neutral-500 block text-[8px] uppercase font-bold tracking-widest">TRANSACT ALERTS</span>
              <p className="font-semibold">{showAlert}</p>
            </div>
            <button onClick={() => setShowAlert(null)} className="text-neutral-500 hover:text-white ml-2 text-xs">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Fullscreen Cinematic Hero */}
      <section className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-6 bg-[#050505] select-none overflow-hidden">
        {/* Massive elegant watermark typography "HORIZON" backing the layout stage */}
        <div className="absolute inset-0 z-0 flex items-center justify-center select-none pointer-events-none">
          <h1 className="text-[130px] md:text-[230px] lg:text-[270px] font-bold opacity-[0.03] italic tracking-widest font-serif text-[#C5A059]">
            HORIZON
          </h1>
        </div>

        {/* Deep ambient cosmic/chocolate warm glow behind layout */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[150px] opacity-[0.15] pointer-events-none transition-all duration-1000 bg-[#2A1D12]" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
          
          {/* Hero Explaining Metadata */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 tracking-normal"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-[8px] tracking-[0.4em] font-sans text-[#C5A059] uppercase flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                SWISS SKELETONIZED PERPETUAL CHRONOMETERS
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-[#E0D8D0] mt-3 tracking-tight leading-none">
                Cryo-Forged. <br className="hidden md:inline" />
                <span className="font-serif italic font-normal text-[#C5A059] drop-shadow-sm">
                  Absolute Precision.
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[#E0D8D0]/70 text-xs md:text-sm max-w-lg leading-relaxed font-sans"
            >
              Aetheris Chrono fuses high-end architectural mechanical micro-assemblies with premium swiss engineering. Experience physical deconstruction, floating double-spring tourbillons operating on synthetic ruby friction nodes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <button
                onClick={() => scrollToId("sandbox-showcase")}
                className="group flex items-center gap-2.5 px-7 py-3.5 bg-[#C5A059] hover:bg-[#D4B375] text-black font-semibold text-[9px] tracking-[0.25em] font-sans uppercase rounded-none transition-all cursor-pointer shadow-[0_4px_20px_rgba(197,160,89,0.35)] glow-btn"
              >
                BEGIN DECONSTRUCTION
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToId("collections-grid")}
                className="px-7 py-3.5 border border-[#C5A059]/30 hover:border-[#C5A059] text-[#E0D8D0] font-sans text-[9px] tracking-[0.25em] font-semibold uppercase rounded-none hover:bg-[#C5A059]/5 transition-all cursor-pointer"
              >
                Showcase Masterworks
              </button>
            </motion.div>

            {/* Miniature horizontal dashboard telemetry */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.05] mt-4 text-left"
            >
              <div>
                <span className="text-[8px] text-[#C5A059]/80 font-mono block tracking-widest">HERTZ SPEED</span>
                <span className="text-[13px] font-bold text-[#E0D8D0] font-mono tracking-tight">4.0Hz (28,800)</span>
              </div>
              <div>
                <span className="text-[8px] text-[#C5A059]/80 font-mono block tracking-widest">CASE COMPASS</span>
                <span className="text-[13px] font-bold text-[#E0D8D0] font-mono tracking-tight">Grade-5 Titanium</span>
              </div>
              <div>
                <span className="text-[8px] text-[#C5A059]/80 font-mono block tracking-widest">DIAMOND SCALE</span>
                <span className="text-[13px] font-bold text-[#E0D8D0] font-mono tracking-tight">9/10 Mohs crystal</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Large Moving Masterpiece on Center Stage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex items-center justify-center relative"
          >
            {/* Ambient vector alignment circle wrapper */}
            <div className="absolute inset-0 border border-dashed border-white/[0.03] animate-[spin_40s_linear_infinite] rounded-full max-w-[460px] aspect-square mx-auto -z-10" />
            <CanvasWatch
              activeModel={activeModel}
              isExploded={isExploded}
              onExplodeToggle={setIsExploded}
            />
          </motion.div>

        </div>
      </section>

      {/* 2. Infinite Horology Marquee Banner */}
      <section className="bg-[#111115] border-y border-[#C5A059]/15 py-4 select-none overflow-hidden h-14 flex items-center">
        <div className="infinite-scroll-container font-mono text-[9px] tracking-[0.35em] uppercase text-[#E0D8D0]/60 flex items-center gap-16 whitespace-nowrap">
          {Array(4).fill([
            "COAXIAL DOUBLE FLYING TOURBILLON",
            "GRADE 5 BEAD-BLASTED AEROSPACE TITANIUM",
            "PERPETUAL INTERSTELLAR WINDING ENGINE",
            "9/10 MOHS GLASS SAPPHIRE CRYOGENIC SHIELDS",
            "SILICON FRICTIONLESS CALIBERS"
          ]).flat().map((phrase, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/50" />
              <span>{phrase}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Sandbox Customizer Stage */}
      <section id="sandbox-showcase" className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start select-none relative">
        <div className="lg:col-span-12 mb-4">
          <span className="text-[9px] tracking-[0.25em] font-sans text-[#C5A059] uppercase font-semibold">
            METAMORPHIC PORTAL
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-[#E0D8D0] pb-3 mt-1.5 tracking-tight font-medium">
            The Interactive <span className="font-serif italic text-[#C5A059]">Deconstruction Lab</span>
          </h2>
          <p className="text-[#E0D8D0]/60 text-xs md:text-sm font-sans max-w-2xl mt-2 leading-relaxed">
            Drag to pivot in full 3D, hover boundaries to trigger specular lighting physics, and toggle exploded view to disassemble the micro-mechanical automatic gears.
          </p>
        </div>

        {/* Preset Side Selector Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <span className="text-[8px] tracking-[0.2em] font-sans text-[#C5A059] uppercase pb-2 border-b border-white/[0.08] font-bold">
            FOUNDATIONAL DESIGNS
          </span>
          {watchModels.map((model) => {
            const isActive = activeModel.id === model.id;
            return (
              <button
                key={model.id}
                onClick={() => {
                  setActiveModel(model);
                  playHorologySound("click");
                }}
                className={`w-full p-4 rounded-none border text-left transition-all flex flex-col gap-1 cursor-pointer select-none ${isActive ? "bg-[#C5A059]/10 border-[#C5A059] scale-[1.01]" : "bg-neutral-900/20 border-white/[0.04] hover:border-[#C5A059]/30"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-sans font-semibold text-[#E0D8D0] tracking-wider">
                    {model.name.replace("AETHERIS ", "")}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: model.primaryColor,
                      boxShadow: `0 0 8px ${model.primaryColor}`
                    }}
                  />
                </div>
                <span className="text-[9px] text-[#C5A059] font-mono uppercase truncate tracking-wider">
                  ${model.price.toLocaleString()} ESCROW TRAP
                </span>
              </button>
            );
          })}

          {/* Quick Reserve widget */}
          <div className="p-5 rounded-none border border-white/[0.05] bg-neutral-900/10 mt-4 flex flex-col gap-3 font-sans">
            <span className="text-[8px] text-[#C5A059] uppercase tracking-widest font-bold">
              ESCROW CRITERIA
            </span>
            <div className="text-[11px] text-[#E0D8D0]/60 leading-relaxed font-sans">
              Each timepiece is cryo-purified and built entirely upon custom commission. Guaranteed secure transit in hermetic solid alloy safety drawers.
            </div>
            <button
              onClick={() => handleAddToCart(activeModel)}
              className="mt-2 w-full py-3.5 bg-[#C5A059] text-black font-semibold uppercase text-[9px] tracking-widest hover:bg-[#D4B375] transition-all cursor-pointer shadow-lg hover:shadow-white/5 font-sans"
            >
              RESERVE PRESET TIMEPIECE
            </button>
          </div>
        </div>

        {/* Central interactive watch canvas */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <CanvasWatch
            activeModel={activeModel}
            isExploded={isExploded}
            onExplodeToggle={setIsExploded}
          />
        </div>

        {/* Specs and Exploded parts listings */}
        <div className="lg:col-span-4">
          <SpecsView
            activeModel={activeModel}
            isExploded={isExploded}
            onExplodeToggle={setIsExploded}
          />
        </div>
      </section>

      {/* 4. Bento Grid Advanced Laboratories Feature Showcase */}
      <section id="bento-features" className="py-24 bg-[#050505] border-t border-white/[0.04] select-none overflow-hidden relative">
        <div className="absolute top-[30%] left-[-10%] w-[450px] h-[450px] bg-[#2A1D12]/20 rounded-full blur-[140px] opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <span className="text-[9px] tracking-[0.25em] font-sans text-[#C5A059] uppercase font-bold">
              HOROLOGICAL LABORATORIES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-[#E0D8D0] pb-3 mt-1.5 tracking-tight">
              The Metallurgy of <span className="font-serif italic text-[#C5A059]">Tomorrow</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A059] mt-3" />
          </motion.div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
            
            {/* Box 1: Coaxial Tourbillon animation */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-1 md:col-span-12 lg:col-span-7 p-6 bg-neutral-900/10 border border-[#C5A059]/10 rounded-none backdrop-blur-md flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 border border-[#C5A059]/10 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-28 h-28 opacity-10 blur-[30px] bg-[#C5A059] pointer-events-none rounded-full" />
              <div>
                <Cpu className="w-5 h-5 text-[#C5A059] mb-3" />
                <h3 className="text-lg font-serif italic text-[#E0D8D0]">Double-Flying Coaxial Tourbillon</h3>
                <p className="text-xs text-[#E0D8D0]/60 font-sans mt-2 leading-relaxed max-w-md">
                  A dual skeletonized escape cage layout operating along opposite rotating vectors, neutralizing gravity-induced balance wheel friction across multiple dimensional planes.
                </p>
              </div>
              <span className="text-[9px] font-mono text-[#C5A059]/60">CALIBER RESEARCH SPEC AL-7075 // COAXIAL</span>
            </motion.div>

            {/* Box 2: Glass Hardness representation */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="col-span-1 md:col-span-6 lg:col-span-5 p-6 bg-neutral-900/10 border border-[#C5A059]/10 rounded-none backdrop-blur-md flex flex-col justify-between relative group"
            >
              <div className="absolute top-3 right-3 p-3 bg-white/[0.02] border border-white/[0.05]">
                <Globe className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div>
                <span className="text-4xl font-light font-display text-[#C5A059]">9.0</span>
                <h3 className="text-md font-serif text-[#E0D8D0] mt-2">Mohs Specular Sapphire Hardness</h3>
                <p className="text-[11px] text-[#E0D8D0]/60 font-sans mt-1.5 leading-snug">
                  Synthetic alpha-alumina crystals aligned dynamically on crystalline planes to ensure absolute scratchproof outer protective shielding.
                </p>
              </div>
              <span className="text-[9px] font-mono text-[#C5A059]/60">CRYSTAL SPECS // MOHS STABILIZER</span>
            </motion.div>

            {/* Box 3: Waterproof isolation stats */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="col-span-1 md:col-span-6 lg:col-span-5 p-6 bg-neutral-900/10 border border-[#C5A059]/10 rounded-none backdrop-blur-md flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D12]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div>
                <h3 className="text-lg font-serif text-[#E0D8D0]">Cryogenic Sealing Isolation</h3>
                <p className="text-xs text-[#E0D8D0]/60 font-sans mt-1.5 leading-relaxed">
                  Every crown component undergoes absolute hermetic sealing inside neon helium chambers, guaranteeing absolute isolation metrics reaching 200m depth pressures.
                </p>
              </div>
              <div className="flex items-end justify-between z-10">
                <span className="text-[9px] font-mono text-[#C5A059]/60">PRESSURE METRICS // HERMETIC</span>
                <span className="text-xs font-semibold font-mono text-[#C5A059]">20 BAR CERTIFIED // GVA</span>
              </div>
            </motion.div>

            {/* Box 4: Silicon Escapement Frictionless */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="col-span-1 md:col-span-12 lg:col-span-7 p-6 bg-neutral-900/10 border border-[#C5A059]/10 rounded-none backdrop-blur-md flex flex-col justify-between relative group overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-[0.05] bg-[#C5A059] blur-[80px] pointer-events-none" />
              <div>
                <Lock className="w-5 h-5 text-[#C5A059] mb-3" />
                <h3 className="text-lg font-serif italic text-[#E0D8D0]">Cryo-Purified Amorphous Platinum</h3>
                <p className="text-xs text-[#E0D8D0]/60 font-sans mt-2 leading-relaxed max-w-lg">
                  Cryo-purified inside cold Genevan subterranean arrays, aligning the metallic molecules into a highly dense amorphous matrix entirely immune to localized electromagnetic static fields.
                </p>
              </div>
              <span className="text-[9px] font-mono text-[#C5A059]/60">CRYOMECHANICS // ALLOYING PROCESS v09</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. Luxury Collection Masterworks Grid Product Section */}
      <section id="collections-grid" className="py-24 max-w-7xl mx-auto px-6 select-none relative">
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full blur-[140px] opacity-[0.03] bg-[#C5A059] pointer-events-none" />
        <div className="mb-14">
          <span className="text-[9px] tracking-[0.25em] font-sans text-[#C5A059] uppercase font-bold">
            THE PERPETUAL CURATIONS
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-[#E0D8D0] pb-3 mt-1.5 tracking-tight">
            The Masterworks <span className="font-serif italic text-[#C5A059]">Catalog</span>
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A059] mt-3" />
        </div>

        {/* Master Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {watchModels.map((model) => (
            <CollectionCard
              key={model.id}
              model={model}
              onSelect={setActiveModel}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* 6. Brand Story chronology */}
      <section id="storytelling-section">
        <BrandStory />
      </section>

      {/* 7. Bespoke Shopping Drawer Manager Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCustomEngraving={handleCustomEngraving}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Iframe friendly, server-side secure horology companion chatbot */}
      <AIChatbot themeColor={activeModel.primaryColor} />

      {/* Footer Branding section */}
      <footer className="py-16 bg-black border-t border-white/[0.05] select-none text-neutral-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Compass className="w-4 h-4 text-white animate-spin duration-10000" />
              <span className="tracking-[0.25em] text-white uppercase text-[10px] font-bold">
                AETHERIS CHRONO
              </span>
            </div>
            <p className="text-[10px] text-neutral-600 leading-relaxed uppercase">
              Merging deep-space tactical blueprints with absolute Swiss watchmaking aesthetics. Built entirely on private elite commissions.
            </p>
          </div>

          <div className="flex justify-center gap-8 uppercase text-[10px]">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white transition-colors cursor-pointer">Back to Top</button>
            <button onClick={() => scrollToId("sandbox-showcase")} className="hover:text-white transition-colors cursor-pointer">Sandbox</button>
            <button onClick={() => scrollToId("collections-grid")} className="hover:text-white transition-colors cursor-pointer">Catalog</button>
          </div>

          <div className="text-left md:text-right text-[9px] text-neutral-600 uppercase flex flex-col gap-1">
            <span>© {new Date().getFullYear()} AETHERIS HOROLOGY GROUP. ALL RIGHTS RESERVED.</span>
            <span>LICENSED CHRONOMETER STATUS APPROVED.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
