import React, { useState, useRef } from "react";
import { type WatchModel } from "../types";
import { playHorologySound } from "./CanvasWatch";
import { Star, ArrowUpRight, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface CollectionCardProps {
  model: WatchModel;
  onSelect: (model: WatchModel) => void;
  onAddToCart: (model: WatchModel) => void;
  key?: string | number;
}

export default function CollectionCard({ model, onSelect, onAddToCart }: CollectionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glossPos, setGlossPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Math equations for 3D card tilt and reflection specular highlights
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalizing coordinates [-1, 1]
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Maximum tilt angles
    const maxTilt = 8;
    setTilt({
      x: -normY * maxTilt,
      y: normX * maxTilt,
    });

    // Mirror sheen tracking inside card
    setGlossPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHorologySound("hover");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    onSelect(model);
    playHorologySound("click");
    // Scroll smoothly to detail configuration preview in the showcase
    const showcaseSection = document.getElementById("sandbox-showcase");
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="relative flex flex-col justify-between p-6 bg-neutral-900/10 rounded-none border border-[#C5A059]/15 hover:border-[#C5A059] transition-all duration-300 shadow-xl overflow-hidden cursor-pointer group select-none min-h-[460px]"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.015 : 1})`,
        transition: isHovered ? "none" : "transform 0.5s ease, border-color 0.4s ease",
        boxShadow: isHovered ? `0 15px 30px -15px rgba(197, 160, 89, 0.2)` : "none",
      }}
    >
      {/* Background radial highlight gradient following cursor */}
      <div
        className="absolute w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 -z-10"
        style={{
          left: `${glossPos.x}%`,
          top: `${glossPos.y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: model.primaryColor,
        }}
      />

      {/* Glossy sheen reflection diagonal indicator bar */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 bg-gradient-to-tr from-transparent via-[#C5A059]/5 to-transparent"
        style={{
          transform: `translate(${glossPos.x - 50}px, ${glossPos.y - 50}px) rotate(45deg)`,
        }}
      />

      {/* Top Banner Row */}
      <div className="flex items-center justify-between mb-4 z-10 w-full">
        <span className="text-[8px] tracking-[0.25em] font-sans px-2.5 py-1 uppercase rounded-none bg-[#C5A059]/5 border border-[#C5A059]/20 text-[#C5A059] font-bold">
          {model.category} COLLECTION
        </span>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
          <span className="text-[10px] font-mono text-[#E0D8D0] font-bold">
            {model.rating}
          </span>
        </div>
      </div>

      {/* Mid Visual Zone: Interactive floating image representation */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Color ambient backdrop halo */}
        <div
          className="absolute w-28 h-28 rounded-full blur-[45px] opacity-15 pointer-events-none transition-transform duration-700 group-hover:scale-150"
          style={{ backgroundColor: model.lightGlow }}
        />

        {/* Floating high-fidelity generic image with referrers constraint */}
        <motion.img
          src={model.image}
          alt={model.name}
          referrerPolicy="no-referrer"
          className="w-40 h-40 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] z-10 filter brightness-[0.88] group-hover:brightness-100 pointer-events-none"
          animate={{
            y: isHovered ? -12 : 0,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Telemetry mark borders centered (Aesthetic layout) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none border border-dashed border-[#C5A059]/5 rounded-none">
          <div className="w-[110%] h-[0.5px] bg-[#C5A059]/5" />
          <div className="h-[110%] w-[0.5px] bg-[#C5A059]/5" />
        </div>
      </div>

      {/* Bottom Description Rows */}
      <div className="mt-4 z-10 flex flex-col gap-3">
        <div>
          <h3 className="text-md font-serif text-[#E0D8D0] uppercase tracking-wide group-hover:text-white transition-colors">
            {model.name}
          </h3>
          <p className="text-[11px] font-mono text-[#E0D8D0]/50 line-clamp-2 mt-1 leading-snug">
            {model.tagline}
          </p>
        </div>

        {/* Core summary metrics details */}
        <div className="grid grid-cols-2 gap-2 text-[9px] font-sans text-[#E0D8D0]/60 py-2 border-y border-white/[0.04]">
          <span className="flex items-center gap-1.5 truncate">
            <Cpu className="w-3 h-3 text-[#C5A059]" />
            AL-Caliber Specs
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
            Ti-Case Monobloc
          </span>
        </div>

        {/* Buy/Select CTA Bottom Grid row */}
        <div className="flex items-center justify-between gap-4 mt-1.5 pt-1">
          <div>
            <span className="text-[8px] tracking-[0.1em] text-[#C5A059] font-sans font-bold block uppercase">
              ESCROW VALUE
            </span>
            <p className="text-sm font-bold text-[#E0D8D0] font-mono tracking-tight leading-none mt-1">
              ${model.price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(model);
              playHorologySound("click");
            }}
            className="flex items-center gap-1.5 bg-[#C5A059] text-black font-sans font-bold text-[9px] uppercase px-4 py-2.5 rounded-none hover:bg-[#D4B375] transition-all select-none hover:shadow-lg active:scale-95 cursor-pointer"
          >
            RESERVE
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
