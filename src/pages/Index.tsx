import { useState, useMemo, useRef, useEffect, type FormEvent } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SiteWordmark } from "@/components/SiteWordmark";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingDialog } from "@/components/BookingDialog";
import { ExternalLink, ChevronRight, ChevronDown, Search, Wrench, ArrowLeft, Download, Copy } from "lucide-react";
import {
  pillars,
  categories,
  getCategoriesByPillar,
  getSeverityColor,
  getSeverityBg,
  toolsMeta,
  type Severity,
  type PillarId,
  type Category,
  type Subcategory,
  type SourceType,
  type ToolMeta,
} from "@/data/governanceData";

type View = "dashboard" | "pillar" | "category" | "subcategory";

// Clickable example searches shown in the empty/no-results state.
const SEARCH_SUGGESTIONS = ["RACI", "agent", "modenhed", "livscyklus", "roller", "A2A"];

const getSourceBadgeClass = (source: SourceType): string => {
  switch (source) {
    // Regulatory & Danish authorities → primary blue
    case "EU AI Act":
    case "Digst":
    case "Datatilsynet":
    case "Finanstilsynet":
    case "CoE":
    case "GDPR/EDPB":
      return "bg-primary/15 text-primary";
    // Standards bodies & research → info cyan
    case "NIST":
    case "ISO":
    case "AI Verify":
    case "CSA":
    case "FinOps":
    case "MCP":
    case "OpenTelemetry":
      return "bg-info/15 text-info";
    // Industry frameworks & vendors → warning amber
    case "Microsoft":
    case "Google":
    case "Anthropic":
    case "OECD":
    case "WEF":
    case "Gartner":
    case "DI":
    case "IIA":
    case "Industry":
      return "bg-warning/15 text-warning";
    // Security & risk frameworks → danger red
    case "OWASP":
    case "MITRE":
    case "MIT":
      return "bg-danger/15 text-danger";
    default:
      return "bg-secondary text-foreground";
  }
};

const pillarName = (id: PillarId) => pillars.find((p) => p.id === id)?.name ?? id;

// ── Værktøjer: canonical /vaerktoejer/<slug> URLs ──
// Metadata lives in governanceData.ts (toolsMeta) so the prerender script can
// reuse it; here we attach each tool's React component. Inline rendering on
// content pages becomes a teaser card linking to the canonical URL.
// AgentDecisionClassMatrix stays inline on beslutnings-graenser (it answers that
// subcategory's question) so it is deliberately absent from this list.
type ToolConfig = ToolMeta & { Component: () => JSX.Element };

const TOOL_COMPONENTS: Record<string, () => JSX.Element> = {
  "use-case-livscyklus": UseCaseLifecycleFlow,
  "ai-council-raci": AiCouncilRaci,
  "agent-runtime-control-plane": AgentRuntimeControlPlane,
  "governance-modenhed": GovernanceMaturityRadar,
};

const tools: ToolConfig[] = toolsMeta.map((meta) => ({
  ...meta,
  Component: TOOL_COMPONENTS[meta.slug],
}));

const getTool = (slug: string): ToolConfig =>
  tools.find((t) => t.slug === slug) ?? tools[0];

// ── Tværgående tema: Agent governance ──
// Governance has 3 agent-dedicated categories (one per pillar) plus a couple of
// agent-relevant stragglers in other categories. A subcategory belongs to the
// cross-cutting "Agent governance" theme if its category is one of the three OR
// its id is in the explicit extras list.
const AGENT_CATEGORY_IDS = ["agent-skill-org", "agent-skill-design", "agent-runtime"];
const AGENT_EXTRA_SUB_IDS = ["mcp-governance", "otel-genai-observability"];
const isAgentSub = (categoryId: string, subId: string) =>
  AGENT_CATEGORY_IDS.includes(categoryId) || AGENT_EXTRA_SUB_IDS.includes(subId);

function Breadcrumbs({
  pillar,
  category,
  subcategory,
  tool,
  toolsRoot,
  theme,
  onHome,
  onPillar,
  onCategory,
  onTools,
}: {
  pillar?: { id: PillarId; name: string };
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
  tool?: { name: string };
  toolsRoot?: boolean;
  theme?: { name: string };
  onHome: () => void;
  onPillar?: () => void;
  onCategory?: () => void;
  onTools?: () => void;
}) {
  const sep = (
    <span aria-hidden="true" className="text-muted-foreground/40">›</span>
  );

  // Tema path: Overblik › <Tema>
  if (theme) {
    return (
      <nav aria-label="Brødkrummer" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <button onClick={onHome} className="hover:text-primary transition-colors">Overblik</button>
        {sep}
        <span className="text-foreground font-medium" aria-current="page">{theme.name}</span>
      </nav>
    );
  }

  // Tools path: Overblik › Værktøjer [› Tool name]
  if (toolsRoot || tool) {
    return (
      <nav aria-label="Brødkrummer" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <button onClick={onHome} className="hover:text-primary transition-colors">Overblik</button>
        {sep}
        {tool ? (
          <button onClick={onTools} className="hover:text-primary transition-colors">Værktøjer</button>
        ) : (
          <span className="text-foreground font-medium" aria-current="page">Værktøjer</span>
        )}
        {tool && (
          <>
            {sep}
            <span className="text-foreground font-medium" aria-current="page">{tool.name}</span>
          </>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="Brødkrummer" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <button onClick={onHome} className="hover:text-primary transition-colors">Overblik</button>
      {pillar && (
        <>
          {sep}
          {category ? (
            <button onClick={onPillar} className="hover:text-primary transition-colors">{pillar.name}</button>
          ) : (
            <span className="text-foreground font-medium" aria-current="page">{pillar.name}</span>
          )}
        </>
      )}
      {category && (
        <>
          {sep}
          {subcategory ? (
            <button onClick={onCategory} className="hover:text-primary transition-colors">{category.name}</button>
          ) : (
            <span className="text-foreground font-medium" aria-current="page">{category.name}</span>
          )}
        </>
      )}
      {subcategory && (
        <>
          {sep}
          <span className="text-foreground font-medium" aria-current="page">{subcategory.name}</span>
        </>
      )}
    </nav>
  );
}

type SearchResult =
  | { kind: "category"; item: Category }
  | { kind: "subcategory"; item: Subcategory; parent: Category };

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-primary/25 px-0.5 text-foreground">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const Index = () => {
  const params = useParams<{ pillarId?: string; categoryId?: string; subcategoryId?: string; toolId?: string }>();
  const routerNavigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  // Tools route detection (literal /vaerktoejer segment)
  const isToolsRoute =
    location.pathname === "/vaerktoejer" || location.pathname.startsWith("/vaerktoejer/");
  // Cross-cutting theme route (literal /agentisk)
  const isAgenticRoute = location.pathname === "/agentisk" || location.pathname === "/agentisk/";
  const selectedTool: ToolConfig | null = useMemo(
    () => (params.toolId ? tools.find((t) => t.slug === params.toolId) ?? null : null),
    [params.toolId]
  );

  const selectedPillar: PillarId | null = useMemo(() => {
    if (!params.pillarId) return null;
    const pillar = pillars.find((p) => p.id === params.pillarId);
    return pillar ? (pillar.id as PillarId) : null;
  }, [params.pillarId]);

  const selectedCategory: Category | null = useMemo(() => {
    if (!params.categoryId || !selectedPillar) return null;
    return categories.find((c) => c.id === params.categoryId && c.pillar === selectedPillar) ?? null;
  }, [params.categoryId, selectedPillar]);

  const selectedSubcategory: Subcategory | null = useMemo(() => {
    if (!params.subcategoryId || !selectedCategory) return null;
    return selectedCategory.subcategories.find((s) => s.id === params.subcategoryId) ?? null;
  }, [params.subcategoryId, selectedCategory]);

  const view: View = selectedSubcategory
    ? "subcategory"
    : selectedCategory
    ? "category"
    : selectedPillar
    ? "pillar"
    : "dashboard";

  useEffect(() => {
    if (params.toolId && !selectedTool) {
      routerNavigate("/vaerktoejer", { replace: true });
    } else if (params.pillarId && !selectedPillar) {
      routerNavigate("/", { replace: true });
    } else if (params.categoryId && selectedPillar && !selectedCategory) {
      routerNavigate(`/${selectedPillar}`, { replace: true });
    } else if (params.subcategoryId && selectedCategory && !selectedSubcategory) {
      routerNavigate(`/${selectedPillar}/${selectedCategory.id}`, { replace: true });
    }
  }, [params.pillarId, params.categoryId, params.subcategoryId, params.toolId, selectedPillar, selectedCategory, selectedSubcategory, selectedTool, routerNavigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Keep tab title in sync after client-side nav (mirrors scripts/prerender.ts).
  useEffect(() => {
    const SITE = "AI Governance";
    let title: string;
    if (isAgenticRoute) {
      title = `Agent governance - tværgående tema | ${SITE}`;
    } else if (isToolsRoute && selectedTool) {
      title = `${selectedTool.title} - Værktøj | ${SITE}`;
    } else if (isToolsRoute) {
      title = `Værktøjer - interaktive AI-governance-værktøjer | ${SITE}`;
    } else if (selectedSubcategory && selectedCategory) {
      title = `${selectedSubcategory.name} - ${selectedCategory.name} | ${SITE}`;
    } else if (selectedCategory) {
      title = `${selectedCategory.name} - ${SITE}`;
    } else if (selectedPillar) {
      const p = pillars.find((x) => x.id === selectedPillar);
      title = p ? `${p.name} - ${SITE}` : SITE;
    } else {
      title = "AI Governance - Praktisk overblik til danske organisationer | NIST · ISO 42001 · EU AI Act";
    }
    document.title = title;
  }, [selectedPillar, selectedCategory, selectedSubcategory, isToolsRoute, selectedTool, isAgenticRoute]);

  const navigate = (
    newView: View,
    pillar?: PillarId,
    category?: Category,
    subcategory?: Subcategory
  ) => {
    if (newView === "dashboard") {
      routerNavigate("/");
    } else if (newView === "pillar" && pillar) {
      routerNavigate(`/${pillar}`);
    } else if (newView === "category" && pillar && category) {
      routerNavigate(`/${pillar}/${category.id}`);
    } else if (newView === "subcategory" && pillar && category && subcategory) {
      routerNavigate(`/${pillar}/${category.id}/${subcategory.id}`);
    }
  };

  const goBack = () => {
    if (view === "subcategory" && selectedPillar && selectedCategory) {
      routerNavigate(`/${selectedPillar}/${selectedCategory.id}`);
    } else if (view === "category" && selectedPillar) {
      routerNavigate(`/${selectedPillar}`);
    } else if (view === "pillar") {
      routerNavigate("/");
    }
  };

  const openTool = (slug: string) => routerNavigate(`/vaerktoejer/${slug}`);
  const openToolsIndex = () => routerNavigate("/vaerktoejer");
  const openAgentic = () => routerNavigate("/agentisk");

  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const out: SearchResult[] = [];
    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        out.push({ kind: "category", item: c });
      }
      c.subcategories.forEach((s) => {
        if (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          out.push({ kind: "subcategory", item: s, parent: c });
        }
      });
    });
    return out;
  }, [searchQuery]);
  const categoryHits = searchResults.filter((r) => r.kind === "category");
  const subcategoryHits = searchResults.filter((r) => r.kind === "subcategory");

  return (
    <div className="min-h-screen bg-background">
      <a href="#hovedindhold" className="skip-link">Spring til indhold</a>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <SiteWordmark />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Søg i governance-emner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchQuery("");
                    e.currentTarget.blur();
                  }
                }}
                aria-label="Søg i governance-emner"
                className="h-9 w-64 rounded-md border border-border bg-secondary pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground sm:flex">⌘K</kbd>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openToolsIndex}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                  isToolsRoute
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                <Wrench className="h-3 w-3" /> Værktøjer
              </button>
              <a
                href="https://airc.nist.gov/airmf-resources/playbook/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                NIST AI RMF <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.iso.org/standard/42001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                ISO 42001 <ExternalLink className="h-3 w-3" />
              </a>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Book et møde
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="hovedindhold" className="container mx-auto px-6 py-8">
        {/* Søgeresultater */}
        {searchQuery && (
          <div className="fade-in mb-8">
            <h2 className="mb-4 font-display text-lg text-foreground">
              Søgeresultater for "{searchQuery}"
              <span className="ml-2 text-sm text-muted-foreground">
                ({categoryHits.length} områder · {subcategoryHits.length} emner)
              </span>
            </h2>
            {searchResults.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                <p>Ingen governance-emner matcher "{searchQuery}". Tjek stavning, eller prøv et af disse:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SEARCH_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSearchQuery(s)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground/70">Tip: tryk Esc for at rydde søgningen.</p>
              </div>
            ) : (
              <>
                {categoryHits.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Områder ({categoryHits.length})</h3>
                    <div className="grid gap-3">
                      {categoryHits.map((r) => r.kind === "category" && (
                        <button
                          key={r.item.id}
                          onClick={() => {
                            setSearchQuery("");
                            navigate("category", r.item.pillar, r.item);
                          }}
                          className="card-hover flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left"
                        >
                          <span className="text-2xl">{r.item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-sm font-semibold text-foreground">
                              <Highlight text={r.item.name} query={searchQuery} />
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              <Highlight text={r.item.description} query={searchQuery} />
                            </p>
                          </div>
                          <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                            {pillarName(r.item.pillar)}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {subcategoryHits.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">Konkrete emner ({subcategoryHits.length})</h3>
                    <div className="grid gap-2">
                      {subcategoryHits.map((r) => r.kind === "subcategory" && (
                        <button
                          key={`${r.parent.id}-${r.item.id}`}
                          onClick={() => {
                            setSearchQuery("");
                            navigate("subcategory", r.parent.pillar, r.parent, r.item);
                          }}
                          className="card-hover flex items-center gap-4 rounded-lg border border-border bg-card/60 p-3 text-left"
                        >
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${getSeverityColor(r.item.severity)}`}>
                            {r.item.severity === "critical" ? "kritisk" : r.item.severity === "high" ? "høj" : r.item.severity === "medium" ? "middel" : "lav"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-sm font-medium text-foreground">
                              <Highlight text={r.item.name} query={searchQuery} />
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {r.parent.icon} {r.parent.name} · <Highlight text={r.item.description} query={searchQuery} />
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Værktøjer */}
        {!searchQuery && isToolsRoute && selectedTool && (
          <ToolPage tool={selectedTool} onHome={() => navigate("dashboard")} onTools={openToolsIndex} />
        )}
        {!searchQuery && isToolsRoute && !selectedTool && (
          <ToolsIndex onHome={() => navigate("dashboard")} onOpenTool={openTool} />
        )}

        {/* Tværgående tema: Agent governance */}
        {!searchQuery && isAgenticRoute && (
          <AgenticView onNavigate={navigate} onHome={() => navigate("dashboard")} />
        )}

        {/* Dashboard */}
        {!searchQuery && !isToolsRoute && !isAgenticRoute && view === "dashboard" && <DashboardView onNavigate={navigate} onOpenTool={openTool} onOpenAgentic={openAgentic} />}
        {!searchQuery && !isToolsRoute && !isAgenticRoute && view === "pillar" && selectedPillar && (
          <PillarView pillar={selectedPillar} onNavigate={navigate} onBack={goBack} onOpenTool={openTool} />
        )}
        {!searchQuery && !isToolsRoute && !isAgenticRoute && view === "category" && selectedCategory && (
          <CategoryView category={selectedCategory} onNavigate={navigate} onBack={goBack} onOpenTool={openTool} />
        )}
        {!searchQuery && !isToolsRoute && !isAgenticRoute && view === "subcategory" && selectedSubcategory && selectedCategory && (
          <SubcategoryView
            subcategory={selectedSubcategory}
            category={selectedCategory}
            onNavigate={navigate}
            onOpenTool={openTool}
            onBook={() => setBookingOpen(true)}
          />
        )}
      </main>

      {/* Newsletter + CTA strip - hide booking column on subcategory pages
          (they already have a contextual "Book sparring" card). */}
      <NewsletterCTA showBooking={view !== "subcategory"} onBook={() => setBookingOpen(true)} />

      <SiteFooter />

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

// ── Dashboard View ──
function DashboardView({
  onNavigate,
  onOpenTool,
  onOpenAgentic,
}: {
  onNavigate: (v: View, p?: PillarId) => void;
  onOpenTool: (slug: string) => void;
  onOpenAgentic: () => void;
}) {
  const agentCount = categories.reduce(
    (sum, c) => sum + c.subcategories.filter((s) => isAgentSub(c.id, s.id)).length,
    0
  );
  const totalItems = categories.reduce((sum, c) => sum + c.subcategories.length, 0);
  const criticalCount = categories.reduce(
    (sum, c) => sum + c.subcategories.filter((s) => s.severity === "critical").length,
    0
  );

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground">
          AI Governance <span className="text-primary text-glow">Overblik</span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Praktisk overblik over AI-governance for danske organisationer - opdelt i Organisering, Udvikling og Drift. Syntese af NIST AI RMF, ISO/IEC 42001, EU AI Act, OECD, OWASP Top 10 for Agentic Applications 2026, Microsoft Responsible AI, Google SAIF, Anthropic RSP og dansk myndighedsvejledning. Med særlig vægt på <span className="text-primary font-medium">agent- og skill-governance</span> - det vigtigste nye styringsfelt i 2026.
        </p>
      </div>

      {/* Værktøjer-sektion - alle sitets værktøjer, synlige fra dashboardet */}
      <section aria-labelledby="vaerktoejer-heading" className="mb-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="vaerktoejer-heading" className="font-display text-lg font-semibold text-foreground">Interaktive værktøjer</h2>
          <span className="text-xs text-muted-foreground">Klik for at åbne · kan deles</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((t) => (
            <ToolTeaserCard key={t.slug} tool={t} onOpen={onOpenTool} />
          ))}
        </div>
      </section>

      {/* Statistik */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: "Governance-områder", value: categories.length, color: "text-foreground" },
          { label: "Sporede emner", value: totalItems, color: "text-info" },
          { label: "Kritiske områder", value: criticalCount, color: "text-danger" },
          { label: "Kilder", value: 12, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5 border-glow">
            <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Søjler */}
      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => {
          const pillarCats = getCategoriesByPillar(pillar.id);
          const criticals = pillarCats.reduce(
            (sum, c) => sum + c.subcategories.filter((s) => s.severity === "critical").length,
            0
          );
          return (
            <button
              key={pillar.id}
              onClick={() => onNavigate("pillar", pillar.id)}
              className="card-hover group rounded-xl border border-border bg-card p-6 text-left"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{pillar.icon}</span>
                {criticals > 0 && (
                  <span className="rounded-full bg-danger/15 px-2.5 py-0.5 text-xs font-medium text-danger">
                    {criticals} kritiske
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {pillar.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-primary">{pillar.subtitle}</p>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{pillar.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{pillarCats.length} områder</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Tværgående tema: Agent governance - en linse PÅ TVÆRS af de tre søjler, ikke en 4. søjle */}
      <button
        onClick={onOpenAgentic}
        className="card-hover group mt-6 flex w-full items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 text-left"
      >
        <span className="text-3xl leading-none">🤖</span>
        <div className="min-w-0 flex-1">
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            Tema · på tværs af søjlerne
          </span>
          <p className="mt-2 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            Agent governance
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {agentCount} emner om styring af autonome agenter - samlet på tværs af Organisering, Udvikling og Drift.
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary sm:inline-flex">
          Åbn tema <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>

      <InlineNewsletterPrompt
        hook="Få et månedligt overblik på 5 minutter"
        topic="AI governance: nye rammeværker (NIST/ISO 42001), agent-runtime-praksis, dansk regulering og operationelle eksempler"
      />

      {/* Primære kilder */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Primære kilder</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://airc.nist.gov/airmf-resources/playbook/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-info/10 font-display text-[10px] font-bold text-info text-center leading-tight">
              NIST<br/>AI RMF
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">NIST AI Risk Management Framework</p>
              <p className="mt-1 text-xs text-muted-foreground">Govern - Map - Measure - Manage. Frivilligt men de facto-baseline for AI-governance. GenAI-profilen (NIST AI 600-1) tilføjer 200+ kontroller for LLM-systemer.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
          <a
            href="https://www.iso.org/standard/42001"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-info/10 font-display text-[10px] font-bold text-info text-center leading-tight">
              ISO<br/>42001
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">ISO/IEC 42001:2023</p>
              <p className="mt-1 text-xs text-muted-foreground">Certificerbar standard for AI Management Systems (AIMS). Forventet markedsstandard for AI-governance-assurance.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
          <a
            href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-[10px] font-bold text-primary text-center leading-tight">
              EU<br/>AI Act
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">EU AI Act</p>
              <p className="mt-1 text-xs text-muted-foreground">Regulation 2024/1689. Governance-artikler: art. 4 literacy, art. 9 risikostyring, art. 14 oversight, art. 26 deployer-pligter, art. 27 FRIA, art. 73 incident reporting.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
          <a
            href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-danger/10 font-display text-[10px] font-bold text-danger text-center leading-tight">
              OWASP<br/>Agentic
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">OWASP Top 10 for Agentic Applications 2026</p>
              <p className="mt-1 text-xs text-muted-foreground">Det førende framework for agent-governance. Planning, tool use, identity, memory, cascading failures, rogue agents - kerneområdet for 2026.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
          <a
            href="https://oecd.ai/en/ai-principles"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/10 font-display text-[10px] font-bold text-warning text-center leading-tight">
              OECD<br/>AI
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">OECD AI Principles (2024)</p>
              <p className="mt-1 text-xs text-muted-foreground">Soft law med stærk international vægt. Inclusive growth, fairness, transparency, robustness, accountability - basis for både EU AI Act og Council of Europe Framework Convention.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
          <a
            href="https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/10 font-display text-[10px] font-bold text-warning text-center leading-tight">
              MS<br/>RAI
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">Microsoft Responsible AI Standard v2</p>
              <p className="mt-1 text-xs text-muted-foreground">Mainstream operationelt framework. Sensitive uses, oversight requirements, impact assessment - bredt adopteret i enterprise AI-governance.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
        </div>
      </div>

      <NewsFeed />
    </div>
  );
}

// ── Nyheds-feed (læser public/news.json, genereret ugentligt af scripts/fetch-news.ts) ──
type NewsData = { generatedAt: string; items: { title: string; link: string; source: string; date: string }[] };

function NewsFeed() {
  const [data, setData] = useState<NewsData | null>(null);
  useEffect(() => {
    fetch("/news.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null));
  }, []);
  if (!data || !data.items?.length) return null;
  const fmt = (iso: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };
  return (
    <section aria-labelledby="news-heading" className="mt-10 rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="news-heading" className="font-display text-lg font-semibold text-foreground">📰 Nyheder &amp; opdateringer</h2>
        <span className="text-[11px] text-muted-foreground">Opdateret {fmt(data.generatedAt)}</span>
      </div>
      <div className="grid gap-2">
        {data.items.map((it) => (
          <a
            key={it.link}
            href={it.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-start gap-3 rounded-lg border border-border bg-card/60 p-3 text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{it.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {it.source}{it.date ? ` · ${fmt(it.date)}` : ""}
              </p>
            </div>
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">Kuraterede nyheder fra autoritative kilder - opdateres ugentligt.</p>
    </section>
  );
}

// ── Værktøj: Agent decision-class matrix (for subkategori 1.4.4) ──
function AgentDecisionClassMatrix() {
  // Cells: [oversight mode][decision class] = policy text
  const cols = [
    { id: "auton", label: "Autonom", note: "Agent handler selv" },
    { id: "hitl", label: "Human-in-loop", note: "Menneskelig review pr. handling" },
    { id: "twop", label: "Two-person rule", note: "To navngivne personer godkender" },
  ];
  const rows = [
    {
      id: "read",
      label: "Read-only",
      example: "fx hente data, læse mail, lave sammenfatninger",
      cells: {
        auton: { kind: "ok", text: "Default OK" },
        hitl: { kind: "info", text: "Audit-log" },
        twop: { kind: "muted", text: "Overkill - sjældent relevant" },
      },
    },
    {
      id: "draft",
      label: "Draft / Forslag",
      example: "fx skrive udkast til mail, generere kode-PR, foreslå klassificering",
      cells: {
        auton: { kind: "info", text: "Log + monitor" },
        hitl: { kind: "ok", text: "Default OK" },
        twop: { kind: "warn", text: "Kun ved høj-risiko" },
      },
    },
    {
      id: "commit",
      label: "Commit / Eksekvering",
      example: "fx sende mail, oprette ticket, opdatere CRM-felt, betale faktura under tærskel",
      cells: {
        auton: { kind: "warn", text: "Approval-gate eller forhåndsgodkendt scope" },
        hitl: { kind: "ok", text: "Default OK" },
        twop: { kind: "info", text: "Krav i finans / HR" },
      },
    },
    {
      id: "irrev",
      label: "Irreversibel",
      example: "fx slette data, lukke konti, ekstern udmelding, kontrakt-underskrift",
      cells: {
        auton: { kind: "block", text: "Forbudt by default" },
        hitl: { kind: "warn", text: "Approval-gate" },
        twop: { kind: "ok", text: "Default for høj-konsekvens" },
      },
    },
  ];

  const cellStyle = (kind: string) => {
    switch (kind) {
      case "ok":
        return "bg-success/15 text-success border-success/30";
      case "info":
        return "bg-info/15 text-info border-info/30";
      case "warn":
        return "bg-warning/15 text-warning border-warning/30";
      case "block":
        return "bg-danger/15 text-danger border-danger/30";
      default:
        return "bg-muted/30 text-muted-foreground border-border";
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Værktøj</span>
        <h3 className="font-display text-lg font-semibold text-foreground">Agent beslutnings-klasse matrix</h3>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Brug matrixen til at sætte politik pr. agent: hvilken type beslutning må agenten træffe, og hvilken oversight-mode kræver det? Cellerne er <em>default-politikker</em> - virksomheden kan stramme eller løsne efter use case-risiko, men skal eksplicit dokumentere afvigelser.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="w-[18%] p-2 text-left align-bottom font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">Beslutnings-klasse</th>
              {cols.map((c) => (
                <th key={c.id} className="p-2 text-left align-bottom">
                  <p className="font-display text-xs font-semibold text-foreground">{c.label}</p>
                  <p className="mt-0.5 text-[10px] font-normal text-muted-foreground">{c.note}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border/40">
                <th className="p-3 text-left align-top">
                  <p className="font-display text-sm font-semibold text-foreground">{row.label}</p>
                  <p className="mt-1 text-[10px] font-normal text-muted-foreground">{row.example}</p>
                </th>
                {cols.map((c) => {
                  const cell = row.cells[c.id as keyof typeof row.cells];
                  return (
                    <td key={c.id} className="p-2 align-top">
                      <div className={`rounded-md border px-2.5 py-2 ${cellStyle(cell.kind)}`}>
                        <p className="text-[11px] font-medium leading-snug">{cell.text}</p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-[10px]">
        {[
          { kind: "ok", label: "Default OK" },
          { kind: "info", label: "Log / dokumenter" },
          { kind: "warn", label: "Approval-gate" },
          { kind: "block", label: "Forbudt by default" },
        ].map((legend) => (
          <span key={legend.kind} className="inline-flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded ${cellStyle(legend.kind).split(" ")[0]}`} />
            <span className="text-muted-foreground">{legend.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Værktøj: AI Council RACI matrix (for kategori 1.2 roller-ansvar) ──
function AiCouncilRaci() {
  const cols = [
    { id: "council", label: "AI Council", note: "Tværfagligt forum" },
    { id: "board", label: "Bestyrelse", note: "Strategisk tilsyn" },
    { id: "model", label: "Model Owner", note: "Teknisk ejer" },
    { id: "risk", label: "Risk Owner", note: "Forretningsejer" },
    { id: "dpo", label: "DPO", note: "Databeskyttelse" },
    { id: "2L", label: "2L Compliance", note: "Uafhængigt risk-team" },
    { id: "3L", label: "3L Audit", note: "Intern revision" },
  ];

  const rows: { activity: string; example: string; cells: Record<string, "R" | "A" | "C" | "I" | "-"> }[] = [
    {
      activity: "Vedtage AI-strategi & risikoappetit",
      example: "Årlig strategi, no-go-områder, KPI'er",
      cells: { council: "C", board: "A", model: "I", risk: "C", dpo: "I", "2L": "C", "3L": "I" },
    },
    {
      activity: "Godkende ny use case (intake)",
      example: "Triage før PoC-start",
      cells: { council: "A", board: "I", model: "R", risk: "C", dpo: "C", "2L": "C", "3L": "-" },
    },
    {
      activity: "EU AI Act-risikoklassificering",
      example: "Forbudt / højrisiko / begrænset / minimal",
      cells: { council: "I", board: "-", model: "R", risk: "A", dpo: "C", "2L": "C", "3L": "-" },
    },
    {
      activity: "FRIA-gennemførelse (Art. 27)",
      example: "Højrisiko + offentlige myndigheder/banker/forsikring",
      cells: { council: "I", board: "I", model: "C", risk: "A", dpo: "R", "2L": "C", "3L": "-" },
    },
    {
      activity: "Leverandør- og GPAI-valg",
      example: "Foundation model, MCP-servere, agent platforms",
      cells: { council: "C", board: "I", model: "R", risk: "A", dpo: "C", "2L": "C", "3L": "-" },
    },
    {
      activity: "Produktion-go-live beslutning",
      example: "Efter PoC, før release til endusers",
      cells: { council: "A", board: "I", model: "R", risk: "C", dpo: "C", "2L": "C", "3L": "-" },
    },
    {
      activity: "Alvorlig hændelsesrapportering (Art. 73)",
      example: "Eskalering til myndighed inden 15 dage",
      cells: { council: "I", board: "I", model: "R", risk: "A", dpo: "C", "2L": "R", "3L": "I" },
    },
    {
      activity: "Retraining & modelversion",
      example: "Drift, datavurdering, champion/challenger",
      cells: { council: "I", board: "-", model: "A", risk: "C", dpo: "I", "2L": "C", "3L": "-" },
    },
    {
      activity: "Decommissioning og arkivering",
      example: "Nedlukning + 10-årig retention for høj-risiko",
      cells: { council: "C", board: "-", model: "R", risk: "A", dpo: "C", "2L": "I", "3L": "I" },
    },
    {
      activity: "AI-policy & red-line revision",
      example: "Halvårlig politik-revision",
      cells: { council: "R", board: "A", model: "C", risk: "C", dpo: "C", "2L": "C", "3L": "I" },
    },
    {
      activity: "AI-literacy program (Art. 4)",
      example: "Dækningsgrad, certificering, training-records",
      cells: { council: "A", board: "I", model: "I", risk: "I", dpo: "C", "2L": "R", "3L": "I" },
    },
    {
      activity: "Intern audit-program for AI",
      example: "Årligt audit-plan, risikobaseret",
      cells: { council: "I", board: "C", model: "I", risk: "C", dpo: "I", "2L": "C", "3L": "A" },
    },
  ];

  const cellStyle = (v: string) => {
    switch (v) {
      case "R":
        return "bg-primary/15 text-primary border-primary/30";
      case "A":
        return "bg-danger/15 text-danger border-danger/30";
      case "C":
        return "bg-info/15 text-info border-info/30";
      case "I":
        return "bg-muted/40 text-muted-foreground border-border";
      default:
        return "bg-transparent text-muted-foreground/40 border-transparent";
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Værktøj</span>
        <h3 className="font-display text-lg font-semibold text-foreground">AI Council RACI</h3>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Default RACI-allokering for governance-beslutninger på tværs af typiske roller. Brug som udgangspunkt for jeres egen - udskift roller efter jeres organisationsstruktur, og dokumentér afvigelser. <strong className="text-foreground">R</strong> = Responsible · <strong className="text-foreground">A</strong> = Accountable · <strong className="text-foreground">C</strong> = Consulted · <strong className="text-foreground">I</strong> = Informed.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[30%] bg-card p-2 text-left align-bottom font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">Beslutning / aktivitet</th>
              {cols.map((c) => (
                <th key={c.id} className="p-2 text-center align-bottom">
                  <p className="font-display text-[11px] font-semibold text-foreground">{c.label}</p>
                  <p className="mt-0.5 text-[9px] font-normal leading-tight text-muted-foreground">{c.note}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border/40">
                <th className="sticky left-0 z-10 bg-card/80 p-3 text-left align-top">
                  <p className="font-display text-[12px] font-semibold text-foreground">{row.activity}</p>
                  <p className="mt-0.5 text-[10px] font-normal text-muted-foreground">{row.example}</p>
                </th>
                {cols.map((c) => {
                  const v = row.cells[c.id] ?? "-";
                  return (
                    <td key={c.id} className="p-1.5 align-middle">
                      <div className={`mx-auto flex h-7 w-7 items-center justify-center rounded border font-display text-xs font-bold ${cellStyle(v)}`}>
                        {v === "-" ? "" : v}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-1.5 text-[10px] md:grid-cols-4">
        {[
          { v: "R", label: "Responsible - udfører arbejdet" },
          { v: "A", label: "Accountable - bærer det endelige ansvar" },
          { v: "C", label: "Consulted - input før beslutning" },
          { v: "I", label: "Informed - orienteres efter" },
        ].map((legend) => (
          <span key={legend.v} className="inline-flex items-center gap-1.5">
            <span className={`inline-flex h-4 w-4 items-center justify-center rounded border font-display text-[9px] font-bold ${cellStyle(legend.v)}`}>{legend.v}</span>
            <span className="text-muted-foreground">{legend.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Værktøj: Use case-livscyklus flow (for Pillar 2 udvikling) ──
function UseCaseLifecycleFlow() {
  const stages = [
    { icon: "📥", name: "Intake", owner: "AI Council", gate: "Use case registreret i kataloget", kill: "Forbudt praksis identificeret" },
    { icon: "🔍", name: "Triage", owner: "2L Compliance", gate: "Risikoklasse foreløbig vurderet", kill: "Outside risk appetite eller red line" },
    { icon: "🏷️", name: "Klassificering", owner: "Risk Owner", gate: "EU AI Act-klasse + intern matrix sign-off", kill: "Forbudt eller udenfor mandat" },
    { icon: "🧪", name: "PoC", owner: "Model Owner", gate: "Eval suite + data scope defineret", kill: "Success criteria ikke nået" },
    { icon: "✅", name: "Pre-launch eval", owner: "2L + Model Owner", gate: "Bias-test + red team + model card", kill: "Højrisiko ikke afhjulpet" },
    { icon: "🚀", name: "Go-live", owner: "AI Council", gate: "Human oversight wired + kill switch testet", kill: "Manglende incident-plan" },
    { icon: "📊", name: "Drift & monitor", owner: "Model Owner + 2L", gate: "Drift-tærskler defineret + alarmer", kill: "Performance under SLO" },
    { icon: "🔄", name: "Retraining / decommission", owner: "Model Owner", gate: "Trigger valideret (tid/drift/regulering)", kill: "Sunset-plan eksekveret" },
  ];

  return (
    <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Værktøj</span>
        <h3 className="font-display text-lg font-semibold text-foreground">Use case-livscyklus</h3>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Workflowet fra idé til afvikling. Hver gate har en navngiven ejer, et adgangskriterium og et kill-kriterium. Brug som skabelon - udfyld faktiske navne i jeres egen organisation.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage, i) => (
          <div key={stage.name} className="relative rounded-lg border border-border bg-card p-3">
            <div className="absolute -left-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {i + 1}
            </div>
            <p className="mb-1 text-lg">{stage.icon}</p>
            <p className="font-display text-[12px] font-semibold leading-tight text-foreground">{stage.name}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">Ejer</p>
            <p className="text-[11px] font-medium text-foreground">{stage.owner}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-success">Gate</p>
            <p className="text-[11px] leading-snug text-muted-foreground">{stage.gate}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-danger">Kill</p>
            <p className="text-[11px] leading-snug text-muted-foreground">{stage.kill}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Bemærk: ejer-rollerne hænger sammen med <strong className="text-foreground">AI Council RACI</strong>-matrixen i kategori 1.2. Et use case kan kun bevæge sig til næste fase når gate er opfyldt - kill-kriterier skal også checkes løbende.
      </p>
    </div>
  );
}

// ── Værktøj: Agent runtime control-plane diagram (marquee for governance) ──
function AgentRuntimeControlPlane() {
  const layers = [
    {
      icon: "📥",
      title: "Request",
      role: "Indgang",
      detail: "Bruger-prompt, automatiseret event, agent-til-agent kald",
      controls: ["Rate limiting per principal", "Source tagging (intern / ekstern / agent)", "Input-sanitisering"],
      kind: "input",
    },
    {
      icon: "🪪",
      title: "Identitet & autorisation",
      role: "Hvem er agenten? Hvilken principal?",
      detail: "Non-Human Identity lookup, scoped credentials, kort-lived tokens",
      controls: ["Unik agent-identitet (ikke shared service account)", "Principal-binding til menneskelig ejer", "Auto-deprovisioning ved off-board"],
      kind: "policy",
    },
    {
      icon: "📜",
      title: "Policy engine",
      role: "Hvad må agenten gøre her?",
      detail: "Deterministisk regel-engine (OPA / Cedar) - ikke LLM-self-check",
      controls: ["Tool allowlist + scope per agent", "Decision class (read / draft / commit / irreversible)", "Budget: token + tool-call + spend"],
      kind: "policy",
    },
    {
      icon: "🧠",
      title: "Plan-validering",
      role: "Er den planlagte handling acceptabel?",
      detail: "Pre-execution check - særligt for irreversible handlinger",
      controls: ["Prompt-injection detection (instruktion vs data)", "Irreversibel-handling flag", "Sandbox-eksekvering for nye skills"],
      kind: "policy",
    },
    {
      icon: "⚙️",
      title: "Eksekvering + memory",
      role: "Faktisk handling - tool calls + state",
      detail: "Tool invocation, memory writes, A2A coordination",
      controls: ["Mutual auth mellem agenter (Verifiable Credentials)", "Memory-skrivning logget + klassificeret", "Loop-detektion: max N hops"],
      kind: "exec",
    },
    {
      icon: "📡",
      title: "Observability",
      role: "Hvad skete der, hvorfor?",
      detail: "OpenTelemetry GenAI semconv - strukturerede spans for hver agent-handling",
      controls: ["Audit trail: input, plan, tool calls, output, log-hash", "Anomaly detection mod adfærds-baseline", "Cost dashboard real-time"],
      kind: "monitor",
    },
    {
      icon: "👁️",
      title: "Human oversight",
      role: "Sampling, eskalering, override",
      detail: "Tieret menneskelig kontrol - ikke alt skal eskalere",
      controls: ["Tier 1 lav-risiko: sampling-review (1 %)", "Tier 2 medium: real-time approval på grænser", "Tier 3 høj-risiko: two-person rule for irreversible"],
      kind: "human",
    },
  ];

  const kindStyle = (kind: string) => {
    switch (kind) {
      case "input":
        return "border-info/40 bg-info/10";
      case "policy":
        return "border-primary/40 bg-primary/10";
      case "exec":
        return "border-warning/40 bg-warning/10";
      case "monitor":
        return "border-info/40 bg-info/10";
      case "human":
        return "border-success/40 bg-success/10";
      default:
        return "border-border bg-card";
    }
  };
  const kindBadge = (kind: string) => {
    switch (kind) {
      case "input":
        return "bg-info/20 text-info";
      case "policy":
        return "bg-primary/20 text-primary";
      case "exec":
        return "bg-warning/20 text-warning";
      case "monitor":
        return "bg-info/20 text-info";
      case "human":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const kindLabel = (kind: string) => {
    switch (kind) {
      case "input":
        return "Indgang";
      case "policy":
        return "Policy";
      case "exec":
        return "Eksekvering";
      case "monitor":
        return "Observability";
      case "human":
        return "Menneskelig";
      default:
        return "";
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Værktøj</span>
        <h3 className="font-display text-lg font-semibold text-foreground">🛰️ Agent runtime control-plane</h3>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Hvad sker der hvert gang en agent håndterer en request? Brug arkitekturen som tjekliste: hvert lag er en governance-overflade hvor jeres organisation skal kunne svare <em>"hvilken kontrol har vi her?"</em>
      </p>
      <div className="flex flex-col gap-2">
        {layers.map((layer, i) => (
          <div key={layer.title}>
            <div className={`rounded-lg border p-4 ${kindStyle(layer.kind)}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{layer.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="font-display text-sm font-semibold text-foreground">{layer.title}</h4>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${kindBadge(layer.kind)}`}>{kindLabel(layer.kind)}</span>
                    <span className="text-[11px] text-muted-foreground"> - {layer.role}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground">{layer.detail}</p>
                  <ul className="mt-2 grid gap-1 md:grid-cols-3">
                    {layer.controls.map((c, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[11px] text-foreground/90">
                        <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span className="leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="h-3 w-0.5 bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-muted-foreground">
        Reference: OWASP Top 10 for Agentic Applications 2026, OpenTelemetry GenAI semantic conventions, CSA Non-Human Identity Governance v1, MCP Authorization spec 2026-03-15.
      </p>
    </div>
  );
}

// ── Værktøj: AI maturity radar (interaktivt selvassessment for 3.6) ──
type RadarAxis = {
  id: string;
  label: string;
  levels: string[];
};

function RadarChart({ axes, values, size = 320 }: { axes: RadarAxis[]; values: number[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 50;
  // Horizontal/vertical padding in the viewBox so axis labels (which extend
  // beyond R) aren't clipped at the SVG edge. Kept symmetric so the chart stays
  // square; element width/height stay = size, so no layout reflow.
  const PAD = 64;
  const N = axes.length;
  const maxValue = 4;

  const angle = (i: number) => -Math.PI / 2 + (i / N) * 2 * Math.PI;
  const point = (i: number, v: number): [number, number] => {
    const r = (v / maxValue) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const polygonPoints = values.map((v, i) => point(i, Math.max(0.05, v)).join(",")).join(" ");
  const guides = [1, 2, 3, 4].map((lvl) =>
    axes.map((_, i) => point(i, lvl).join(",")).join(" ")
  );

  return (
    <svg width={size} height={size} viewBox={`${-PAD} ${-PAD} ${size + PAD * 2} ${size + PAD * 2}`} className="shrink-0">
      {guides.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={i === 3 ? 1.5 : 1}
          strokeOpacity={0.4 + i * 0.1}
        />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, maxValue);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth="1" />;
      })}
      <polygon
        points={polygonPoints}
        fill="hsl(var(--primary) / 0.25)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        if (v === 0) return null;
        const [x, y] = point(i, v);
        return <circle key={i} cx={x} cy={y} r="4" fill="hsl(var(--primary))" />;
      })}
      {axes.map((axis, i) => {
        const labelR = R + 24;
        const a = angle(i);
        const x = cx + labelR * Math.cos(a);
        const y = cy + labelR * Math.sin(a);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="hsl(var(--foreground))"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

function GovernanceMaturityRadar() {
  const axes: RadarAxis[] = [
    {
      id: "govern",
      label: "Strategi & Mandat",
      levels: [
        "Ad hoc - ingen formel AI-strategi eller bestyrelsesmandat",
        "Defineret - skrevet AI-strategi godkendt af direktion, no-go-områder dokumenteret",
        "Styret - kvartalsvis bestyrelses-rapportering, navngiven C-leder med stop-build authority",
        "Optimeret - AI-strategi integreret i forretningsstrategi, KPI'er målt og publiceret",
      ],
    },
    {
      id: "map",
      label: "Use case-livscyklus",
      levels: [
        "Ad hoc - use cases starter uden formel proces",
        "Defineret - intake-form, triage, klassificeringsproces",
        "Styret - alle 8 lifecycle-gates implementeret, kill-criteria defineret",
        "Optimeret - automatisk klassificering, portefølje-dashboard, kvartalsvis kill rate",
      ],
    },
    {
      id: "measure",
      label: "Risiko & evaluering",
      levels: [
        "Ad hoc - ingen formel testning før produktion",
        "Defineret - bias-test + accuracy-test før release",
        "Styret - red team-events, dansk-sproget eval-suite, model cards",
        "Optimeret - kontinuerlig adversarial testing i CI/CD, ekstern audit",
      ],
    },
    {
      id: "manage",
      label: "Drift & monitorering",
      levels: [
        "Ad hoc - vi ser kun når det fejler",
        "Defineret - drift-monitoring + alarmer per model",
        "Styret - bias re-måling, audit-trail, hændelsesrapport-proces (Art. 73)",
        "Optimeret - fuld telemetri, automatisk rollback, post-mortem-disciplin",
      ],
    },
    {
      id: "agent",
      label: "Agent governance",
      levels: [
        "Ad hoc - vi har ingen agenter i prod (eller vi ved det ikke)",
        "Defineret - agent-register, eksplicit tool-allowlist per agent",
        "Styret - non-human identity governance, policy engine, decision-class matrix",
        "Optimeret - kontinuerlig rogue-detection, A2A-policy, agent-observability via OTel",
      ],
    },
    {
      id: "audit",
      label: "Audit & assurance",
      levels: [
        "Ad hoc - ingen formel revision af AI",
        "Defineret - årligt 3LoD-audit-program",
        "Styret - ekstern revision hvert 3. år, modenhedsvurdering mod NIST tier-model",
        "Optimeret - ISO 42001-certificeret, kontinuerlig assurance, horizon scanning",
      ],
    },
  ];

  const [values, setValues] = useState<number[]>(() => axes.map(() => 0));
  const setLevel = (axisIndex: number, level: number) => {
    setValues((prev) => prev.map((v, i) => (i === axisIndex ? level : v)));
  };

  const totalAssessed = values.filter((v) => v > 0).length;
  const avg = totalAssessed > 0 ? (values.reduce((a, b) => a + b, 0) / totalAssessed).toFixed(1) : " - ";

  // Map average score to NIST RMF-inspired tier label
  const tierLabel = (avg: string) => {
    if (avg === " - ") return "Ikke vurderet";
    const a = parseFloat(avg);
    if (a < 1.5) return "Partial (NIST Tier 1)";
    if (a < 2.5) return "Risk Informed (Tier 2)";
    if (a < 3.5) return "Repeatable (Tier 3)";
    return "Adaptive (Tier 4)";
  };

  return (
    <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Værktøj</span>
        <h3 className="font-display text-lg font-semibold text-foreground">AI governance maturity - selvassessment</h3>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Vurder jeres AI-governance-modenhed på 6 dimensioner (NIST AI RMF-inspireret + agent governance). Klik et niveau under hver akse - radaret opdaterer live. Brug resultatet som baseline for jeres roadmap.
      </p>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-3">
          <RadarChart axes={axes} values={values} />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Gennemsnit</p>
            <p className="font-display text-2xl font-bold text-primary">
              {avg}
              <span className="text-sm text-muted-foreground">/4</span>
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">{tierLabel(avg)}</p>
            <p className="text-[10px] text-muted-foreground">{totalAssessed}/{axes.length} akser vurderet</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {axes.map((axis, i) => (
            <div key={axis.id}>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="font-display text-sm font-semibold text-foreground">{axis.label}</p>
                <p className="text-[10px] text-muted-foreground">Niveau {values[i] || " - "}</p>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((lvl) => {
                  const selected = values[i] === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(i, lvl)}
                      className={`flex-1 rounded-md border px-2 py-1.5 text-[11px] text-left transition-colors ${selected ? "border-primary bg-primary/20 text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`}
                      title={axis.levels[lvl - 1]}
                    >
                      <span className="font-display text-[10px] font-bold uppercase">{lvl === 1 ? "Initial" : lvl === 2 ? "Defineret" : lvl === 3 ? "Styret" : "Optimeret"}</span>
                    </button>
                  );
                })}
              </div>
              {values[i] > 0 && (
                <p className="mt-1.5 text-[11px] leading-snug text-foreground/80">{axis.levels[values[i] - 1]}</p>
              )}
            </div>
          ))}
          <button
            onClick={() => setValues(axes.map(() => 0))}
            className="self-start text-[11px] text-muted-foreground hover:text-primary"
          >
            Nulstil
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pillar View ──
function PillarView({
  pillar,
  onNavigate,
  onBack,
  onOpenTool,
}: {
  pillar: PillarId;
  onNavigate: (v: View, p?: PillarId, c?: Category) => void;
  onBack: () => void;
  onOpenTool: (slug: string) => void;
}) {
  const pillarData = pillars.find((p) => p.id === pillar)!;
  const pillarCats = getCategoriesByPillar(pillar);

  return (
    <div className="fade-in">
      <Breadcrumbs
        pillar={{ id: pillarData.id, name: pillarData.name }}
        onHome={onBack}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{pillarData.icon}</span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{pillarData.name}</h1>
            <p className="text-sm text-primary">{pillarData.subtitle}</p>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{pillarData.description}</p>
      </div>

      {/* Værktøj: Use case-livscyklus (kun for Pillar 2 Udvikling & Leverance) */}
      {pillar === "udvikling" && (
        <div className="mb-6">
          <ToolTeaserCard tool={getTool("use-case-livscyklus")} onOpen={onOpenTool} />
        </div>
      )}

      <div className="grid gap-4">
        {pillarCats.map((cat) => {
          const criticals = cat.subcategories.filter((s) => s.severity === "critical").length;
          const highs = cat.subcategories.filter((s) => s.severity === "high").length;
          return (
            <button
              key={cat.id}
              onClick={() => onNavigate("category", pillar, cat)}
              className="card-hover flex items-center gap-5 rounded-lg border border-border bg-card p-5 text-left"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-foreground">{cat.name}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                <div className="mt-2 flex gap-2">
                  {criticals > 0 && (
                    <span className="rounded bg-danger/15 px-2 py-0.5 text-[10px] font-medium text-danger">
                      {criticals} kritiske
                    </span>
                  )}
                  {highs > 0 && (
                    <span className="rounded bg-warning/15 px-2 py-0.5 text-[10px] font-medium text-warning">
                      {highs} høje
                    </span>
                  )}
                  <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {cat.subcategories.length} krav
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Category View ──
function CategoryView({
  category,
  onNavigate,
  onBack,
  onOpenTool,
}: {
  category: Category;
  onNavigate: (v: View, p?: PillarId, c?: Category, s?: Subcategory) => void;
  onBack: () => void;
  onOpenTool: (slug: string) => void;
}) {
  const [expandedSource, setExpandedSource] = useState(false);
  const [sevFilter, setSevFilter] = useState<"all" | Severity>("all");
  const sevOrder: Severity[] = ["critical", "high", "medium", "low"];
  const sevText: Record<string, string> = { all: "Alle", critical: "Kritisk", high: "Høj", medium: "Middel", low: "Lav" };
  const sevCount = (s: Severity) => category.subcategories.filter((x) => x.severity === s).length;
  const shownSubs = sevFilter === "all" ? category.subcategories : category.subcategories.filter((s) => s.severity === sevFilter);

  return (
    <div className="fade-in">
      <Breadcrumbs
        pillar={{ id: category.pillar, name: pillarName(category.pillar) }}
        category={{ id: category.id, name: category.name }}
        onHome={() => onNavigate("dashboard")}
        onPillar={() => onNavigate("pillar", category.pillar)}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{category.name}</h1>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{category.description}</p>
      </div>

      {/* Værktøjer: AI Council RACI + Agent runtime control-plane (teasere → canonical URL) */}
      {category.id === "roller-ansvar" && (
        <div className="mb-6">
          <ToolTeaserCard tool={getTool("ai-council-raci")} onOpen={onOpenTool} />
        </div>
      )}
      {category.id === "agent-runtime" && (
        <div className="mb-6">
          <ToolTeaserCard tool={getTool("agent-runtime-control-plane")} onOpen={onOpenTool} />
        </div>
      )}

      {/* Severity-filter-chips */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(["all", ...sevOrder] as ("all" | Severity)[]).map((key) => {
          const count = key === "all" ? category.subcategories.length : sevCount(key as Severity);
          if (count === 0) return null;
          const active = sevFilter === key;
          return (
            <button
              key={key}
              onClick={() => setSevFilter(key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {sevText[key]} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Underkategorier */}
      <div className="mb-8 grid gap-4">
        {shownSubs.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onNavigate("subcategory", category.pillar, category, sub)}
            className={`card-hover rounded-lg border p-5 text-left ${getSeverityBg(sub.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-semibold text-foreground">{sub.name}</p>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${getSeverityColor(sub.severity)}`}>
                    {sub.severity === "critical" ? "kritisk" : sub.severity === "high" ? "høj" : sub.severity === "medium" ? "middel" : "lav"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{sub.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sub.tags.map((tag) => (
                    <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="ml-4 mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      {/* Kildelinks */}
      <div className="rounded-lg border border-border bg-card p-5">
        <button
          onClick={() => setExpandedSource(!expandedSource)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="font-display text-sm font-semibold text-foreground">
            📎 Kildereferencer ({category.sourceLinks.length})
          </h3>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSource ? "rotate-180" : ""}`} />
        </button>
        {expandedSource && (
          <div className="mt-4 grid gap-2">
            {category.sourceLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded border border-border p-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getSourceBadgeClass(link.source)}`}>
                  {link.source}
                </span>
                <span className="flex-1">{link.label}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Subcategory View ──
function SubcategoryView({
  subcategory,
  category,
  onNavigate,
  onOpenTool,
  onBook,
}: {
  subcategory: Subcategory;
  category: Category;
  onNavigate: (v: View, p?: PillarId, c?: Category, s?: Subcategory) => void;
  onOpenTool: (slug: string) => void;
  onBook: () => void;
}) {
  return (
    <div className="fade-in max-w-3xl">
      <Breadcrumbs
        pillar={{ id: category.pillar, name: pillarName(category.pillar) }}
        category={{ id: category.id, name: category.name }}
        subcategory={{ id: subcategory.id, name: subcategory.name }}
        onHome={() => onNavigate("dashboard")}
        onPillar={() => onNavigate("pillar", category.pillar)}
        onCategory={() => onNavigate("category", category.pillar, category)}
      />

      {/* Header */}
      <div className={`mb-8 rounded-xl border p-6 ${getSeverityBg(subcategory.severity)}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{category.icon}</span>
          <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${getSeverityColor(subcategory.severity)}`}>
            {subcategory.severity === "critical" ? "kritisk" : subcategory.severity === "high" ? "høj" : subcategory.severity === "medium" ? "middel" : "lav"} prioritet
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">{subcategory.name}</h1>
        <p className="mt-3 text-sm text-secondary-foreground leading-relaxed">{subcategory.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {subcategory.tags.map((tag) => (
            <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Værktøj: Agent beslutnings-klasse matrix (kun for subkategori 1.4.4) - 
          bevidst inline: det ER svaret på underkategoriens spørgsmål. */}
      {subcategory.id === "beslutnings-graenser" && <AgentDecisionClassMatrix />}
      {subcategory.id === "modenhed" && (
        <div className="mb-6">
          <ToolTeaserCard tool={getTool("governance-modenhed")} onOpen={onOpenTool} />
        </div>
      )}

      {/* Handlingspunkter */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">✅ Praktiske handlinger</h3>
        <div className="grid gap-3">
          {subcategory.actions.map((action, i) => (
            <div key={i} className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success">
                {i + 1}
              </div>
              <p className="text-sm text-secondary-foreground">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detaljerede referencer */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
          🔗 Detaljerede referencer
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Klik igennem for original lovgivning, vejledning og standarder.
        </p>
        <div className="grid gap-2">
          {subcategory.sourceLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover flex items-center gap-3 rounded-lg border border-border p-4"
            >
              <span className={`rounded px-2 py-1 text-[10px] font-bold ${getSourceBadgeClass(link.source)}`}>
                {link.source}
              </span>
              <span className="flex-1 text-sm text-secondary-foreground">{link.label}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>

      {/* Sparring CTA */}
      <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
        <h3 className="font-display text-lg font-semibold text-foreground">Brug for sparring på dette governance-tema?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Book et 30-min sparringsmøde med SOLUTION8 - vi hjælper danske organisationer med at bygge praktisk AI-governance, fra roller og politikker til agent- og skill-styring.
        </p>
        <button
          type="button"
          onClick={onBook}
          className="mt-4 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Book 30-min sparring
        </button>
      </div>
    </div>
  );
}

// ── Newsletter + main CTA strip ──
const MAILERLITE_ACTION = "https://assets.mailerlite.com/jsonp/1571946/forms/189012812467536974/subscribe";

function InlineNewsletterPrompt({ hook, topic }: { hook: string; topic: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("fields[email]", email);
      formData.append("fields[source_website]", "ai-governance.dk"); // hidden - segments signups by site in MailerLite
      formData.append("ml-submit", "1");
      formData.append("anticsrf", "true");
      await fetch(MAILERLITE_ACTION, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="md:max-w-md">
          <h3 className="font-display text-base font-semibold text-foreground">📬 {hook}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Månedlig opdatering om {topic}. Ingen spam, afmeld når som helst.</p>
        </div>
        {status === "success" ? (
          <div className="rounded-md border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
            ✓ Tilmeldt - tjek din indbakke
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row md:w-auto md:max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="din@email.dk"
              disabled={status === "loading"}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? "Tilmelder…" : "Tilmeld"}
            </button>
          </form>
        )}
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-danger">Noget gik galt. Prøv igen om lidt.</p>
      )}
    </section>
  );
}

function NewsletterCTA({ showBooking = true, onBook }: { showBooking?: boolean; onBook: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("fields[email]", email);
      formData.append("fields[source_website]", "ai-governance.dk"); // hidden - segments signups by site in MailerLite
      formData.append("ml-submit", "1");
      formData.append("anticsrf", "true");
      await fetch(MAILERLITE_ACTION, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="border-t border-border bg-card/30 py-12">
      <div className={`container mx-auto px-6 ${showBooking ? "grid gap-8 md:grid-cols-2" : "max-w-2xl"}`}>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold text-foreground">📬 Nyhedsbrev: AI Governance i praksis</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Månedlig opdatering om governance-rammeværker, agent-styring, NIST/ISO-opdateringer, og praktiske erfaringer fra danske organisationer.
          </p>
          {status === "success" ? (
            <div className="mt-4 rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success">
              ✓ Tak! Du er nu tilmeldt - tjek din indbakke for bekræftelse.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="din@email.dk"
                disabled={status === "loading"}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "Tilmelder…" : "Tilmeld"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-danger">Noget gik galt. Prøv igen om lidt.</p>
          )}
        </div>
        {showBooking && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">🗓️ Book 30-min sparring</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Konkret sparring om jeres governance-situation - strategi, roller, AI Council, agent- og skill-governance, audit-readiness eller noget helt andet.
            </p>
            <button
              type="button"
              onClick={onBook}
              className="mt-4 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Book et møde
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Værktøjs-teaser-kort (erstatter inline-rendering på indholdssider) ──
function ToolTeaserCard({ tool, onOpen }: { tool: ToolConfig; onOpen: (slug: string) => void }) {
  return (
    <button
      onClick={() => onOpen(tool.slug)}
      className="card-hover group flex h-full w-full items-start gap-4 rounded-xl border border-primary/30 bg-primary/5 p-5 text-left"
    >
      <span className="text-2xl leading-none">{tool.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Værktøj</span>
          <p className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{tool.shortPitch}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
          Åbn værktøj <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

// ── Værktøjs-oversigt (/vaerktoejer) ──
function ToolsIndex({ onHome, onOpenTool }: { onHome: () => void; onOpenTool: (slug: string) => void }) {
  return (
    <div className="fade-in">
      <Breadcrumbs toolsRoot onHome={onHome} />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧰</span>
          <h1 className="font-display text-2xl font-bold text-foreground">Værktøjer</h1>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Interaktive værktøjer til AI-governance - livscyklus-flow, RACI-matrix, control-plane-arkitektur og modenheds-selvvurdering. Hvert værktøj har sin egen side, så det kan deles direkte på LinkedIn, i mail eller i en præsentation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <ToolTeaserCard key={tool.slug} tool={tool} onOpen={onOpenTool} />
        ))}
      </div>
    </div>
  );
}

// ── Værktøjs-side (/vaerktoejer/<slug>) ──
function ToolPage({ tool, onHome, onTools }: { tool: ToolConfig; onHome: () => void; onTools: () => void }) {
  const ToolComponent = tool.Component;
  const captureRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const downloadPng = async () => {
    if (!captureRef.current) return;
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image"); // lazy → own chunk, not in main bundle
      const bg = getComputedStyle(document.body).backgroundColor;
      const opts = { backgroundColor: bg, pixelRatio: 2, cacheBust: true };
      let dataUrl: string;
      try {
        dataUrl = await toPng(captureRef.current, opts);
      } catch {
        // Fallback if web-font embedding is blocked (CORS): system font, still a valid image
        dataUrl = await toPng(captureRef.current, { ...opts, skipFonts: true });
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `ai-governance-${tool.slug}.png`;
      a.click();
    } catch { /* capture failed */ }
    setBusy(false);
  };

  const actionBtn =
    "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60";

  return (
    <div className="fade-in">
      <Breadcrumbs tool={{ name: tool.title }} onHome={onHome} onTools={onTools} />

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{tool.icon}</span>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {tool.title} <span className="text-primary text-glow">Værktøj</span>
          </h1>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{tool.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={downloadPng} disabled={busy} className={actionBtn}>
            <Download className="h-3.5 w-3.5" /> {busy ? "Genererer…" : "Download PNG"}
          </button>
          <button onClick={copyLink} className={actionBtn}>
            <Copy className="h-3.5 w-3.5" /> {copied ? "Kopieret ✓" : "Kopiér link"}
          </button>
        </div>
      </div>

      <div ref={captureRef} className="rounded-xl">
        <ToolComponent />
      </div>

      <button
        onClick={onTools}
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Alle værktøjer
      </button>
    </div>
  );
}

// ── Tværgående tema: Agent governance (/agentisk) ──
// A cross-cutting lens, NOT a 4th pillar: gathers the agent-governance content
// (the 3 agent-dedicated categories - one per pillar - plus a couple of agent
// stragglers in other categories) and groups it BY pillar so the
// Organisering/Udvikling/Drift structure is reinforced rather than replaced.
function AgenticView({
  onNavigate,
  onHome,
}: {
  onNavigate: (v: View, p?: PillarId, c?: Category, s?: Subcategory) => void;
  onHome: () => void;
}) {
  const sevLabel = (s: string) =>
    s === "critical" ? "kritisk" : s === "high" ? "høj" : s === "medium" ? "middel" : "lav";

  const groups = pillars
    .map((p) => ({
      pillar: p,
      items: getCategoriesByPillar(p.id).flatMap((c) =>
        c.subcategories.filter((s) => isAgentSub(c.id, s.id)).map((s) => ({ cat: c, sub: s }))
      ),
    }))
    .filter((g) => g.items.length > 0);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="fade-in">
      <Breadcrumbs theme={{ name: "Agent governance" }} onHome={onHome} />

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🤖</span>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Agent governance <span className="text-primary text-glow">Tema</span>
          </h1>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Et tværgående tema, ikke en selvstændig søjle: {total} emner om styring af autonome AI-agenter (organisering, build-time-design og runtime - inkl. agent-identitet, beslutningsgrænser, A2A/MCP, sandboxing og observability) samlet ét sted, men grupperet efter de tre søjler. Kerneområdet for AI-governance i 2026.
        </p>
      </div>

      {groups.map((g) => (
        <div key={g.pillar.id} className="mb-8">
          <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {g.pillar.icon} {g.pillar.name} <span className="text-muted-foreground/60">({g.items.length})</span>
          </h2>
          <div className="grid gap-2">
            {g.items.map(({ cat, sub }) => (
              <button
                key={`${cat.id}-${sub.id}`}
                onClick={() => onNavigate("subcategory", cat.pillar, cat, sub)}
                className="card-hover flex items-center gap-4 rounded-lg border border-border bg-card/60 p-3 text-left"
              >
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${getSeverityColor(sub.severity)}`}>
                  {sevLabel(sub.severity)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-medium text-foreground">{sub.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {cat.icon} {cat.name} · {sub.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={onHome}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Tilbage til overblik
      </button>
    </div>
  );
}

export default Index;
