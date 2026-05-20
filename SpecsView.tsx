import { useState } from "react";
import { type WatchModel } from "../types";
import { playHorologySound } from "./CanvasWatch";
import { Shield, Sparkles, Cpu, Hammer, Wind, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SpecsViewProps {
  activeModel: WatchModel;
  isExploded: boolean;
  onExplodeToggle: (val: boolean) => void;
}

export default function SpecsView({ activeModel, isExploded, onExplodeToggle }: SpecsViewProps) {
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(null);

  const handlePartClick = (index: number) => {
    if (!isExploded) {
      onExplodeToggle(true);
    }
    setSelectedPartIndex(index);
    playHorologySound("click");
  };

  // Spec categories mapped to line icons
  const specIcons = [
    { label: "CASE ARMOR", value: activeModel.specs.case, icon: Shield },
    { label: "TACTICAL BEZEL", value: activeModel.specs.bezel, icon: Sparkles },
    { label: "HOROLOGY CALIBER", value: activeModel.specs.caliber, icon: Cpu },
    { label: "POWER RESERVE", value: activeModel.specs.reserve, icon: Wind },
    { label: "DEPTH COMPRESS", value: activeModel.specs.waterproof, icon: CircleDot },
    { label: "SAPPHIRE GLASS", value: activeModel.specs.glass, icon: Hammer },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 text-[#E0D8D0] select-none">
      {/* Dynamic Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeModel.primaryColor }} />
          <span className="text-[8px] tracking-[0.25em] font-sans font-bold text-[#C5A059] uppercase">
            METALLIC SPECIFICATIONS
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-light text-[#E0D8D0] pb-3 border-b border-[#C5A059]/10">
          {activeModel.name.replace("AETHERIS ", "")} <span className="font-serif italic text-[#C5A059]">Edition</span>
        </h2>
        <p className="text-[#E0D8D0]/60 font-sans text-xs mt-3 leading-relaxed">
          {activeModel.description}
        </p>
      </div>

      {/* Dynamic Spec Metric Array Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
        {specIcons.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3.5 p-3.5 rounded-none border border-[#C5A059]/10 bg-neutral-900/10 hover:bg-neutral-900/20 hover:border-[#C5A059]/30 transition-all duration-300"
            >
              <div
                className="p-2 border border-[#C5A059]/20 bg-[#C5A059]/5 mt-0.5 text-[#C5A059]"
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[8px] tracking-widest text-[#C5A059]/80 font-sans font-bold uppercase">
                  {item.label}
                </span>
                <p className="text-xs font-semibold text-[#E0D8D0] mt-1 leading-snug">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mechanical Deconstruction Dashboard */}
      <div className="p-5 rounded-none border border-[#C5A059]/10 bg-neutral-900/10 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none rounded-full" style={{ backgroundColor: activeModel.lightGlow }} />
        
        <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
          <span className="text-xs tracking-[0.15em] font-sans text-[#E0D8D0]/80 uppercase flex items-center gap-1.5 font-semibold">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-[#C5A059]" />
            Exploded Mechanics Index
          </span>
          <button
            onClick={() => {
              onExplodeToggle(!isExploded);
              playHorologySound("explode");
            }}
            className="text-[9px] tracking-widest font-sans font-bold px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#C5A059]/25 text-[#C5A059] transition-all uppercase cursor-pointer"
          >
            {isExploded ? "Assemble" : "Deconstruct"}
          </button>
        </div>

        {/* List of disassemblable parts */}
        <div className="flex flex-col gap-2">
          {activeModel.explodedParts.map((part, index) => {
            const isSelected = selectedPartIndex === index && isExploded;
            return (
              <button
                key={index}
                onClick={() => handlePartClick(index)}
                className={`w-full flex items-center justify-between p-2.5 rounded-none border text-left transition-all duration-300 cursor-pointer ${isSelected ? "bg-[#C5A059]/10 border-[#C5A059] scale-[1.01]" : "bg-black/30 border-white/[0.04] hover:bg-white/5 hover:border-[#C5A059]/20"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono border border-white/5 bg-neutral-900/50 w-5 h-5 flex items-center justify-center text-neutral-400 text-center">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className={`text-[11px] font-sans tracking-wide ${isSelected ? "text-white font-semibold" : "text-[#E0D8D0]/80"}`}>
                    {part.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider">
                    OFFSET: {part.offset.z}µ
                  </span>
                  <div
                    className="w-1.5 h-1.5 rounded-full z-10"
                    style={{
                      backgroundColor: isSelected ? activeModel.primaryColor : "rgba(255,255,255,0.15)",
                      boxShadow: isSelected ? `0 0 8px ${activeModel.primaryColor}` : "none"
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Display details of selected parts */}
        <AnimatePresence mode="wait">
          {selectedPartIndex !== null && isExploded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4.5 bg-[#050505]/95 border border-[#C5A059]/30 rounded-none text-[#E0D8D0]/85"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeModel.primaryColor }} />
                <h4 className="text-xs uppercase tracking-widest font-sans text-white font-bold">
                  {activeModel.explodedParts[selectedPartIndex].name}
                </h4>
              </div>
              <p className="text-[11px] font-sans text-[#E0D8D0]/70 mt-1 leading-relaxed">
                {activeModel.explodedParts[selectedPartIndex].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
