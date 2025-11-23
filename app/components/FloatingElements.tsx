"use client";

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400/40 rounded-full animate-float-1"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-amber-400/30 rounded-full animate-float-2"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-orange-300/40 rounded-full animate-float-3"></div>
      <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-amber-300/30 rounded-full animate-float-4"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-orange-400/35 rounded-full animate-float-5"></div>
    </div>
  );
}

