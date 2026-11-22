"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Polyhedron3D {
  center: Point3D;
  vertices: Point3D[];
  edges: [number, number][];
  rx: number;
  ry: number;
  rz: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 40;
      targetMouseY = (e.clientY / height - 0.5) * 30;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize 3D Floating Polyhedra (wireframe financial crystals)
    const polyhedra: Polyhedron3D[] = [];
    const polyCount = 5;

    // Standard cube vertices
    const cubeBaseVertices: Point3D[] = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];
    const cubeEdges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    for (let i = 0; i < polyCount; i++) {
      polyhedra.push({
        center: {
          x: (Math.random() - 0.5) * width * 0.9,
          y: (Math.random() - 0.5) * height * 0.8,
          z: Math.random() * 400 + 350,
        },
        vertices: cubeBaseVertices.map((v) => ({ ...v })),
        edges: cubeEdges,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        vx: (Math.random() - 0.5) * 0.006,
        vy: (Math.random() - 0.5) * 0.008,
        vz: (Math.random() - 0.5) * 0.005,
        size: Math.random() * 24 + 20,
      });
    }

    // Floating market wave pulses
    let waveTick = 0;
    const isLight = theme === "light";

    // 3D Perspective Projection helper
    const project = (
      p: Point3D,
      camZ: number = 600
    ): { x: number; y: number; scale: number; visible: boolean } => {
      const z = p.z + camZ;
      if (z <= 10) return { x: 0, y: 0, scale: 0, visible: false };
      const scale = camZ / z;
      return {
        x: p.x * scale + width / 2 + currentMouseX * scale,
        y: p.y * scale + height / 2 + currentMouseY * scale,
        scale,
        visible: true,
      };
    };

    // Main render loop
    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      waveTick += 0.015;

      // ── 1. 3D Isometric Horizon Financial Grid ──────────────────────
      const gridRows = 16;
      const gridCols = 20;
      const cellWidth = 90;
      const cellDepth = 70;
      const startZ = 120;
      const groundY = height * 0.28;

      ctx.lineWidth = 0.6;

      // Draw Depth Lines (Z-lines)
      for (let c = -gridCols / 2; c <= gridCols / 2; c++) {
        ctx.beginPath();
        let started = false;

        for (let r = 0; r < gridRows; r++) {
          const z = startZ + r * cellDepth;
          const x = c * cellWidth;
          // Gentle wave elevation
          const y = groundY + Math.sin(waveTick + r * 0.4 + c * 0.2) * 14;

          const proj = project({ x, y, z });
          if (!proj.visible) continue;

          if (!started) {
            ctx.moveTo(proj.x, proj.y);
            started = true;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }

        const alpha = Math.max(0.04, 0.18 - Math.abs(c) * 0.015);
        ctx.strokeStyle = isLight
          ? `rgba(37, 99, 235, ${alpha * 0.6})`
          : `rgba(56, 189, 248, ${alpha})`;
        ctx.stroke();
      }

      // Draw Transverse Waves (X-lines)
      for (let r = 0; r < gridRows; r++) {
        ctx.beginPath();
        let started = false;
        const z = startZ + r * cellDepth;

        for (let c = -gridCols / 2; c <= gridCols / 2; c++) {
          const x = c * cellWidth;
          const y = groundY + Math.sin(waveTick + r * 0.4 + c * 0.2) * 14;

          const proj = project({ x, y, z });
          if (!proj.visible) continue;

          if (!started) {
            ctx.moveTo(proj.x, proj.y);
            started = true;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }

        const rFade = (1.0 - r / gridRows) * (isLight ? 0.08 : 0.16);
        ctx.strokeStyle = isLight
          ? `rgba(37, 99, 235, ${rFade})`
          : `rgba(34, 211, 238, ${rFade})`;
        ctx.stroke();
      }

      // ── 2. Rotating 3D Geometric Polyhedra (Financial Nodes) ────────
      for (const poly of polyhedra) {
        poly.rx += poly.vx;
        poly.ry += poly.vy;
        poly.rz += poly.vz;

        // Rotate vertices around poly center
        const projectedVertices: { x: number; y: number; visible: boolean }[] = [];

        const cosX = Math.cos(poly.rx), sinX = Math.sin(poly.rx);
        const cosY = Math.cos(poly.ry), sinY = Math.sin(poly.ry);
        const cosZ = Math.cos(poly.rz), sinZ = Math.sin(poly.rz);

        for (const v of poly.vertices) {
          // Scale
          let vx = v.x * poly.size;
          let vy = v.y * poly.size;
          let vz = v.z * poly.size;

          // Rotate X
          const y1 = vy * cosX - vz * sinX;
          const z1 = vy * sinX + vz * cosX;
          // Rotate Y
          const x2 = vx * cosY + z1 * sinY;
          const z2 = -vx * sinY + z1 * cosY;
          // Rotate Z
          const x3 = x2 * cosZ - y1 * sinZ;
          const y3 = x2 * sinZ + y1 * cosZ;

          // Translate to center position
          const worldPoint: Point3D = {
            x: poly.center.x + x3,
            y: poly.center.y + y3,
            z: poly.center.z + z2,
          };

          const p = project(worldPoint);
          projectedVertices.push(p);
        }

        // Draw wireframe edges
        ctx.beginPath();
        for (const [i1, i2] of poly.edges) {
          const p1 = projectedVertices[i1];
          const p2 = projectedVertices[i2];
          if (p1.visible && p2.visible) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }

        ctx.lineWidth = 0.8;
        ctx.strokeStyle = isLight
          ? "rgba(37, 99, 235, 0.22)"
          : "rgba(56, 189, 248, 0.35)";
        ctx.stroke();

        // Draw vertex glowing dots
        for (const p of projectedVertices) {
          if (!p.visible) continue;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = isLight
            ? "rgba(16, 185, 129, 0.45)"
            : "rgba(34, 211, 238, 0.7)";
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Fallback CSS ambient mesh gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060D1A]/50 to-[#040810]/90 dark:block hidden" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70 dark:opacity-85"
      />
    </div>
  );
}
