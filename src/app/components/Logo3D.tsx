"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const SVG3D = dynamic(() => import("3dsvg").then((m) => ({ default: m.SVG3D })), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">Loading 3D engine…</div>,
});

export default function Logo3D({ svgUrl, animate }: { svgUrl: string; animate: string }) {
  const [svgString, setSvgString] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(svgUrl)
      .then((r) => r.text())
      .then((text) => {
        if (!cancelled) setSvgString(text);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, [svgUrl]);

  if (error || !svgString) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
        {error ? "Could not load SVG for 3D preview" : "Loading…"}
      </div>
    );
  }

  return (
    <SVG3D
      svg={svgString}
      animate={animate as any}
      depth={0.4}
      color="#ffffff"
      material="glass"
      background="#111111"
      width="100%"
      height="100%"
      interactive={true}
      cursorOrbit={true}
      shadow={true}
    />
  );
}
