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

    const particleCount = Math.min(Math.floor((width * height) / 36000), 38);
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
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.12,
      });
    }

    const isLight = theme === "light";

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint constellation links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * (isLight ? 0.08 : 0.12);
            ctx.strokeStyle = isLight
              ? `rgba(37, 99, 235, ${lineAlpha})`
              : `rgba(34, 211, 238, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = isLight
          ? `rgba(59, 130, 246, ${p.alpha * 0.6})`
          : `rgba(59, 130, 246, ${p.alpha})`;
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
      {/* Ambient Gradient Glow Orbs */}
      <div
        className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 ${
          theme === "light"
            ? "bg-blue-300/20"
            : "bg-blue-600/10"
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 ${
          theme === "light"
            ? "bg-cyan-300/15"
            : "bg-cyan-500/08"
        }`}
      />

      {/* HTML5 Canvas for Constellation Matrix */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
