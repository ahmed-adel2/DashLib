"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal scroll container that fades its edges: while content is hidden to
 * the right a shade sits on the right, and once you reach the end the shade
 * flips to the left to show there is content behind you.
 */
export function ScrollShade({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;

    const update = () => {
      const remaining = node.scrollWidth - node.clientWidth - node.scrollLeft;
      const left = node.scrollLeft > 1;
      const right = remaining > 1;
      setEdges((current) =>
        current.left === left && current.right === right ? current : { left, right },
      );
    };

    update();
    // Re-measure once the first frame has laid out (and after webfonts settle).
    const frame = window.requestAnimationFrame(update);
    node.addEventListener("scroll", update, { passive: true });

    // Content width changes when rows are filtered, so watch the box and its
    // children rather than only the window.
    const observer = new ResizeObserver(update);
    observer.observe(node);
    for (const child of Array.from(node.children)) observer.observe(child);

    return () => {
      window.cancelAnimationFrame(frame);
      node.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-w-0 max-w-full">
      <div ref={viewport} className={`w-full overflow-x-auto ${className}`}>
        {children}
      </div>

      {edges.left ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(22,36,28,0.22), transparent)",
          }}
        />
      ) : null}

      {edges.right ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10"
          style={{
            backgroundImage: "linear-gradient(to left, rgba(22,36,28,0.22), transparent)",
          }}
        />
      ) : null}
    </div>
  );
}
