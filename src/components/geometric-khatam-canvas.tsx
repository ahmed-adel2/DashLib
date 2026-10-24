"use client";

import { useEffect, useRef } from "react";

export function GeometricKhatamCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    // Mouse tracking with soft damping
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseX = targetMouseX;
    let mouseY = targetMouseY;
    let isHovering = false;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) * window.devicePixelRatio;
      targetMouseY = (e.clientY - rect.top) * window.devicePixelRatio;
      isHovering = true;
    };

    const handlePointerLeave = () => {
      isHovering = false;
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    };

    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", handlePointerMove, { passive: true });
    parent?.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // Draw an eight-point Khatam star tile (Rub el Hizb geometry: two interleaved squares)
    function drawKhatamStar(
      cx: number,
      cy: number,
      radius: number,
      angle: number,
      strokeColor: string,
      lineWidth: number
    ) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "miter";

      // Square 1
      const half = radius / Math.SQRT2;
      ctx.strokeRect(-half, -half, half * 2, half * 2);

      // Square 2 (rotated 45 deg)
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-half, -half, half * 2, half * 2);

      // Central diamond accent
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    let time = 0;

    const render = () => {
      time += 0.006;
      // Damped mouse follower
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const spacing = 110 * dpr;
      const baseRadius = 42 * dpr;

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const startX = (width % spacing) / 2 - spacing;
      const startY = (height % spacing) / 2 - spacing;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + i * spacing;
          const y = startY + j * spacing;

          // Distance to mouse pointer
          const dx = mouseX - x;
          const dy = mouseY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxInfluence = 260 * dpr;
          const factor = Math.max(0, 1 - dist / maxInfluence);

          // Natural harmonic breathing oscillation
          const wave = Math.sin(time + (i * 0.4 + j * 0.3)) * 0.08;
          const rot = wave + factor * 0.25;

          // Opacity dynamic: distinct & alive, richly accented near cursor
          const baseAlpha = 0.16 + Math.sin(time * 0.5 + i) * 0.04;
          const alpha = Math.min(0.65, baseAlpha + factor * 0.4);

          const radius = baseRadius * (1 + factor * 0.22 + wave * 0.5);
          const stroke = factor > 0.2 ? `rgba(176, 134, 60, ${alpha})` : `rgba(27, 61, 46, ${alpha})`;
          const lineWidth = (factor > 0.25 ? 1.6 : 1.1) * dpr;

          drawKhatamStar(x, y, radius, rot, stroke, lineWidth);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Single static render without animation loop
      ctx.clearRect(0, 0, width, height);
      const dpr = window.devicePixelRatio || 1;
      const spacing = 110 * dpr;
      const baseRadius = 42 * dpr;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          drawKhatamStar(
            i * spacing,
            j * spacing,
            baseRadius,
            0,
            "rgba(27, 61, 46, 0.14)",
            1 * dpr
          );
        }
      }
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      parent?.removeEventListener("pointermove", handlePointerMove);
      parent?.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
