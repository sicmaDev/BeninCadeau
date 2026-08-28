"use client";

import { useRouter } from "@/lib/context";

export default function NavigationLoader() {
  const { isNavigating } = useRouter();

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
      <div className="relative w-14 h-14 flex items-center justify-center pointer-events-auto">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-accent animate-spin" />
        <img
          src="/1-19.png"
          alt="Chargement..."
          className="w-8 h-8 object-contain animate-pulse"
        />
      </div>
    </div>
  );
}
