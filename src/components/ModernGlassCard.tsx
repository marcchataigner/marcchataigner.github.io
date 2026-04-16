import React from "react";
import { trustSignals } from "@/data/trustSignals";

interface ModernGlassCardProps {
  index: string;
  layer: string;
  title: string;
  description: string;
  trustProduced: string;
  makesVisible: string;
  source: string;
  dependsOn: string[];
  enables: string[];
  onConnectionClick: (index: string) => void;
  isFlipped: boolean;
  onFlip: () => void;
}

const layerColors = {
  Institutional: {
    bg: "bg-[#1B5E8C]/10",
    border: "border-[#1B5E8C]/30",
    text: "text-[#1B5E8C]",
    pill: "bg-[#1B5E8C]/15 border-[#1B5E8C]/40 text-[#1B5E8C]",
    badge: "bg-[#1B5E8C] text-white",
    accent: "#1B5E8C",
  },
  Operational: {
    bg: "bg-[#AC1E2D]/10",
    border: "border-[#AC1E2D]/30",
    text: "text-[#AC1E2D]",
    pill: "bg-[#AC1E2D]/15 border-[#AC1E2D]/40 text-[#AC1E2D]",
    badge: "bg-[#AC1E2D] text-white",
    accent: "#AC1E2D",
  },
  Experiential: {
    bg: "bg-[#B4975A]/10",
    border: "border-[#B4975A]/30",
    text: "text-[#B4975A]",
    pill: "bg-[#B4975A]/15 border-[#B4975A]/40 text-[#B4975A]",
    badge: "bg-[#B4975A] text-white",
    accent: "#B4975A",
  },
};

function resolveConnections(indices: string[]) {
  return indices
    .map((connIndex) => {
      const signal = trustSignals.find((s) => s.index === connIndex);
      return signal ? { index: connIndex, title: signal.title, layer: signal.layer } : null;
    })
    .filter(Boolean) as { index: string; title: string; layer: string }[];
}

export function ModernGlassCard({
  index,
  layer,
  title,
  description,
  trustProduced,
  makesVisible,
  source,
  dependsOn,
  enables,
  onConnectionClick,
  isFlipped,
  onFlip,
}: ModernGlassCardProps) {

  const colors = layerColors[layer as keyof typeof layerColors] || layerColors.Institutional;
  const indexNumber = index.split("-")[1] || index;

  const sources = source
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const resolvedDependsOn = resolveConnections(dependsOn);
  const resolvedEnables = resolveConnections(enables);

  return (
    <div
      className="relative h-[420px] w-[315px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl backdrop-blur-md ${colors.bg} border ${colors.border} shadow-xl p-6 flex flex-col`}
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: `${colors.accent}08`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors.pill}`}>
              {layer}
            </div>
            <div className={`w-8 h-8 rounded-full ${colors.badge} flex items-center justify-center text-sm font-bold`}>
              {indexNumber}
            </div>
          </div>

          <h3 className={`text-xl font-semibold ${colors.text} mb-3 leading-tight`}>
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
            {description}
          </p>

          <div className="mt-auto space-y-2">
            {trustProduced && (
              <>
                <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                  Trust Produced
                </div>
                <div
                  className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}
                  style={{ backgroundColor: `${colors.accent}15` }}
                >
                  <p className="text-sm text-foreground font-medium">{trustProduced}</p>
                </div>
              </>
            )}
            {makesVisible && (
              <div className="pt-1">
                <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>Makes visible: </span>
                <span className="text-xs text-muted-foreground">{makesVisible}</span>
              </div>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl border ${colors.border} shadow-xl p-6 flex flex-col bg-white dark:bg-background`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Depends On */}
          {resolvedDependsOn.length > 0 && (
            <div className="mb-4">
              <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wide mb-2`}>
                Depends On
              </div>
              <div className="flex flex-wrap gap-2">
                {resolvedDependsOn.map((conn) => {
                  const connColors = layerColors[conn.layer as keyof typeof layerColors] || layerColors.Institutional;
                  return (
                    <button
                      key={conn.index}
                      onClick={(e) => { e.stopPropagation(); onConnectionClick(conn.index); }}
                      className={`px-3 py-1.5 rounded-lg border ${connColors.pill} text-xs font-medium hover:opacity-80 transition-opacity text-left`}
                    >
                      <span className="font-bold">{conn.index}</span> {conn.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Enables */}
          {resolvedEnables.length > 0 && (
            <div className="flex-grow mb-4 overflow-y-auto">
              <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wide mb-2`}>
                Enables
              </div>
              <div className="flex flex-wrap gap-2">
                {resolvedEnables.map((conn) => {
                  const connColors = layerColors[conn.layer as keyof typeof layerColors] || layerColors.Institutional;
                  return (
                    <button
                      key={conn.index}
                      onClick={(e) => { e.stopPropagation(); onConnectionClick(conn.index); }}
                      className={`px-3 py-1.5 rounded-lg border ${connColors.pill} text-xs font-medium hover:opacity-80 transition-opacity text-left`}
                    >
                      <span className="font-bold">{conn.index}</span> {conn.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sources */}
          <div className="mt-auto">
            <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wide mb-2`}>
              Sources
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-foreground/90 text-background text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
