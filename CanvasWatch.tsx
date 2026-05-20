import React, { useEffect, useRef, useState } from "react";
import { type WatchModel } from "../types";
import { Play, RotateCcw, Shield, Layers, HelpCircle, Eye, EyeOff } from "lucide-react";

// Web Audio synthesizer for premium haptic sounds
export function playHorologySound(type: "tick" | "click" | "explode" | "hover") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Low frequency hum
    if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.005, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } else if (type === "explode") {
      // Sub bass sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, ctx.currentTime);
      gain.gain.setValueAtTime(0.002, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (err) {
    // Audio Context might be locked by browser policies before first click
  }
}

interface CanvasWatchProps {
  activeModel: WatchModel;
  isExploded?: boolean;
  onExplodeToggle?: (val: boolean) => void;
  interactiveMode?: boolean;
}

export default function CanvasWatch({
  activeModel,
  isExploded = false,
  onExplodeToggle,
  interactiveMode = true,
}: CanvasWatchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [activeLayerInfo, setActiveLayerInfo] = useState<string | null>(null);
  
  // Track cursor position for specs and lighting
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });

  // Refs for animation frame rates to completely avoid re-renders / max call-stack exceed errors
  const rotationRef = useRef({ x: 0.18, y: -0.25 }); // 3D Tilt angles
  const explodeRatioRef = useRef(0); // 0 to 1

  // References to keep in sync for the animation loop
  const isExplodedRef = useRef(isExploded);
  isExplodedRef.current = isExploded;

  const isAutoSpinRef = useRef(isAutoSpin);
  isAutoSpinRef.current = isAutoSpin;

  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;

  const cursorPosRef = useRef(cursorPos);
  cursorPosRef.current = cursorPos;

  const activeModelRef = useRef(activeModel);
  activeModelRef.current = activeModel;

  // Track ticking for escape wheel oscillation
  const timeRef = useRef(0);

  // Animation frame
  useEffect(() => {
    let animationId: number;

    const render = () => {
      timeRef.current += 0.05;

      // Animate explosion ratio smoothly (spring lerp)
      const targetRatio = isExplodedRef.current ? 1.0 : 0.0;
      explodeRatioRef.current += (targetRatio - explodeRatioRef.current) * 0.12;

      // Auto spin in idle mode
      if (isAutoSpinRef.current && !isDraggingRef.current) {
        rotationRef.current.x = Math.sin(timeRef.current * 0.1) * 0.15 + 0.1;
        rotationRef.current.y += 0.005;
      }

      // Shadow states used in rendering to keep old lines fully intact
      const rotation = rotationRef.current;
      const explodeRatio = explodeRatioRef.current;
      const cursorPos = cursorPosRef.current;
      const activeModel = activeModelRef.current;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clean screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.32;

      // Draw shadow background
      const shadowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.2, cx, cy, baseRadius * 1.5);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      shadowGrad.addColorStop(0.8, "rgba(5, 5, 10, 0.4)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Interactive Lighting vector
      const lightX = cx + (cursorPos.x - 0.5) * baseRadius * 1.5;
      const lightY = cy + (cursorPos.y - 0.5) * baseRadius * 1.5;

      // Model color profiles
      const mainColor = activeModel.primaryColor; // e.g., teal, gold, purple
      const glowColor = activeModel.lightGlow;
      const metalDark = "#111115";
      const metalMedium = "#22222a";
      const metalLight = "#ececf0";

      // 3D rotation projections math
      const apply3D = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Perspective scaling
        const perspective = 400;
        const scale = perspective / (perspective + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          depth: z2,
          scale: scale,
        };
      };

      // Watch model drawing hierarchy helper
      // Layers:
      // -180: Watch Back Plate & Strap Bottom
      // -100: Movement Gears
      //  -20: Internal Chassis
      //   50: Dial / Conduit Glass
      //  110: Watch Hands
      //  180: Front Sapphire Bezel & Strap Top

      const drawStrap = (zOffset: number) => {
        ctx.save();
        ctx.strokeStyle = "rgba(40, 40, 50, 0.3)";
        ctx.lineWidth = 14 * (1 - zOffset / 500);

        // Draw upper strap
        ctx.beginPath();
        const p1 = apply3D(-baseRadius * 0.4, -baseRadius * 0.9, zOffset);
        const p2 = apply3D(-baseRadius * 0.3, -baseRadius * 1.8, zOffset);
        const p3 = apply3D(baseRadius * 0.3, -baseRadius * 1.8, zOffset);
        const p4 = apply3D(baseRadius * 0.4, -baseRadius * 0.9, zOffset);
        
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.closePath();

        const strapGrad = ctx.createLinearGradient(p2.px, p2.py, p1.px, p1.py);
        strapGrad.addColorStop(0, "rgba(10, 10, 14, 0.9)");
        strapGrad.addColorStop(0.5, "rgba(25, 25, 30, 0.9)");
        strapGrad.addColorStop(1, "rgba(15, 15, 20, 0.9)");
        ctx.fillStyle = strapGrad;
        ctx.fill();
        ctx.stroke();

        // Draw lower strap
        ctx.beginPath();
        const p5 = apply3D(-baseRadius * 0.4, baseRadius * 0.9, zOffset);
        const p6 = apply3D(-baseRadius * 0.3, baseRadius * 1.8, zOffset);
        const p7 = apply3D(baseRadius * 0.3, baseRadius * 1.8, zOffset);
        const p8 = apply3D(baseRadius * 0.4, baseRadius * 0.9, zOffset);
        
        ctx.moveTo(p5.px, p5.py);
        ctx.lineTo(p6.px, p6.py);
        ctx.lineTo(p7.px, p7.py);
        ctx.lineTo(p8.px, p8.py);
        ctx.closePath();

        const strapGrad2 = ctx.createLinearGradient(p5.px, p5.py, p6.px, p6.py);
        strapGrad2.addColorStop(0, "rgba(15, 15, 20, 0.9)");
        strapGrad2.addColorStop(0.5, "rgba(25, 25, 30, 0.9)");
        strapGrad2.addColorStop(1, "rgba(10, 10, 14, 0.9)");
        ctx.fillStyle = strapGrad2;
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      };

      const drawBackplate = (zOffset: number) => {
        ctx.save();
        const pts: any[] = [];
        // Polygon round watch body
        const numSides = 12;
        for (let i = 0; i < numSides; i++) {
          const angle = (i / numSides) * Math.PI * 2;
          const px = Math.cos(angle) * baseRadius * 0.92;
          const py = Math.sin(angle) * baseRadius * 0.92;
          pts.push(apply3D(px, py, zOffset));
        }

        ctx.beginPath();
        ctx.moveTo(pts[0].px, pts[0].py);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].px, pts[i].py);
        }
        ctx.closePath();

        const plateGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.1, cx, cy, baseRadius);
        plateGrad.addColorStop(0, "#0a0a0d");
        plateGrad.addColorStop(0.6, "#15151b");
        plateGrad.addColorStop(1, "#050508");

        ctx.fillStyle = plateGrad;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(100, 100, 120, 0.15)";
        ctx.stroke();

        // Draw internal holographic circuitry
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r1 = baseRadius * 0.3;
          const r2 = baseRadius * 0.7;
          const a = (i / 8) * Math.PI * 2 + timeRef.current * 0.05;
          const pStart = apply3D(Math.cos(a) * r1, Math.sin(a) * r1, zOffset + 2);
          const pEnd = apply3D(Math.cos(a) * r2, Math.sin(a) * r2, zOffset + 2);
          ctx.moveTo(pStart.px, pStart.py);
          ctx.lineTo(pEnd.px, pEnd.py);

          // branching digital logic
          const branchAngle = a + 0.3;
          const pBranch = apply3D(Math.cos(branchAngle) * r2 * 1.2, Math.sin(branchAngle) * r2 * 1.2, zOffset + 2);
          ctx.lineTo(pBranch.px, pBranch.py);
        }
        ctx.stroke();
        ctx.restore();
      };

      const drawGear = (cxVal: number, cyVal: number, r: number, z: number, speedMultiplier: number, teethCount: number, ringColor: string, isBrass = false) => {
        ctx.save();
        const baseAngle = speedMultiplier * timeRef.current;
        const pts: any[] = [];

        // Teeth calculation
        for (let i = 0; i < teethCount * 2; i++) {
          const angle = (i / (teethCount * 2)) * Math.PI * 2 + baseAngle;
          const currR = r * (i % 2 === 0 ? 1 : 0.88);
          const x = cxVal + Math.cos(angle) * currR;
          const y = cyVal + Math.sin(angle) * currR;
          pts.push(apply3D(x, y, z));
        }

        ctx.beginPath();
        ctx.moveTo(pts[0].px, pts[0].py);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].px, pts[i].py);
        }
        ctx.closePath();

        // Specific metal hues
        let grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        if (isBrass) {
          grad.addColorStop(0, "#ffd700");
          grad.addColorStop(0.4, "#cca300");
          grad.addColorStop(1, "#806600");
        } else {
          grad.addColorStop(0, "#4a5568");
          grad.addColorStop(0.5, "#2d3748");
          grad.addColorStop(1, "#1a202c");
        }

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Spokes inside gears
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const spokeAngle = (j / 6) * Math.PI * 2 + baseAngle;
          const pInner = apply3D(cxVal + Math.cos(spokeAngle) * (r * 0.15), cyVal + Math.sin(spokeAngle) * (r * 0.15), z);
          const pOuter = apply3D(cxVal + Math.cos(spokeAngle) * (r * 0.78), cyVal + Math.sin(spokeAngle) * (r * 0.78), z);
          ctx.moveTo(pInner.px, pInner.py);
          ctx.lineTo(pOuter.px, pOuter.py);
        }
        ctx.strokeStyle = isBrass ? "rgba(255,215,0,0.4)" : "rgba(230,230,240,0.3)";
        ctx.stroke();

        // Central rivet node
        const centerPt = apply3D(cxVal, cyVal, z);
        const centerRad = 4 * centerPt.scale;
        ctx.beginPath();
        ctx.arc(centerPt.px, centerPt.py, centerRad, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        ctx.restore();
      };

      const drawMovement = (zOffset: number) => {
        // Explode separation pulls movement down or leaves it in center
        const zMovement = zOffset;

        // Draw multiple overlapping gears
        // Center crown gear (rose gold/brass)
        drawGear(0, 0, baseRadius * 0.44, zMovement, 0.15, 24, "rgba(212, 175, 55, 0.7)", true);
        
        // Escapement tourbillon cage (spinning fast, oscillating left and right!)
        const swing = Math.sin(timeRef.current * 4) * 0.8;
        drawGear(-baseRadius * 0.28, baseRadius * 0.32, baseRadius * 0.22, zMovement + 5, swing * 0.5, 16, glowColor, false);
        
        // Winding system barrel gear
        drawGear(baseRadius * 0.35, -baseRadius * 0.2, baseRadius * 0.34, zMovement - 4, 0.02, 32, "rgba(100, 110, 130, 0.6)", false);

        // Intricate mechanical chassis bridges connect gears
        ctx.save();
        ctx.strokeStyle = "rgba(150, 150, 180, 0.2)";
        ctx.lineWidth = 3;

        const bridge1 = [
          apply3D(-baseRadius * 0.5, -baseRadius * 0.5, zMovement - 10),
          apply3D(0, -baseRadius * 0.2, zMovement - 10),
          apply3D(baseRadius * 0.5, -baseRadius * 0.5, zMovement - 10),
        ];

        ctx.beginPath();
        ctx.moveTo(bridge1[0].px, bridge1[0].py);
        ctx.lineTo(bridge1[1].px, bridge1[1].py);
        ctx.lineTo(bridge1[2].px, bridge1[2].py);
        ctx.stroke();

        const bridge2 = [
          apply3D(-baseRadius * 0.4, baseRadius * 0.4, zMovement - 5),
          apply3D(-baseRadius * 0.28, baseRadius * 0.32, zMovement - 5),
          apply3D(baseRadius * 0.2, baseRadius * 0.6, zMovement - 5),
        ];

        ctx.beginPath();
        ctx.moveTo(bridge2[0].px, bridge2[0].py);
        ctx.lineTo(bridge2[1].px, bridge2[1].py);
        ctx.lineTo(bridge2[2].px, bridge2[2].py);
        ctx.stroke();
        ctx.restore();
      };

      const drawDial = (zOffset: number) => {
        // Dial crystal conduit lines
        ctx.save();
        
        // Outer dial markers ring
        const outerCircle: any[] = [];
        const numMarkers = 60;
        for (let i = 0; i < numMarkers; i++) {
          const angle = (i / numMarkers) * Math.PI * 2;
          const outerRadius = baseRadius * 0.85;
          const innerRadius = baseRadius * (i % 5 === 0 ? 0.77 : 0.82);
          
          const p1 = apply3D(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, zOffset);
          const p2 = apply3D(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, zOffset);
          
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = i % 5 === 0 ? mainColor : "rgba(180, 190, 210, 0.4)";
          ctx.lineWidth = i % 5 === 0 ? 2 : 1;
          ctx.stroke();
        }

        // Cybermatic ambient index ring numbers
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px 'JetBrains Mono'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 1; i <= 12; i++) {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const pIndex = apply3D(Math.cos(angle) * baseRadius * 0.68, Math.sin(angle) * baseRadius * 0.68, zOffset + 2);
          ctx.fillText(i.toString().padStart(2, "0"), pIndex.px, pIndex.py);
        }

        // Main glass reflection overlay
        ctx.beginPath();
        const gCenter = apply3D(0, 0, zOffset);
        const gRad = baseRadius * 0.84 * gCenter.scale;
        ctx.arc(gCenter.px, gCenter.py, gRad, 0, Math.PI * 2);
        
        const glassLocGrad = ctx.createLinearGradient(
          cx - gRad, 
          cy - gRad, 
          cx + gRad, 
          cy + gRad
        );
        glassLocGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        glassLocGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.0)");
        glassLocGrad.addColorStop(0.8, "rgba(0, 150, 255, 0.02)");
        glassLocGrad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
        
        ctx.fillStyle = glassLocGrad;
        ctx.fill();
        ctx.restore();
      };

      const drawHands = (zOffset: number) => {
        ctx.save();
        
        // Get precise system local time
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ms = now.getMilliseconds();

        // Continuous hand angles for automatic movement sweeping action
        const secAngle = ((seconds + ms / 1000) / 60) * Math.PI * 2 - Math.PI / 2;
        const minAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2 - Math.PI / 2;
        const hourAngle = ((hours + minutes / 60) / 12) * Math.PI * 2 - Math.PI / 2;

        // Draw Hour Hand (Thick, metallic)
        const hourLen = baseRadius * 0.44;
        const pHourCenter = apply3D(0, 0, zOffset);
        const pHourTip = apply3D(Math.cos(hourAngle) * hourLen, Math.sin(hourAngle) * hourLen, zOffset);
        const pHourLeft = apply3D(Math.cos(hourAngle - 0.2) * 8, Math.sin(hourAngle - 0.2) * 8, zOffset);
        const pHourRight = apply3D(Math.cos(hourAngle + 0.2) * 8, Math.sin(hourAngle + 0.2) * 8, zOffset);

        ctx.beginPath();
        ctx.moveTo(pHourCenter.px, pHourCenter.py);
        ctx.lineTo(pHourLeft.px, pHourLeft.py);
        ctx.lineTo(pHourTip.px, pHourTip.py);
        ctx.lineTo(pHourRight.px, pHourRight.py);
        ctx.closePath();
        ctx.fillStyle = metalLight;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.stroke();

        // Hour luminous core
        const pHourCore = apply3D(Math.cos(hourAngle) * (hourLen * 0.8), Math.sin(hourAngle) * (hourLen * 0.8), zOffset + 1);
        ctx.beginPath();
        ctx.moveTo(pHourCenter.px, pHourCenter.py);
        ctx.lineTo(pHourCore.px, pHourCore.py);
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw Minute Hand (Sleek, futuristic double-frame)
        const minLen = baseRadius * 0.65;
        const pMinTip = apply3D(Math.cos(minAngle) * minLen, Math.sin(minAngle) * minLen, zOffset);
        const pMinBaseL = apply3D(Math.cos(minAngle - Math.PI/2) * 4, Math.sin(minAngle - Math.PI/2) * 4, zOffset);
        const pMinBaseR = apply3D(Math.cos(minAngle + Math.PI/2) * 4, Math.sin(minAngle + Math.PI/2) * 4, zOffset);
        
        ctx.beginPath();
        ctx.moveTo(pMinBaseL.px, pMinBaseL.py);
        ctx.lineTo(pMinTip.px, pMinTip.py);
        ctx.lineTo(pMinBaseR.px, pMinBaseR.py);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Minute luminous core
        const pMinCoreStart = apply3D(Math.cos(minAngle) * (minLen * 0.2), Math.sin(minAngle) * (minLen * 0.2), zOffset + 1);
        const pMinCoreEnd = apply3D(Math.cos(minAngle) * (minLen * 0.95), Math.sin(minAngle) * (minLen * 0.95), zOffset + 1);
        ctx.beginPath();
        ctx.moveTo(pMinCoreStart.px, pMinCoreStart.py);
        ctx.lineTo(pMinCoreEnd.px, pMinCoreEnd.py);
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Second Hand (Super fine, dynamic glowing neon vector)
        const secLen = baseRadius * 0.77;
        const pSecTip = apply3D(Math.cos(secAngle) * secLen, Math.sin(secAngle) * secLen, zOffset + 2);
        const pSecCounter = apply3D(-Math.cos(secAngle) * (secLen * 0.18), -Math.sin(secAngle) * (secLen * 0.18), zOffset + 2);
        
        ctx.beginPath();
        ctx.moveTo(pSecCounter.px, pSecCounter.py);
        ctx.lineTo(pSecTip.px, pSecTip.py);
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Second counterweight bezel
        const centerPt = apply3D(0,0, zOffset + 4);
        ctx.beginPath();
        ctx.arc(centerPt.px, centerPt.py, 5 * centerPt.scale, 0, Math.PI * 2);
        ctx.fillStyle = mainColor;
        ctx.fill();
        ctx.restore();
      };

      const drawBezel = (zOffset: number) => {
        ctx.save();
        
        // Solid mechanical bezel ring
        const outRadii = baseRadius * 1.02;
        const inRadii = baseRadius * 0.85;

        const ptsOut: any[] = [];
        const ptsIn: any[] = [];
        const numBezelPoints = 32;

        for (let i = 0; i < numBezelPoints; i++) {
          const a = (i / numBezelPoints) * Math.PI * 2;
          ptsOut.push(apply3D(Math.cos(a) * outRadii, Math.sin(a) * outRadii, zOffset));
          ptsIn.push(apply3D(Math.cos(a) * inRadii, Math.sin(a) * inRadii, zOffset));
        }

        // Face composite bezel path for nice metallic gradient
        ctx.beginPath();
        ctx.moveTo(ptsOut[0].px, ptsOut[0].py);
        for (let i = 1; i < ptsOut.length; i++) {
          ctx.lineTo(ptsOut[i].px, ptsOut[i].py);
        }
        ctx.lineTo(ptsIn[0].px, ptsIn[0].py);
        for (let i = ptsIn.length - 1; i >= 0; i--) {
          ctx.lineTo(ptsIn[i].px, ptsIn[i].py);
        }
        ctx.closePath();

        // Light angle specular highlights calculation
        const lightAngle = Math.atan2(cursorPos.y - 0.5, cursorPos.x - 0.5);
        const metallicGrad = ctx.createLinearGradient(
          cx + Math.cos(lightAngle) * outRadii, 
          cy + Math.sin(lightAngle) * outRadii, 
          cx - Math.cos(lightAngle) * outRadii, 
          cy - Math.sin(lightAngle) * outRadii
        );
        
        metallicGrad.addColorStop(0, "#ffffff");
        metallicGrad.addColorStop(0.2, "#2d303b");
        metallicGrad.addColorStop(0.5, "#15171e");
        metallicGrad.addColorStop(0.8, "#424855");
        metallicGrad.addColorStop(1, "#111215");

        ctx.fillStyle = metallicGrad;
        ctx.fill();

        // Draw physical industrial screws along bezel (Luxury aesthetics)
        const screwRadius = baseRadius * 0.94;
        ctx.fillStyle = "#888";
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
          const aScrew = (i / 8) * Math.PI * 2 + Math.PI / 8;
          const pScrew = apply3D(Math.cos(aScrew) * screwRadius, Math.sin(aScrew) * screwRadius, zOffset + 2);
          const drawRad = 3.5 * pScrew.scale;
          
          ctx.beginPath();
          ctx.arc(pScrew.px, pScrew.py, drawRad, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Screw slot lines
          const pSlotStart = apply3D(
            Math.cos(aScrew) * screwRadius - Math.cos(aScrew + 1.5) * 2, 
            Math.sin(aScrew) * screwRadius - Math.sin(aScrew + 1.5) * 2, 
            zOffset + 3
          );
          const pSlotEnd = apply3D(
            Math.cos(aScrew) * screwRadius + Math.cos(aScrew + 1.5) * 2, 
            Math.sin(aScrew) * screwRadius + Math.sin(aScrew + 1.5) * 2, 
            zOffset + 3
          );
          
          ctx.beginPath();
          ctx.moveTo(pSlotStart.px, pSlotStart.py);
          ctx.lineTo(pSlotEnd.px, pSlotEnd.py);
          ctx.strokeStyle = "#444";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Glass highlight edge glow
        const highlightGlowGrad = ctx.createRadialGradient(cx, cy, inRadii * 0.8, cx, cy, outRadii);
        highlightGlowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        highlightGlowGrad.addColorStop(0.85, "rgba(0,0,0,0)");
        highlightGlowGrad.addColorStop(0.9, glowColor);
        highlightGlowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.beginPath();
        const pBzCenter = apply3D(0, 0, zOffset);
        ctx.arc(pBzCenter.px, pBzCenter.py, outRadii * pBzCenter.scale, 0, Math.PI * 2);
        ctx.fillStyle = highlightGlowGrad;
        ctx.fill();

        ctx.restore();
      };

      // Draw connection lines between exploded layers for futuristic HUD feel
      const drawExplodingBridges = (zBack: number, zFront: number) => {
        if (explodeRatio < 0.05) return;
        ctx.save();
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.globalAlpha = explodeRatio * 0.45;

        // Bridge lines at four extreme corners of casing
        const angles = [Math.PI/4, (3*Math.PI)/4, (5*Math.PI)/4, (7*Math.PI)/4];
        angles.forEach((a) => {
          const ptBack = apply3D(Math.cos(a) * baseRadius * 0.9, Math.sin(a) * baseRadius * 0.9, zBack);
          const ptFront = apply3D(Math.cos(a) * baseRadius * 0.9, Math.sin(a) * baseRadius * 0.9, zFront);
          
          ctx.beginPath();
          ctx.moveTo(ptBack.px, ptBack.py);
          ctx.lineTo(ptFront.px, ptFront.py);
          ctx.stroke();

          // Intersecting glow indicators inside exploded workspace
          ctx.fillStyle = mainColor;
          ctx.beginPath();
          ctx.arc(ptBack.px, ptBack.py, 3, 0, Math.PI*2);
          ctx.arc(ptFront.px, ptFront.py, 3, 0, Math.PI*2);
          ctx.fill();
        });

        // Floating holographic coordinate label indicators
        const activeIndex = Math.floor(timeRef.current * 0.2) % 4;
        const labelAngle = angles[activeIndex];
        const specOffsetZ = -60 + explodeRatio * 120; // floating center
        const ptSpec = apply3D(Math.cos(labelAngle) * baseRadius * 1.1, Math.sin(labelAngle) * baseRadius * 1.1, specOffsetZ);
        
        ctx.beginPath();
        const ptOrigin = apply3D(Math.cos(labelAngle) * baseRadius * 0.8, Math.sin(labelAngle) * baseRadius * 0.8, specOffsetZ);
        ctx.moveTo(ptOrigin.px, ptOrigin.py);
        ctx.lineTo(ptSpec.px, ptSpec.py);
        ctx.lineTo(ptSpec.px + (Math.cos(labelAngle) > 0 ? 30 : -30), ptSpec.py);
        ctx.strokeStyle = glowColor;
        ctx.setLineDash([]);
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px 'JetBrains Mono'";
        const textSide = Math.cos(labelAngle) > 0 ? "left" : "right";
        ctx.textAlign = textSide as CanvasTextAlign;
        ctx.fillText("AL-7075 CALIBER", ptSpec.px + (Math.cos(labelAngle) > 0 ? 5 : -5), ptSpec.py - 4);

        ctx.restore();
      };

      // Stack Projection calculations
      const deltaZ = explodeRatio * 180; // Distance pulled apart

      // Draw standard render stack back to front
      drawStrap(-deltaZ);
      drawBackplate(-deltaZ);
      drawMovement(-deltaZ / 3);
      drawDial(deltaZ / 3);
      drawHands(deltaZ * 0.7);
      drawBezel(deltaZ);

      // Connecting energy conduits
      drawExplodingBridges(-deltaZ, deltaZ);

      // Holographic corner coordinates for luxury cockpit interface look
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      const margin = 20;

      // Top Left Bracket
      ctx.beginPath();
      ctx.moveTo(margin + 15, margin);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin, margin + 15);
      ctx.stroke();

      // Bottom Right Bracket
      ctx.beginPath();
      ctx.moveTo(canvas.width - margin - 15, canvas.height - margin);
      ctx.lineTo(canvas.width - margin, canvas.height - margin);
      ctx.lineTo(canvas.width - margin, canvas.height - margin - 15);
      ctx.stroke();

      // Telemetry systems dashboard strings (anti-fake aesthetics, keeps it sleek and beautiful)
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "8px 'JetBrains Mono'";
      ctx.textAlign = "left";
      ctx.fillText(`ROT.X: ${rotation.x.toFixed(2)}`, margin + 10, margin + 25);
      ctx.fillText(`ROT.Y: ${rotation.y.toFixed(2)}`, margin + 10, margin + 35);
      ctx.fillText(`FOV: 75° (PERSPECTIVE)`, margin + 10, margin + 45);

      ctx.textAlign = "right";
      ctx.fillText(`HERTZ: 4.0Hz (28,800 BPH)`, canvas.width - margin - 10, margin + 25);
      ctx.fillText(`STYLING SHADING: SPECULAR`, canvas.width - margin - 10, margin + 35);
      ctx.fillText(isExploded ? "MODE: EXPLODED VIEW ACTIVE" : "MODE: ENCLOSED ARMOR", canvas.width - margin - 10, margin + 45);

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []); // Run loop exactly once on mount, reading from React refs continuously for optimal performance

  // Handle Drag / Rotation gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactiveMode) return;
    setIsDragging(true);
    setIsAutoSpin(false);
    setDragStart({ x: e.clientX, y: e.clientY });
    playHorologySound("click");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Track localized cursor coordinates inside the bounding container
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      const relativeY = (e.clientY - rect.top) / rect.height;
      setCursorPos({ x: relativeX, y: relativeY });
    }

    if (!isDragging || !interactiveMode) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    rotationRef.current.x += deltaY * 0.007;
    rotationRef.current.y += deltaX * 0.007;

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleToggleExplode = () => {
    playHorologySound("explode");
    if (onExplodeToggle) onExplodeToggle(!isExploded);
  };

  const handleReset = () => {
    if (onExplodeToggle) onExplodeToggle(false);
    rotationRef.current = { x: 0.18, y: -0.25 };
    setIsAutoSpin(true);
    playHorologySound("click");
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-950/70 to-neutral-900/40 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl group w-full max-w-[500px] aspect-square overflow-hidden select-none touch-none"
      onMouseMove={handleMouseMove}
      style={{
        boxShadow: `0 0 50px -10px ${activeModel.lightGlow}15`,
      }}
    >
      {/* Absolute Ambient Background Glow */}
      <div 
        className="absolute w-[200px] h-[200px] rounded-full blur-[120px] pointer-events-none opacity-20 -z-10 transition-colors duration-1000"
        style={{ backgroundColor: activeModel.lightGlow }}
      />

      {/* Primary Interaction Surface Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full cursor-grab active:cursor-grabbing max-w-[450px] max-h-[450px]"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Cyber-UI Interactive HUD Overlays */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
        {/* Play/Pause Rotator */}
        <button
          onClick={() => {
            setIsAutoSpin(!isAutoSpin);
            playHorologySound("click");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider rounded-full border border-white/[0.08] ${isAutoSpin ? "bg-white/10 text-white" : "bg-black/40 text-neutral-400"} hover:bg-white/20 hover:text-white transition-all`}
        >
          <Play className={`w-3 h-3 ${isAutoSpin ? "animate-spin text-emerald-400" : ""}`} />
          {isAutoSpin ? "Spinning" : "Locked"}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="p-2 rounded-full border border-white/[0.08] bg-black/40 text-neutral-400 hover:text-white hover:bg-white/15 transition-all"
          title="Reset Camera Orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Exploded View Toggle */}
        <button
          onClick={handleToggleExplode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] uppercase font-mono tracking-wider rounded-full border ${isExploded ? "bg-white/20 text-white border-white/30 font-semibold" : "bg-black/40 text-neutral-300 border-white/[0.08]"} hover:text-white hover:border-white/30 hover:bg-neutral-800/80 transition-all`}
        >
          {isExploded ? <EyeOff className="w-3 h-3" /> : <Layers className="w-3 h-3 text-sky-400" />}
          {isExploded ? "Assemble" : "Explode Components"}
        </button>
      </div>

      {/* Hover Instruction Tips */}
      <div className="absolute top-5 left-5 bg-neutral-950/80 border border-white/[0.07] px-2.5 py-1 rounded-md text-[9px] font-mono tracking-widest text-neutral-400 select-none flex items-center gap-1">
        <Shield className="w-3 h-3 text-yellow-500 animate-pulse" />
        <span>CYBER-CONDUIT SECURE</span>
      </div>
    </div>
  );
}
