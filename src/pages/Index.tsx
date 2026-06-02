import { useState, useMemo, useRef, useEffect, type FormEvent } from "react";
import logo from "@/assets/logo.png";
import { ExternalLink, ChevronRight, ChevronDown, ArrowLeft, Search } from "lucide-react";
import {
  pillars,
  categories,
  getCategoriesByPillar,
  getSeverityColor,
  getSeverityBg,
  type PillarId,
  type Category,
  type Subcategory,
  type SourceType,
} from "@/data/governanceData";

type View = "dashboard" | "pillar" | "category" | "subcategory";

const CALENDLY_URL = "https://calendly.com/ai-raadgivning_jacob/30min?month=2026-06";

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
  const [view, setView] = useState<View>("dashboard");
  const [selectedPillar, setSelectedPillar] = useState<PillarId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (
    newView: View,
    pillar?: PillarId,
    category?: Category,
    subcategory?: Subcategory
  ) => {
    setView(newView);
    if (pillar !== undefined) setSelectedPillar(pillar);
    if (category !== undefined) setSelectedCategory(category);
    if (subcategory !== undefined) setSelectedSubcategory(subcategory);
  };

  const goBack = () => {
    if (view === "subcategory") navigate("category");
    else if (view === "category") navigate("pillar");
    else if (view === "pillar") navigate("dashboard");
  };

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <img src={logo} alt="AI Governance" className="h-14" />
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
                className="h-9 w-64 rounded-md border border-border bg-secondary pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground sm:flex">⌘K</kbd>
            </div>
            <div className="flex gap-2">
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
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book et møde
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
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
              <p className="text-sm text-muted-foreground">Ingen governance-emner matcher din søgning.</p>
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

        {/* Dashboard */}
        {!searchQuery && view === "dashboard" && <DashboardView onNavigate={navigate} />}
        {!searchQuery && view === "pillar" && selectedPillar && (
          <PillarView pillar={selectedPillar} onNavigate={navigate} onBack={goBack} />
        )}
        {!searchQuery && view === "category" && selectedCategory && (
          <CategoryView category={selectedCategory} onNavigate={navigate} onBack={goBack} />
        )}
        {!searchQuery && view === "subcategory" && selectedSubcategory && selectedCategory && (
          <SubcategoryView
            subcategory={selectedSubcategory}
            category={selectedCategory}
            onBack={goBack}
          />
        )}
      </main>

      {/* Newsletter + CTA strip */}
      <NewsletterCTA />

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground">
          <p>
            Governance-data baseret på{" "}
            <a href="https://airc.nist.gov/airmf-resources/playbook/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NIST AI RMF</a>,{" "}
            <a href="https://www.iso.org/standard/42001" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ISO/IEC 42001</a>,{" "}
            <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">EU AI Act</a>,{" "}
            <a href="https://oecd.ai/en/ai-principles" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OECD AI Principles</a>,{" "}
            <a href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OWASP Agentic Top 10</a> og{" "}
            <a href="https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft RAI</a>.
          </p>
          <p className="mt-3">
            En oversigt fra{" "}
            <a href="https://ai-raadgivning.dk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AI Rådgivning</a>{" "}
            — opdateret juni 2026.
          </p>
        </div>
      </footer>
    </div>
  );
};

// ── Dashboard View ──
function DashboardView({ onNavigate }: { onNavigate: (v: View, p?: PillarId) => void }) {
  const totalItems = categories.reduce((sum, c) => sum + c.subcategories.length, 0);
  const criticalCount = categories.reduce(
    (sum, c) => sum + c.subcategories.filter((s) => s.severity === "critical").length,
    0
  );

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="mb-10">
        <h2 className="font-display text-3xl font-bold text-foreground">
          AI Governance <span className="text-primary text-glow">Overblik</span>
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Praktisk overblik over AI-governance for danske organisationer — opdelt i Organisering, Udvikling og Drift. Syntese af NIST AI RMF, ISO/IEC 42001, EU AI Act, OECD, OWASP Top 10 for Agentic Applications 2026, Microsoft Responsible AI, Google SAIF, Anthropic RSP og dansk myndighedsvejledning. Med særlig vægt på <span className="text-primary font-medium">agent- og skill-governance</span> — det vigtigste nye styringsfelt i 2026.
        </p>
      </div>

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
                  <span className="risk-pulse rounded-full bg-danger/15 px-2.5 py-0.5 text-xs font-medium text-danger">
                    {criticals} kritiske
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {pillar.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-primary/70">{pillar.subtitle}</p>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{pillar.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{pillarCats.length} områder</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

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
              <p className="mt-1 text-xs text-muted-foreground">Govern–Map–Measure–Manage. Frivilligt men de facto-baseline for AI-governance. GenAI-profilen (NIST AI 600-1) tilføjer 200+ kontroller for LLM-systemer.</p>
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
              <p className="mt-1 text-xs text-muted-foreground">Det førende framework for agent-governance. Planning, tool use, identity, memory, cascading failures, rogue agents — kerneområdet for 2026.</p>
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
              <p className="mt-1 text-xs text-muted-foreground">Soft law med stærk international vægt. Inclusive growth, fairness, transparency, robustness, accountability — basis for både EU AI Act og Council of Europe Framework Convention.</p>
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
              <p className="mt-1 text-xs text-muted-foreground">Mainstream operationelt framework. Sensitive uses, oversight requirements, impact assessment — bredt adopteret i enterprise AI-governance.</p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
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
        twop: { kind: "muted", text: "Overkill — sjældent relevant" },
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
        Brug matrixen til at sætte politik pr. agent: hvilken type beslutning må agenten træffe, og hvilken oversight-mode kræver det? Cellerne er <em>default-politikker</em> — virksomheden kan stramme eller løsne efter use case-risiko, men skal eksplicit dokumentere afvigelser.
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
        Default RACI-allokering for governance-beslutninger på tværs af typiske roller. Brug som udgangspunkt for jeres egen — udskift roller efter jeres organisationsstruktur, og dokumentér afvigelser. <strong className="text-foreground">R</strong> = Responsible · <strong className="text-foreground">A</strong> = Accountable · <strong className="text-foreground">C</strong> = Consulted · <strong className="text-foreground">I</strong> = Informed.
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
          { v: "R", label: "Responsible — udfører arbejdet" },
          { v: "A", label: "Accountable — bærer det endelige ansvar" },
          { v: "C", label: "Consulted — input før beslutning" },
          { v: "I", label: "Informed — orienteres efter" },
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
        Workflowet fra idé til afvikling. Hver gate har en navngiven ejer, et adgangskriterium og et kill-kriterium. Brug som skabelon — udfyld faktiske navne i jeres egen organisation.
      </p>
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-8">
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
            <p className="text-[10px] leading-snug text-muted-foreground">{stage.gate}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wide text-danger">Kill</p>
            <p className="text-[10px] leading-snug text-muted-foreground">{stage.kill}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Bemærk: ejer-rollerne hænger sammen med <strong className="text-foreground">AI Council RACI</strong>-matrixen i kategori 1.2. Et use case kan kun bevæge sig til næste fase når gate er opfyldt — kill-kriterier skal også checkes løbende.
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
      detail: "Deterministisk regel-engine (OPA / Cedar) — ikke LLM-self-check",
      controls: ["Tool allowlist + scope per agent", "Decision class (read / draft / commit / irreversible)", "Budget: token + tool-call + spend"],
      kind: "policy",
    },
    {
      icon: "🧠",
      title: "Plan-validering",
      role: "Er den planlagte handling acceptabel?",
      detail: "Pre-execution check — særligt for irreversible handlinger",
      controls: ["Prompt-injection detection (instruktion vs data)", "Irreversibel-handling flag", "Sandbox-eksekvering for nye skills"],
      kind: "policy",
    },
    {
      icon: "⚙️",
      title: "Eksekvering + memory",
      role: "Faktisk handling — tool calls + state",
      detail: "Tool invocation, memory writes, A2A coordination",
      controls: ["Mutual auth mellem agenter (Verifiable Credentials)", "Memory-skrivning logget + klassificeret", "Loop-detektion: max N hops"],
      kind: "exec",
    },
    {
      icon: "📡",
      title: "Observability",
      role: "Hvad skete der, hvorfor?",
      detail: "OpenTelemetry GenAI semconv — strukturerede spans for hver agent-handling",
      controls: ["Audit trail: input, plan, tool calls, output, log-hash", "Anomaly detection mod adfærds-baseline", "Cost dashboard real-time"],
      kind: "monitor",
    },
    {
      icon: "👁️",
      title: "Human oversight",
      role: "Sampling, eskalering, override",
      detail: "Tieret menneskelig kontrol — ikke alt skal eskalere",
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
                    <span className="text-[11px] text-muted-foreground">— {layer.role}</span>
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

// ── Pillar View ──
function PillarView({
  pillar,
  onNavigate,
  onBack,
}: {
  pillar: PillarId;
  onNavigate: (v: View, p?: PillarId, c?: Category) => void;
  onBack: () => void;
}) {
  const pillarData = pillars.find((p) => p.id === pillar)!;
  const pillarCats = getCategoriesByPillar(pillar);

  return (
    <div className="fade-in">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Tilbage til overblik
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{pillarData.icon}</span>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{pillarData.name}</h2>
            <p className="text-sm text-primary/70">{pillarData.subtitle}</p>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{pillarData.description}</p>
      </div>

      {/* Værktøj: Use case-livscyklus (kun for Pillar 2 Udvikling & Leverance) */}
      {pillar === "udvikling" && <UseCaseLifecycleFlow />}

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
}: {
  category: Category;
  onNavigate: (v: View, p?: PillarId, c?: Category, s?: Subcategory) => void;
  onBack: () => void;
}) {
  const [expandedSource, setExpandedSource] = useState(false);

  return (
    <div className="fade-in">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Tilbage
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{category.name}</h2>
            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {pillarName(category.pillar)}
            </span>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{category.description}</p>
      </div>

      {/* Værktøj: AI Council RACI (kun for roller-ansvar) */}
      {category.id === "roller-ansvar" && <AiCouncilRaci />}
      {category.id === "agent-runtime" && <AgentRuntimeControlPlane />}

      {/* Underkategorier */}
      <div className="mb-8 grid gap-4">
        {category.subcategories.map((sub) => (
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
  onBack,
}: {
  subcategory: Subcategory;
  category: Category;
  onBack: () => void;
}) {
  return (
    <div className="fade-in max-w-3xl">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Tilbage til {category.name}
      </button>

      {/* Header */}
      <div className={`mb-8 rounded-xl border p-6 ${getSeverityBg(subcategory.severity)}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{category.icon}</span>
          <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${getSeverityColor(subcategory.severity)}`}>
            {subcategory.severity === "critical" ? "kritisk" : subcategory.severity === "high" ? "høj" : subcategory.severity === "medium" ? "middel" : "lav"} prioritet
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">{subcategory.name}</h2>
        <p className="mt-3 text-sm text-secondary-foreground leading-relaxed">{subcategory.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {subcategory.tags.map((tag) => (
            <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Værktøj: Agent beslutnings-klasse matrix (kun for subkategori 1.4.4) */}
      {subcategory.id === "beslutnings-graenser" && <AgentDecisionClassMatrix />}

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
          Book et 30-min sparringsmøde med AI Rådgivning — vi hjælper danske organisationer med at bygge praktisk AI-governance, fra roller og politikker til agent- og skill-styring.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Book 30-min sparring
        </a>
      </div>
    </div>
  );
}

// ── Newsletter + main CTA strip ──
const MAILERLITE_ACTION = "https://assets.mailerlite.com/jsonp/1571946/forms/189012812467536974/subscribe";

function NewsletterCTA() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("fields[email]", email);
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
      <div className="container mx-auto grid gap-8 px-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold text-foreground">📬 Nyhedsbrev: AI Governance i praksis</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Månedlig opdatering om governance-rammeværker, agent-styring, NIST/ISO-opdateringer, og praktiske erfaringer fra danske organisationer.
          </p>
          {status === "success" ? (
            <div className="mt-4 rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success">
              ✓ Tak! Du er nu tilmeldt — tjek din indbakke for bekræftelse.
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
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h3 className="font-display text-lg font-semibold text-foreground">🗓️ Book 30-min sparring</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Konkret sparring om jeres governance-situation — strategi, roller, AI Council, agent- og skill-governance, audit-readiness eller noget helt andet.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book et møde
          </a>
        </div>
      </div>
    </section>
  );
}

export default Index;
