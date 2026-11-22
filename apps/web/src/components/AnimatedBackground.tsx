"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic particles for constellation mesh
    const particleCount = Math.min(Math.floor((width * height) / 38000), 42);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.12,
      });
    }

    const isLight = theme === "light";
    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle moving financial grid
      gridOffset = (gridOffset + 0.08) % 48;
      const gridSize = 48;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = isLight
        ? "rgba(148, 163, 184, 0.06)"
        : "rgba(30, 58, 102, 0.12)";

      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines with slow drift
      for (let y = gridOffset; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Faint constellation links between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const lineAlpha = (1 - dist / 135) * (isLight ? 0.08 : 0.14);
            ctx.strokeStyle = isLight
              ? `rgba(37, 99, 235, ${lineAlpha})`
              : `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Floating particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = isLight
          ? `rgba(37, 99, 235, ${p.alpha * 0.6})`
          : `rgba(56, 189, 248, ${p.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Moving Gradient Orbs */}
      <div
        className={`absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-700 animate-pulse ${
          theme === "light" ? "bg-blue-300/20" : "bg-blue-600/12"
        }`}
        style={{ animationDuration: "8s" }}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-700 animate-pulse ${
          theme === "light" ? "bg-cyan-300/15" : "bg-cyan-500/10"
        }`}
        style={{ animationDuration: "10s" }}
      />
      <div
        className={`absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-opacity duration-700 ${
          theme === "light" ? "bg-indigo-300/15" : "bg-indigo-600/08"
        }`}
      />

      {/* HTML5 Canvas for Constellation Matrix & Grid */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
