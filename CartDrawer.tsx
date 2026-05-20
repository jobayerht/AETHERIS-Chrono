import { type CartItem } from "../types";
import { X, Trash2, ArrowRight, ShieldCheck, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playHorologySound } from "./CanvasWatch";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCustomEngraving: (id: string, text: string) => void;
  onCheckoutSuccess: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCustomEngraving,
  onCheckoutSuccess,
}: CartDrawerProps) {
  const [engravingTarget, setEngravingTarget] = useState<string | null>(null);
  const [engravingText, setEngravingText] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"review" | "shipping" | "confirm">("review");

  // Calculate high-end pricing aggregates
  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const secureDeliveryEscrow = rawSubtotal > 150000 ? 0 : 750; // free escrow on extreme purchases
  const insurancePremiumFee = rawSubtotal * 0.005; // 0.5% premium luxury transit insurance
  const totalCompositePrice = rawSubtotal + secureDeliveryEscrow + insurancePremiumFee;

  const handleUpdateQty = (id: string, val: number) => {
    onUpdateQuantity(id, val);
    playHorologySound("tick");
  };

  const handleRemove = (id: string) => {
    onRemoveItem(id);
    playHorologySound("click");
  };

  const handleSaveEngraving = (id: string) => {
    onCustomEngraving(id, engravingText);
    setEngravingTarget(null);
    setEngravingText("");
    playHorologySound("click");
  };

  const handleCheckoutSubmit = () => {
    playHorologySound("explode");
    setCheckoutStep("confirm");
    setTimeout(() => {
      onCheckoutSuccess();
      setCheckoutStep("review");
      onClose();
    }, 3500); // 3.5s cinematic validation step
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop screen lock */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 z-[90] backdrop-blur-sm"
          />

          {/* Drawer alignment container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-[440px] max-w-full bg-[#050505] border-l border-[#C5A059]/20 shadow-2xl z-[95] text-[#E0D8D0] flex flex-col overflow-hidden select-none"
          >
            {/* Header section */}
            <div className="p-6 bg-neutral-950 border-b border-[#C5A059]/10 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold tracking-[0.25em] font-sans text-[#C5A059] uppercase">
                  BESPOKE RESERVATIONS
                </h3>
                <span className="text-[9px] text-[#E0D8D0]/60 font-sans tracking-widest uppercase mt-0.5 block">
                  SECURE VAULT COUPLING
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Cart is empty */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#E0D8D0]/60 font-sans">
                <ShieldCheck className="w-12 h-12 stroke-[1] mb-4 text-[#C5A059]" />
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-[#E0D8D0]">
                  Vault Compartment Empty
                </p>
                <span className="text-[10px] text-[#E0D8D0]/50 mt-2 block max-w-[250px] mx-auto leading-relaxed">
                  Select key physical metrics to proceed with secure reservations.
                </span>
                <span className="text-[8px] text-[#C5A059]/50 mt-6 block tracking-widest font-mono">
                  AETHERIS CHRONO ESCROW SECURE v12.1e
                </span>
              </div>
            ) : checkoutStep === "confirm" ? (
              /* Success loading animation screen */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050505] font-sans relative">
                {/* Micro particle rings rotating */}
                <div className="w-24 h-24 border border-[#C5A059]/30 border-t-[#C5A059] animate-spin flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-[#C5A059]" />
                </div>
                <h4 className="text-sm font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-2">
                  AUTHENTICATING LEDGER...
                </h4>
                <p className="text-[11px] text-[#E0D8D0]/60 max-w-xs leading-relaxed uppercase">
                  Engaging secure satellite smart contracts. Your biometric horology parcel is being cataloged and registered in our central vaults with quantum token allocations.
                </p>
                <span className="text-[8px] text-[#C5A059]/40 absolute bottom-10 tracking-widest font-mono">
                  AETHERIS CHRONO ESCROW PROTOCOL v2.16
                </span>
              </div>
            ) : (
              /* Items Loop list */
              <>
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                  {items.map((item, index) => {
                    const isCustomizing = engravingTarget === item.product.id;
                    return (
                      <div
                        key={item.product.id}
                        className="p-4 bg-neutral-900/10 rounded-none border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all flex flex-col gap-3 relative group"
                      >
                        {/* Upper row details */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {/* Color glowing indicators */}
                            <span
                              className="w-1.5 h-12"
                              style={{ backgroundColor: item.product.primaryColor }}
                            />
                            <div>
                              <h4 className="text-xs uppercase font-sans font-bold text-[#E0D8D0] tracking-wider">
                                {item.product.name.replace("AETHERIS ", "")}
                              </h4>
                              <p className="text-[9px] font-mono text-[#C5A059] uppercase mt-1 tracking-wider">
                                Cat: {item.product.category} | ${item.product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemove(item.product.id)}
                            className="p-1 text-[#E0D8D0]/40 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Mid Row details & custom engraving details */}
                        {item.engraving ? (
                          <div className="bg-[#C5A059]/5 p-2.5 rounded-none border border-[#C5A059]/20 text-[10px] font-mono text-[#C5A059] flex items-center gap-1.5 leading-none">
                            <Gift className="w-3 h-3 text-[#C5A059]" />
                            <span>LASER ENGRAVED SECURE: <strong>"{item.engraving}"</strong></span>
                          </div>
                        ) : null}

                        {/* Custom laser engraving editing interface */}
                        {isCustomizing ? (
                          <div className="bg-[#050505] p-3 rounded-none border border-[#C5A059]/30 flex flex-col gap-2">
                            <input
                              type="text"
                              value={engravingText}
                              onChange={(e) => setEngravingText(e.target.value)}
                              placeholder="Laser etch backplate plate (Max 24 chars)"
                              maxLength={24}
                              className="bg-neutral-950 border border-[#C5A059]/20 rounded-none px-2.5 py-1.5 text-[10px] font-mono focus:outline-none focus:border-[#C5A059] text-[#E0D8D0]"
                            />
                            <div className="flex items-center justify-end gap-2 text-[9px] font-sans font-bold uppercase tracking-wider">
                              <button
                                onClick={() => setEngravingTarget(null)}
                                className="text-neutral-500 hover:text-neutral-300"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEngraving(item.product.id)}
                                className="bg-[#C5A059] text-black px-2.5 py-1 rounded-none hover:bg-[#D4B375]"
                              >
                                Save Etch
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEngravingTarget(item.product.id);
                              setEngravingText(item.engraving || "");
                              playHorologySound("click");
                            }}
                            className="text-[9px] font-sans tracking-widest font-bold text-[#C5A059] hover:text-[#D4B375] flex items-center gap-1.5 select-none text-left cursor-pointer"
                          >
                            <Gift className="w-3 h-3" />
                            {item.engraving ? "Edit Laser Customization" : "Add Laser Precision Engraving (+ $0 Free)"}
                          </button>
                        )}

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                          <span className="text-[10px] font-sans font-semibold text-[#E0D8D0]/60 uppercase">
                            Quantities
                          </span>
                          <div className="flex items-center gap-2 border border-[#C5A059]/20 rounded-none bg-[#C5A059]/5 px-2.5 py-0.5">
                            <button
                              onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                              className="text-[#C5A059] hover:text-[#E0D8D0] text-xs px-1"
                            >
                              -
                            </button>
                            <span className="text-[10px] font-mono text-[#E0D8D0] text-center w-4 font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                              className="text-[#C5A059] hover:text-[#E0D8D0] text-xs px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Secure checkout block */}
                <div className="p-6 bg-neutral-950 border-t border-[#C5A059]/10 flex flex-col gap-4 font-sans">
                  {/* Detailed pricing specs */}
                  <div className="flex flex-col gap-2 text-[10px] text-[#E0D8D0]/65 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="tracking-wide">BRASS RAW SUB-TOTAL:</span>
                      <span className="text-white font-mono">${rawSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="tracking-wide">TRANSIT SECURE ESCROW:</span>
                      <span className="text-white font-mono">
                        {secureDeliveryEscrow === 0 ? "FREE SECURE WAIVER" : `$${secureDeliveryEscrow}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="tracking-wide">CRYO TRANSIT INSURANCE (0.5%):</span>
                      <span className="text-white font-mono">${insurancePremiumFee.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs font-bold text-[#E0D8D0]">
                      <span className="tracking-widest text-[#C5A059]">TOTAL DIRECT ESCROW:</span>
                      <span className="text-[#E0D8D0] text-sm font-mono font-bold" style={{ textShadow: "0 0 20px rgba(197,160,89,0.3)" }}>
                        ${totalCompositePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Disclaimer */}
                  <div className="text-[8px] leading-relaxed text-[#E0D8D0]/40 uppercase border border-[#C5A059]/10 p-2.5 bg-black/30 font-sans">
                    Secure satellite escrow checks are guaranteed by Aetheris Financial Horology Holdings. 30-day returns criteria applies onto all pristine and unconstructed orders.
                  </div>

                  {/* Absolute Checkout trigger button */}
                  <button
                    onClick={handleCheckoutSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#C5A059] text-black hover:bg-[#D4B375] transition-all font-sans font-bold text-[10px] uppercase tracking-widest rounded-none hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] cursor-pointer"
                  >
                    Transmit Secured Ledger
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
