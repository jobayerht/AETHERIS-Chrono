import { type WatchModel } from "../types";

export const watchModels: WatchModel[] = [
  {
    id: "phantom",
    name: "AETHERIS PHANTOM",
    tagline: "Stealth Obsidian Gold Mechanical Skeletons",
    description: "Crafted from sandblasted sand-matte Grade 5 Aerospace Titanium. Features double ceramic ball bearings, a double-spring flying tourbillon, and glowing micro-conduits in Swiss warm-gold.",
    price: 185000,
    rating: 4.98,
    specs: {
      case: "Grade 5 Bead-Blasted Aerospace Titanium, 43mm",
      bezel: "Satin-Finished Black Silicon Carbide Ceramic",
      caliber: "Tourbillon Caliber AL-7075, Skeletonized Automatic",
      reserve: "72 Hours Power Reserve (Twin-Barrel Coaxial)",
      waterproof: "100 Meters / 10 Bar Hermetic Sealed",
      glass: "Curved Specular Double Anti-Reflective Sapphire",
    },
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", // backup or mock if required, though we use Canvas primarily
    primaryColor: "#C5A059", // Swiss Warm Gold
    secondaryColor: "#111115",
    lightGlow: "#C5A059",
    category: "Stealth",
    explodedParts: [
      { name: "Holographic Front Armor Glass", offset: { x: 0, y: 0, z: 180 }, scale: 1.05, color: "rgba(197, 160, 89, 0.15)", description: "Scratchproof Curved Sapphire shielding internal modules." },
      { name: "Tactical Bezel Assembly", offset: { x: 0, y: 0, z: 120 }, scale: 1.0, color: "#1c1c24", description: "Secured by 8 precision-grade hexagonal micro-screws." },
      { name: "Luminous Pointer Assembly", offset: { x: 0, y: 0, z: 70 }, scale: 0.95, color: "#ffffff", description: "Sweeping structural hands coated with luminescent grade SLN C3." },
      { name: "Cyber Dial Face & Indices", offset: { x: 0, y: 0, z: 30 }, scale: 0.9, color: "rgba(197, 160, 89, 0.2)", description: "Semi-transparent sapphire printed with custom alignment HUDs." },
      { name: "AL-7075 Skeleton Movement Block", offset: { x: 0, y: 0, z: -30 }, scale: 0.85, color: "#C5A059", description: "Gears & oscillating escapement balance block." },
      { name: "Aerospace Titanium Solid Backing", offset: { x: 0, y: 0, z: -120 }, scale: 0.95, color: "#0d0d11", description: "Secures internal machinery with serial micro-engravings." }
    ]
  },
  {
    id: "nebula",
    name: "AETHERIS NEBULA",
    tagline: "Nebular Rose Gold Cosmic Horology",
    description: "Forged in interstellar stardust gold and deep obsidian ceramic. Features an amethyst-tinted tourbillon balance and cosmic constellation layout plates on double-reflective sapphire.",
    price: 245000,
    rating: 4.99,
    specs: {
      case: "18K Interstellar Rose Gold alloy, Polished, 44mm",
      bezel: "Forged Amethyst-infused Carbon Fiber Composite",
      caliber: "Cosmic Caliber AL-9012, Manual High-Oscillation",
      reserve: "120 Hours Power Reserve (Triple-Barrel Monobloc)",
      waterproof: "50 Meters / 5 Bar Pressure Protection",
      glass: "Faceted Purple spec-tinted Sapphire and Display Back",
    },
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    primaryColor: "#a855f7", // Deep Cosmic Amethyst Purple
    secondaryColor: "#C5A059", // Rose Gold Glow
    lightGlow: "#bf77f6",
    category: "Interstellar",
    explodedParts: [
      { name: "Amethyt Specular Crystal Armor", offset: { x: 0, y: 0, z: 180 }, scale: 1.05, color: "rgba(168, 85, 247, 0.15)", description: "Sapphire crystal tinted with stellar radiation shield." },
      { name: "Rose Gold Crown Bezel Ring", offset: { x: 0, y: 0, z: 120 }, scale: 1.0, color: "#C5A059", description: "Polished to full high-gloss 18k stardust Rose gold." },
      { name: "Star-Aligner Gold Hands", offset: { x: 0, y: 0, z: 70 }, scale: 0.95, color: "#ffeb3b", description: "Faceted pointers mirroring structural bridge beams." },
      { name: "Nebula Coordinates Sapphire Plate", offset: { x: 0, y: 0, z: 30 }, scale: 0.9, color: "rgba(191, 119, 246, 0.25)", description: "Semi-transparent deep purple sapphire screen." },
      { name: "Triple-Barrel Monobloc Engine Core", offset: { x: 0, y: 0, z: -30 }, scale: 0.85, color: "#C5A059", description: "High-density weight balance spinning on synthetic rubies." },
      { name: "Exhibition Space Back Glass Plate", offset: { x: 0, y: -120, z: -120 }, scale: 0.95, color: "#110b1a", description: "Engraved with interstellar alignment vectors." }
    ]
  },
  {
    id: "imperium",
    name: "AETHERIS IMPERIUM",
    tagline: "Eminent Liquid Gold Fluid-Motion",
    description: "An incredibly elegant execution of timeless royalty combined with futuristic architecture. Handcrafted in heavy 24K Mirror-Finished Liquid Yellow Gold with liquid-crystal dial conduit bands.",
    price: 310000,
    rating: 4.95,
    specs: {
      case: "24K Forged Liquid Yellow Gold Alloy, Micro-Sealed, 42mm",
      bezel: "Specular Mirror-Polished 24K Gold armor",
      caliber: "Perpetual Caliber AL-1002, Micro-Rotor Automatic",
      reserve: "96 Hours Power Reserve with 24K Gold Rotor",
      waterproof: "150 Meters / 15 Bar High Pressure Hermetic",
      glass: "Faceted Gold Reflection Specular Anti-Static Sapphire",
    },
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
    primaryColor: "#C5A059", // Golden Brand Glow
    secondaryColor: "#0f172a", // Obsidian contrasting slate
    lightGlow: "#C5A059",
    category: "Liquid Gold",
    explodedParts: [
      { name: "Specular Golden Armor Glass", offset: { x: 0, y: 0, z: 180 }, scale: 1.05, color: "rgba(197, 160, 89, 0.15)", description: "24-carat gold ion double-coated sapphire armor." },
      { name: "Liquid-Polished Bezel Frame", offset: { x: 0, y: 0, z: 120 }, scale: 1.0, color: "#C5A059", description: "Draped in liquid gold aesthetic with seamless fluid round curves." },
      { name: "Solid Gold Chrono Hands", offset: { x: 0, y: 0, z: 70 }, scale: 0.95, color: "#C5A059", description: "Solid 24k gold, diamond-cut hands with geometric skeletal cutouts." },
      { name: "Gold-Vein Sapphire Conduit Ring", offset: { x: 0, y: 0, z: 30 }, scale: 0.9, color: "rgba(197, 160, 89, 0.2)", description: "Liquid-crystal digital channels on gold-laced obsidian." },
      { name: "AL-1002 Kinetic Perpetual Movement", offset: { x: 0, y: -30, z: -30 }, scale: 0.85, color: "#C5A059", description: "Skeletal micro-rotor system spinning on high-density ceramic." },
      { name: "Exhibition Solid Gold Monobloc Back", offset: { x: 0, y: -120, z: -120 }, scale: 0.95, color: "#221c03", description: "Individually numbered from 001 to 100 with laser authentication badges." }
    ]
  },
  {
    id: "zenith",
    name: "AETHERIS ZENITH",
    tagline: "Elysium Premium Champagne Platinum",
    description: "The peak of high-end mechanical engineering. Crafted in highly dense cryogenic-purified Platinum with a brushed champagne glow indicator and super-fluid silicon balance wheels.",
    price: 395000,
    rating: 5.0,
    specs: {
      case: "Cryo-Purified Solid Platinum alloy, Hand-Finished, 43mm",
      bezel: "Ice-Champagne Carbon-Quartz Nanocrystal Armor composite",
      caliber: "Silicon Nanotech Caliber AL-0001, Ultra-High Frequency",
      reserve: "80 Hours Power Reserve (Holographic Cryo Dial)",
      waterproof: "200 Meters / 20 Bar Certified Professional Divers",
      glass: "Cryogenic Anti-Glare Specular Diamond-Cut Sapphire",
    },
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800",
    primaryColor: "#E0D8D0", // Champagne White
    secondaryColor: "#C5A059", // Soft Gold
    lightGlow: "#C5A059",
    category: "Elysium",
    explodedParts: [
      { name: "Ice-Specular Diamond Armor Glass", offset: { x: 0, y: 0, z: 180 }, scale: 1.05, color: "rgba(224, 216, 208, 0.15)", description: "Diamond-grade crystal with molecular blue anti-abrasion armor." },
      { name: "Platinum Cryo-Nanotexture Bezel", offset: { x: 0, y: 0, z: 120 }, scale: 1.0, color: "#C5A059", description: "Satin brushed platinum borders with custom engraved numerals." },
      { name: "Cryo-Indicator Skeletal Pointers", offset: { x: 0, y: 0, z: 70 }, scale: 0.95, color: "#E0D8D0", description: "Deep blue and icy-white indicators with sweeping super-smooth speed." },
      { name: "Holographic Cryo Dial Shield", offset: { x: 0, y: 0, z: 30 }, scale: 0.9, color: "rgba(197, 160, 89, 0.25)", description: "Ultra-thin mesh substrate supporting ice-blue LED conduit ports." },
      { name: "AL-0001 High Frequency Silicon Core", offset: { x: 0, y: -30, z: -30 }, scale: 0.85, color: "#C5A059", description: "Silicon mechanism operating magnetically with zero structural friction." },
      { name: "Cold-Sealed Platinum Solid Backing", offset: { x: 0, y: -120, z: -120 }, scale: 0.95, color: "#111827", description: "Monolithic solid state engine backing engraved with pressure indices." }
    ]
  }
];
