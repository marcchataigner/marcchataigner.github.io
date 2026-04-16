import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { trustSignals } from "@/data/trustSignals";
import { ModernGlassCard } from "@/components/ModernGlassCard";
import { Button } from "@/components/ui/button";

const layerAccentColors: Record<string, string> = {
  Institutional: "#1B5E8C",
  Operational: "#AC1E2D",
  Experiential: "#B4975A",
};

const layers = ["All", "Institutional", "Operational", "Experiential"] as const;

const sections = ["Trust Signals", "Workshop Format", "About this Initiative"] as const;
type Section = (typeof sections)[number];

const audiences = ["All", "End-user", "Internal staff", "Organisation"] as const;
type AudienceFilter = (typeof audiences)[number];

function getEdgePoint(sourceRect: DOMRect, targetRect: DOMRect, gridRect: DOMRect) {
  const sx = sourceRect.left + sourceRect.width / 2 - gridRect.left;
  const sy = sourceRect.top + sourceRect.height / 2 - gridRect.top;
  const tx = targetRect.left + targetRect.width / 2 - gridRect.left;
  const ty = targetRect.top + targetRect.height / 2 - gridRect.top;

  const dx = tx - sx;
  const dy = ty - sy;
  const angle = Math.atan2(dy, dx);

  const hw = sourceRect.width / 2;
  const hh = sourceRect.height / 2;
  const thw = targetRect.width / 2;
  const thh = targetRect.height / 2;

  // Source edge
  const sSlope = Math.abs(dy / (dx || 0.001));
  let ex1: number, ey1: number;
  if (sSlope < hh / hw) {
    ex1 = sx + (dx > 0 ? hw : -hw);
    ey1 = sy + (dx > 0 ? hw : -hw) * (dy / (dx || 0.001));
  } else {
    ey1 = sy + (dy > 0 ? hh : -hh);
    ex1 = sx + (dy > 0 ? hh : -hh) * (dx / (dy || 0.001));
  }

  // Target edge
  const tSlope = Math.abs(dy / (dx || 0.001));
  let ex2: number, ey2: number;
  if (tSlope < thh / thw) {
    ex2 = tx - (dx > 0 ? thw : -thw);
    ey2 = ty - (dx > 0 ? thw : -thw) * (dy / (dx || 0.001));
  } else {
    ey2 = ty - (dy > 0 ? thh : -thh);
    ex2 = tx - (dy > 0 ? thh : -thh) * (dx / (dy || 0.001));
  }

  return { x1: ex1, y1: ey1, x2: ex2, y2: ey2 };
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>("Trust Signals");
  const [activeLayer, setActiveLayer] = useState<string>("All");
  const [activeAudience, setActiveAudience] = useState<AudienceFilter>("All");
  
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [connectionLines, setConnectionLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [scrollTick, setScrollTick] = useState(0);

  // Recalculate lines on scroll in any row
  const handleRowScroll = useCallback(() => {
    setScrollTick((t) => t + 1);
  }, []);

  // Calculate connection lines when a card is hovered (or scroll changes)
  useEffect(() => {
    if (!hoveredCard || !gridRef.current) {
      setConnectionLines([]);
      return;
    }
    const signal = trustSignals.find((s) => s.index === hoveredCard);
    const allConnections = signal ? [...signal.dependsOn, ...signal.enables] : [];
    if (!signal || allConnections.length === 0) {
      setConnectionLines([]);
      return;
    }
    const gridRect = gridRef.current.getBoundingClientRect();
    const sourceEl = cardRefs.current.get(hoveredCard);
    if (!sourceEl) { setConnectionLines([]); return; }
    const sourceRect = sourceEl.getBoundingClientRect();

    const lines = allConnections
      .map((connIndex) => {
        const targetEl = cardRefs.current.get(connIndex);
        const connSignal = trustSignals.find((s) => s.index === connIndex);
        if (!targetEl || !connSignal) return null;
        const targetRect = targetEl.getBoundingClientRect();
        const edge = getEdgePoint(sourceRect, targetRect, gridRect);
        return {
          ...edge,
          color: layerAccentColors[connSignal.layer] || "#888",
        };
      })
      .filter(Boolean) as typeof connectionLines;
    setConnectionLines(lines);
  }, [hoveredCard, scrollTick]);

  const handleConnectionClick = useCallback((targetIndex: string) => {
    setActiveLayer("All");
    setActiveAudience("All");
    setTimeout(() => {
      const el = cardRefs.current.get(targetIndex);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => el.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 2000);
      }
    }, 100);
  }, []);

  const filtered = trustSignals.filter((s) => {
    const layerMatch = activeLayer === "All" || s.layer === activeLayer;
    const audienceMatch = activeAudience === "All" ||
      (activeAudience === "End-user" && s.audience.endUser) ||
      (activeAudience === "Internal staff" && s.audience.internalStaff) ||
      (activeAudience === "Organisation" && s.audience.organisation);
    return layerMatch && audienceMatch;
  });

  const counts = {
    All: trustSignals.length,
    Institutional: trustSignals.filter((s) => s.layer === "Institutional").length,
    Operational: trustSignals.filter((s) => s.layer === "Operational").length,
    Experiential: trustSignals.filter((s) => s.layer === "Experiential").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
            A CONVERSATION BETWEEN POLYU DESIGN × BOWTIE × GOVSTACK
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-foreground max-w-4xl">
            How might we increase staff adoption rate of{" "}
            <em className="text-primary">Agentic AI</em> initiatives?
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light">
            A collaboration between PolyU School of Design, Bowtie, and GovStack to explore relevant Trust Signals and build a trust framework fostering Agentic AI adoption in professional settings. (March 2026)
          </p>

          {/* Section Selector */}
          <div className="mt-12 flex flex-wrap gap-3">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`px-5 py-2 text-sm border transition-colors rounded-full ${
                  activeSection === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="border-t border-border" />

      {/* Trust Signal Cards */}
      {activeSection === "Trust Signals" && (
        <section className="border-b border-border">
          <div className="max-w-[1600px] mx-auto px-6 py-16 md:py-24">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">
              FRAMEWORK
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight mb-12">
              Trust Signals <span className="text-muted-foreground">(version alpha — Mar. 2026)</span>
            </h2>

            {/* Filters */}
            <div className="space-y-6 mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mr-4">
                  Type
                </span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {layers.map((l) => {
                    const isActive = activeLayer === l;
                    const layerStyle = l === "Institutional"
                      ? isActive ? "bg-[#1B5E8C] text-white border-[#1B5E8C]" : "bg-[#1B5E8C]/10 text-[#1B5E8C] border-[#1B5E8C]/30 hover:bg-[#1B5E8C]/20"
                      : l === "Operational"
                      ? isActive ? "bg-[#AC1E2D] text-white border-[#AC1E2D]" : "bg-[#AC1E2D]/10 text-[#AC1E2D] border-[#AC1E2D]/30 hover:bg-[#AC1E2D]/20"
                      : l === "Experiential"
                      ? isActive ? "bg-[#B4975A] text-white border-[#B4975A]" : "bg-[#B4975A]/10 text-[#B4975A] border-[#B4975A]/30 hover:bg-[#B4975A]/20"
                      : isActive ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground";
                    return (
                      <button
                        key={l}
                        onClick={() => setActiveLayer(l)}
                        className={`px-4 py-1.5 text-sm border transition-colors rounded-full ${layerStyle}`}
                      >
                        {l}
                        {l !== "All" && (
                          <span className="ml-1.5 text-xs opacity-60">{counts[l as keyof typeof counts]}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mr-4">
                  Audience
                </span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {audiences.map((a) => {
                    const isActive = activeAudience === a;
                    return (
                      <button
                        key={a}
                        onClick={() => setActiveAudience(a)}
                        className={`px-4 py-1.5 text-sm border transition-colors rounded-full ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{filtered.length}</strong> of {trustSignals.length} signals
              </p>
            </div>

            <div className="relative" ref={gridRef}>
              {/* SVG connection lines overlay */}
              {connectionLines.length > 0 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  {connectionLines.map((line, i) => (
                    <line
                      key={i}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.color}
                      strokeWidth={2}
                      strokeOpacity={0.5}
                      strokeDasharray="6 4"
                      className="animate-fade-in"
                    />
                  ))}
                </svg>
              )}

              {(["Institutional", "Operational", "Experiential"] as const)
                .filter((layer) => activeLayer === "All" || activeLayer === layer)
                .map((layer) => {
                  const layerSignals = filtered.filter((s) => s.layer === layer);
                  if (layerSignals.length === 0) return null;
                  const color = layerAccentColors[layer];
                  return (
                    <div key={layer} className="mb-10">
                      <h3
                        className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
                        style={{ color }}
                      >
                        {layer}
                      </h3>
                      <div
                        ref={(el) => {
                          if (el) scrollContainerRefs.current.set(layer, el);
                        }}
                        onScroll={handleRowScroll}
                        className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin"
                        style={{ scrollbarColor: `${color}40 transparent` }}
                      >
                        {layerSignals.map((signal) => {
                          const isHovered = hoveredCard === signal.index;
                          const hoveredSignal = hoveredCard ? trustSignals.find((s) => s.index === hoveredCard) : null;
                          const isConnected = hoveredSignal
                            ? [...hoveredSignal.dependsOn, ...hoveredSignal.enables].includes(signal.index)
                            : false;
                          const dimmed = hoveredCard && !isHovered && !isConnected;
                          return (
                            <div
                              key={signal.index}
                              ref={(el) => {
                                if (el) cardRefs.current.set(signal.index, el);
                              }}
                              className="flex-shrink-0 transition-all duration-300 rounded-2xl"
                              style={{
                                transform: isHovered ? "translateY(-8px) scale(1.03)" : undefined,
                                opacity: dimmed ? 0.35 : 1,
                                zIndex: isHovered ? 20 : isConnected ? 15 : 1,
                                position: "relative",
                              }}
                              onMouseEnter={() => setHoveredCard(signal.index)}
                              onMouseLeave={() => setHoveredCard(null)}
                            >
                              <ModernGlassCard
                                index={signal.index}
                                layer={signal.layer}
                                title={signal.title}
                                description={signal.description}
                                trustProduced={signal.trustProduced}
                                makesVisible={signal.makesVisible}
                                source={signal.source}
                                dependsOn={signal.dependsOn}
                                enables={signal.enables}
                                onConnectionClick={handleConnectionClick}
                                isFlipped={flippedCard === signal.index}
                                onFlip={() => setFlippedCard(flippedCard === signal.index ? null : signal.index)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-20 text-lg">
                No signals match the selected filters.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Workshop Template */}
      {activeSection === "Workshop Format" && (
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">
              Facilitation
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight mb-8">
              Workshop Template
            </h2>
            <div className="max-w-2xl space-y-6 text-muted-foreground leading-relaxed">
              <p>
                The Trust Signal cards are designed to be used as a facilitation tool in
                workshops when designing new AI-powered features or services. The template
                guides teams through a structured process:
              </p>
              <ol className="list-decimal list-inside space-y-3 pl-2">
                <li><strong className="text-foreground">Map the AI touchpoints</strong> — Identify where AI interacts with users</li>
                <li><strong className="text-foreground">Assess trust gaps</strong> — Use the cards to identify which trust signals are missing</li>
                <li><strong className="text-foreground">Prioritise by audience</strong> — Filter cards by the primary user group affected</li>
                <li><strong className="text-foreground">Design interventions</strong> — Create concrete UI/process changes to embed trust signals</li>
                <li><strong className="text-foreground">Validate with stakeholders</strong> — Test proposed signals with real users and domain experts</li>
              </ol>
              <p>
                The workshop is designed for cross-functional teams including designers,
                engineers, product managers, and domain experts.
              </p>
            </div>

            <div className="mt-12">
              <Button asChild size="lg" className="rounded-full px-8">
                <a href="mailto:marc.chataigner@polyu.edu.hk?subject=Trust%20Signal%20Workshop%20for%20Agentic%20AI%20Initiatives%20in%20Service%20Organisation">
                  Get in touch to organise a workshop
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About this Initiative */}
      {activeSection === "About this Initiative" && (
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4">
                  What We Did
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight">
                  A series of design workshops to uncover trust signals
                </h2>
              </div>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  AI-powered service automation often promises efficiency gains, yet many organisations encounter a familiar obstacle: staff adoption. Even when systems perform well technically, they are not always used, trusted, or relied upon in day-to-day work. In practice, friction emerges within workflows—unclear outputs, shifting responsibilities, and uncertainty about when and how to intervene. As a result, adoption becomes a critical bottleneck in realising the value of AI.
                </p>
                <p>
                  Through a series of workshops with Bowtie and GovStack, we examined how AI systems reshape operational realities. We observed that automation does not simply replace tasks—it transforms routines, redistributes roles, and introduces new forms of oversight such as monitoring, validation, and exception handling. Adoption, therefore, depends less on abstract trust in the system and more on how AI integrates into everyday practices. Trust is built (or eroded) through repeated interactions, coordination between teams, and the clarity of signals embedded in the workflow.
                </p>
                <p>
                  Trust Signals v1.5 is a practical framework designed to help teams identify and implement these signals. It provides a structured way to anticipate where trust may break down and to embed mechanisms that support confidence, accountability, and usability in real service contexts. Organised across different stakeholders and levels of interaction, the framework enables teams to move from deploying AI systems to designing services that are genuinely adoptable in practice.
                </p>
              </div>

              {/* Resources */}
              <div className="md:col-span-2 mt-8 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                    Resources used in the Trust Signal Cards
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm leading-relaxed pl-2">
                    <li>IF Design Patterns</li>
                    <li>Google AI Playbook</li>
                    <li>NIST AI Risk Management Framework (NIFT)</li>
                    <li>PAERA</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                    Existing literature on routine change
                  </p>
                  <ul className="space-y-4 text-muted-foreground text-sm leading-relaxed pl-2">
                    <li>
                      Shraddha Barke, Michael B. James, and Nadia Polikarpova. 2023. Grounded Copilot: How Programmers Interact with Code-Generating Models. <em>Proc. ACM Program. Lang.</em> 7, OOPSLA1, Article 78 (April 2023), 27 pages.{" "}
                      <a href="https://doi.org/10.1145/3586030" className="text-primary hover:text-primary/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">https://doi.org/10.1145/3586030</a>
                    </li>
                    <li>
                      P. Reinhard, M. M. Li, C. Peters, A. Janson, and J. M. Leimeister. 2026. GenAI-Infused Service Delivery: Micro-Level Augmentation Patterns at the Service Frontline. <em>Journal of Service Research</em>, 0(0).
                    </li>
                    <li>
                      Denniz Dönmez, Gudela Grote, and Stefano Brusoni. 2016. Routine interdependencies as a source of stability and flexibility. A study of agile software development teams. <em>Inf. Organ.</em> 26, 3 (September 2016), 63–83.{" "}
                      <a href="https://doi.org/10.1016/j.infoandorg.2016.07.001" className="text-primary hover:text-primary/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">https://doi.org/10.1016/j.infoandorg.2016.07.001</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Participants */}
              <div className="md:col-span-2 mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                  Participants
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3 text-muted-foreground text-sm leading-relaxed">
                  <div><strong className="text-foreground">Marc Chataigner</strong> — Assistant Professor of Practice, HK PolyU School of Design</div>
                  <div><strong className="text-foreground">Gabriel Koo</strong> — AI Initiative lead, Senior Lead Engineer, Bowtie</div>
                  <div><strong className="text-foreground">Gianna Burgos</strong> — Digital Product Design, Bowtie</div>
                  <div><strong className="text-foreground">Rakshit Jain</strong> — AI Engineer, Bowtie</div>
                  <div><strong className="text-foreground">Martin Cheng</strong> — DevSecOps Engineer, Bowtie</div>
                  <div><strong className="text-foreground">Sara Choi</strong> — Senior Manager, Talent Acquisition and Development, Bowtie</div>
                  <div><strong className="text-foreground">Susan Wong</strong> — Talent Acquisition Officer, Bowtie</div>
                  <div><strong className="text-foreground">Betty Mwema</strong> — Senior Service Designer, GDS, UK Gov & UX/Service Design Working Group, GovStack</div>
                  <div><strong className="text-foreground">Laurence Berry</strong> — Service Designer, Komo International & UX/Service Design Working Group, GovStack</div>
                  <div><strong className="text-foreground">Stefan Draskic</strong> — Digital Product Design, Komo International & UX/Service Design Working Group, GovStack</div>
                  <div><strong className="text-foreground">Angus Campbell</strong> — Associate Professor, HK PolyU School of Design</div>
                  <div><strong className="text-foreground">SiYue Ren</strong> — PhD candidate, HK PolyU School of Design</div>
                  <div><strong className="text-foreground">Cherry Yihan Mei</strong> — PhD candidate, HK PolyU School of Design</div>
                  <div><strong className="text-foreground">ShengYang Xu</strong> — Post-Doc, HK PolyU School of Design</div>
                  <div><strong className="text-foreground">Zhibin Zhou</strong> — Assistant Professor, HK PolyU School of Design</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            PolyU School of Design × Bowtie × GovStack — 2026
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:marc.chataigner@polyu.edu.hk" className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
              Contact
            </a>
            <p className="text-xs text-muted-foreground/60">
              A collaborative research initiative on trust in agentic AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
