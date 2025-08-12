import { useState } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  altBefore?: string;
  altAfter?: string;
}

export default function BeforeAfterSlider({ before, after, altBefore = "Przed", altAfter = "Po" }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full max-w-xl aspect-[3/4] overflow-hidden rounded-xl border border-neutral-700">
      <img src={before} alt={altBefore} className="w-full h-full object-cover absolute top-0 left-0" />
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img src={after} alt={altAfter} className="w-full h-full object-cover" />
      </div>
      <div 
        className="absolute top-0" 
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-1 bg-white/70 h-full"></div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(parseInt(e.target.value))}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3"
      />
    </div>
  );
}
