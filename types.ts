export interface WatchModel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  rating: number;
  specs: {
    case: string;
    bezel: string;
    caliber: string;
    reserve: string;
    waterproof: string;
    glass: string;
  };
  image: string;
  primaryColor: string; // Hex or tailwind color class
  secondaryColor: string;
  lightGlow: string; // for ambient shading
  category: "Stealth" | "Interstellar" | "Liquid Gold" | "Elysium";
  explodedParts: Array<{
    name: string;
    offset: { x: number; y: number; z: number };
    scale: number;
    color: string;
    description: string;
  }>;
}

export interface CartItem {
  product: WatchModel;
  quantity: number;
  engraving?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "concierge" | "system";
  text: string;
  timestamp: string;
}
