export type Severity = "critical" | "high" | "medium" | "low";
export type PillarId = "organisering" | "udvikling" | "drift";

export type SourceType =
  | "EU AI Act"
  | "NIST"
  | "ISO"
  | "OECD"
  | "CoE"
  | "GDPR/EDPB"
  | "Digst"
  | "Datatilsynet"
  | "Finanstilsynet"
  | "DI"
  | "Microsoft"
  | "Google"
  | "Anthropic"
  | "OWASP"
  | "MITRE"
  | "Gartner"
  | "WEF"
  | "MIT"
  | "CSA"
  | "AI Verify"
  | "FinOps"
  | "MCP"
  | "IIA";

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  actions: string[];
  sourceLinks: { label: string; url: string; source: SourceType }[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  pillar: PillarId;
  icon: string;
  description: string;
  subcategories: Subcategory[];
  sourceLinks: { label: string; url: string; source: SourceType }[];
}

export interface Pillar {
  id: PillarId;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  itemCount: number;
}

// ── Source URL constants (verified by research) ───────────────────────────
const NIST_AIRMF = "https://airc.nist.gov/airmf-resources/playbook/";
const NIST_AI_100_1 = "https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf";
const NIST_GENAI = "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf";
const ISO_42001 = "https://www.iso.org/standard/42001";
const ISO_23894 = "https://www.iso.org/standard/77304.html";
const EU_AI_ACT = "https://eur-lex.europa.eu/eli/reg/2024/1689/oj";
const EU_ACT_ART_4 = "https://artificialintelligenceact.eu/article/4/";
const EU_ACT_ART_26 = "https://artificialintelligenceact.eu/article/26/";
const EU_ACT_ART_27 = "https://artificialintelligenceact.eu/article/27/";
const EU_ACT_ART_50 = "https://artificialintelligenceact.eu/article/50/";
const EU_ACT_ART_73 = "https://artificialintelligenceact.eu/article/73/";
const OECD_PRINCIPLES = "https://oecd.ai/en/ai-principles";
const COE_FCAI = "https://www.coe.int/en/web/artificial-intelligence";
const MS_RAI = "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf";
const GOOGLE_SAIF = "https://saif.google/secure-ai-framework/controls";
const ANTHROPIC_RSP = "https://www.anthropic.com/responsible-scaling-policy";
const ANTHROPIC_AGENT_FRAMEWORK = "https://www.anthropic.com/news/our-framework-for-developing-safe-and-trustworthy-agents";
const OWASP_LLM = "https://genai.owasp.org/llm-top-10/";
const OWASP_AGENTIC = "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/";
const OWASP_ASI = "https://genai.owasp.org/initiatives/agentic-security-initiative/";
const MITRE_ATLAS = "https://atlas.mitre.org/";
const MIT_RISK = "https://airisk.mit.edu/";
const GARTNER_TRISM = "https://www.gartner.com/en/articles/ai-trust-and-ai-risk";
const WEF_PRESIDIO = "https://www3.weforum.org/docs/WEF_Presidio_AI%20Framework_2024.pdf";
const AI_VERIFY = "https://aiverifyfoundation.sg/";
const CSA_NHI = "https://labs.cloudsecurityalliance.org/research/csa-whitepaper-nonhuman-identity-agentic-ai-governance-v1-cs/";
const DIGST = "https://digst.dk/tilsyn/ai-forordningen/";
const DATATILSYNET_AI = "https://www.datatilsynet.dk/regler-og-vejledning/kunstig-intelligens";
const FINANSTILSYNET_AI = "https://www.finanstilsynet.dk/Media/638628434082426731/Rapport%20om%20brugen%20af%20kunstig%20intelligens%20i%20den%20finansielle%20sektor.pdf";
const DI_GUIDE = "https://www.danskindustri.dk/vi-radgiver-dig/virksomhedsregler-og-varktojer/ai/styrk-din-forretning-med-ai/en-strategisk-guide-til-at-implementere-ai-i-din-virksomhed/";
const FINOPS_AI = "https://www.finops.org/wg/finops-for-ai-overview/";
const MCP_AUTH = "https://modelcontextprotocol.io/specification/2026-03-15/basic/authorization";
const IIA_AI_FRAMEWORK = "https://www.theiia.org/globalassets/site/content/tools/professional/aiframework-sept-2024-update.pdf";
const ISO_42005 = "https://www.iso.org/standard/42005";
const DS_42001 = "https://www.ds.dk/en/about-standards/management-systems/iso-iec-42001-information-technology-artificial-intelligence";
const FINANSTILSYNET_GODPRAKSIS = "https://www.finanstilsynet.dk/finansielle-temaer/fintech/vejledning-og-haandholdt-tilsyn/god-praksis-ved-brug-af-kunstig-intelligens";
const GDPR_ART_17 = "https://gdpr-info.eu/art-17-gdpr/";

// ── Pillars ───────────────────────────────────────────────────────────────
export const pillars: Pillar[] = [
  {
    id: "organisering",
    name: "Organisering & Strategi",
    subtitle: "Roller, ansvar, politikker, kompetencer",
    description:
      "Det organisatoriske fundament — roller, ansvar, politikker, kompetencer og etisk styring — der gør, at AI bruges målrettet og forsvarligt på tværs af forretningen. Det er her, ledelsen tager ejerskab og oversætter AI-ambition til styringspraksis.",
    icon: "🏛️",
    itemCount: 18,
  },
  {
    id: "udvikling",
    name: "Udvikling & Leverance",
    subtitle: "Fra use case-idé til go-live",
    description:
      "Hvordan AI-løsninger fødes, vurderes og bringes i produktion — fra use case-idé over leverandørvalg til go-live. Omfatter både egne modeller, vendor-AI, generativ AI og agent-/skill-design.",
    icon: "🔧",
    itemCount: 21,
  },
  {
    id: "drift",
    name: "Drift & Vedligehold",
    subtitle: "Monitorering, hændelser, lifecycle, agent runtime",
    description:
      "Hvordan AI-løsninger holdes forsvarlige, sikre og værdiskabende efter go-live — monitorering, hændelseshåndtering, retraining, FinOps og decommissioning. Den pillar der oftest undervurderes — og hvor det meste går galt i 2026.",
    icon: "⚙️",
    itemCount: 24,
  },
];

// ── Categories with subcategories ─────────────────────────────────────────
export const categories: Category[] = [
  // ╔═══════════════════════════════════════════════════════════════════════╗
  // ║  PILLAR 1: ORGANISERING & STRATEGI                                    ║
  // ╚═══════════════════════════════════════════════════════════════════════╝

  {
    id: "ai-strategi",
    name: "AI-strategi og forretningstilpasning",
    pillar: "organisering",
    icon: "🎯",
    description:
      "Forankring af AI i overordnet forretningsstrategi, risikoappetit og værdiskabelse — så AI-indsatsen ikke bliver en samling af tilfældige proof-of-concepts.",
    subcategories: [
      {
        id: "bestyrelses-mandat",
        name: "AI-strategi og bestyrelsesmandater",
        description:
          "Bestyrelsen skal vedtage et formelt AI-mandat, der definerer ambition, risikoappetit og no-go-områder. Uden et eksplicit mandat bliver AI styret af mellemlederes initiativer.",
        severity: "high",
        actions: [
          "Vedtag årlig AI-strategi med konkrete KPI'er (vedtagelsesrate, værdi, hændelsesfrekvens)",
          "Definér no-go-områder skriftligt (fx fuldautomatiske HR-afgørelser, AI-genererede juridiske breve uden review)",
          "Etablér kvartalsvis AI-rapportering til bestyrelsen som fast punkt — ikke ad hoc",
          "Forankr \"stop-build authority\" hos en navngiven C-leder",
        ],
        sourceLinks: [
          { label: "NIST AI RMF GOVERN 1.1–1.3", url: NIST_AIRMF, source: "NIST" },
          { label: "ISO/IEC 42001 cl. 5", url: ISO_42001, source: "ISO" },
          { label: "OECD Principle 2.3", url: OECD_PRINCIPLES, source: "OECD" },
        ],
        tags: ["bestyrelse", "strategi", "mandat"],
      },
      {
        id: "risiko-appetit",
        name: "Risikoappetit og tolerancetærskler",
        description:
          "Eksplicitte, kvantificerede risikotolerancer pr. use case-kategori — ikke generiske udsagn om \"ansvarlig AI\".",
        severity: "high",
        actions: [
          "Differentier tolerancer pr. kategori (kunderettet vs. intern, regulatorisk vs. ikke-regulatoriet)",
          "Sæt målbare tærskler: maks. hallucinationsrate, maks. forventet økonomisk fejl pr. transaktion, maks. bias-delta",
          "Definér eskalering når tærskel overskrides — hvem stopper systemet?",
          "Re-evaluér tolerancer halvårligt mod faktisk hændelsesdata",
        ],
        sourceLinks: [
          { label: "NIST AI RMF GOVERN 1.3", url: NIST_AIRMF, source: "NIST" },
          { label: "ISO/IEC 23894 cl. 6.3", url: ISO_23894, source: "ISO" },
        ],
        tags: ["risiko", "tolerance", "tærskler"],
      },
      {
        id: "vaerdiansaettelse",
        name: "AI-værdiansættelse og business case-discipline",
        description:
          "Standardiseret business case-skabelon, der tvinger forretningen til at kvantificere både gevinst og risikoomkostning før udvikling. Modvirker \"AI-teater\" — pilotering uden produktionsplan.",
        severity: "medium",
        actions: [
          "Krav om dokumenteret baseline (hvad koster processen i dag, fejlrate, gennemløbstid)",
          "Beregn TCO med drift, monitorering, retraining, GenAI-tokens og incidentomkostning",
          "Definér exit-kriterier på forhånd: hvornår stopper vi denne use case?",
          "Genberegn business case efter 90 dages drift — kill rate er et sundt KPI",
        ],
        sourceLinks: [
          { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
          { label: "DI strategisk AI-guide", url: DI_GUIDE, source: "DI" },
        ],
        tags: ["business case", "TCO", "ROI"],
      },
    ],
    sourceLinks: [
      { label: "OECD AI Principles (2024)", url: OECD_PRINCIPLES, source: "OECD" },
      { label: "WEF Presidio AI Framework", url: WEF_PRESIDIO, source: "WEF" },
      { label: "DI strategisk AI-guide", url: DI_GUIDE, source: "DI" },
    ],
  },

  {
    id: "roller-ansvar",
    name: "Roller, ansvar og governance-struktur",
    pillar: "organisering",
    icon: "👥",
    description:
      "Den operationelle styringsstruktur: hvem ejer hvilke AI-beslutninger, hvilke fora træffer dem, og hvordan rapporteres der opad.",
    subcategories: [
      {
        id: "ai-council",
        name: "AI Governance Board / AI Council",
        description:
          "Tværfagligt beslutningsorgan med mandat til at godkende, eskalere og standse AI-initiativer. Skal ikke være en debatklub — skal have RACI-defineret beslutningskraft.",
        severity: "high",
        actions: [
          "Sammensæt fra IT, data, jura, compliance, sikkerhed, HR, forretning — ikke kun teknik",
          "Fast mødekadence (månedlig minimum); skriftlige beslutningsreferater",
          "Ejerskab af AI use case-portefølje og risikoregister",
          "Eskaleringsret til direktion/bestyrelse ved tolerancebrud",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 cl. 5.3", url: ISO_42001, source: "ISO" },
          { label: "NIST GOVERN 2.1", url: NIST_AIRMF, source: "NIST" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
        ],
        tags: ["AI council", "governance", "RACI"],
      },
      {
        id: "model-owner",
        name: "AI Risk Owner og Model Owner-rolle",
        description:
          "Hvert produktionssystem har en navngivet Model Owner (teknisk) og AI Risk Owner (forretningsmæssig). EU AI Act art. 26 forudsætter dokumenteret menneskelig ansvarlig — det kan ikke være \"afdelingen\".",
        severity: "critical",
        actions: [
          "Navngiv begge roller før produktionssætning — registrér i AI-register",
          "Definér mandat: Model Owner ejer drift/performance, Risk Owner ejer beslutning om at fortsætte/standse",
          "Risk Owner skal være forretningsperson, ikke IT",
          "Genvurdér rolleholder ved organisationsændring inden 30 dage",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 26", url: EU_ACT_ART_26, source: "EU AI Act" },
          { label: "NIST GOVERN 2.1", url: NIST_AIRMF, source: "NIST" },
          { label: "ISO/IEC 42001 A.3", url: ISO_42001, source: "ISO" },
        ],
        tags: ["model owner", "risk owner", "ansvar", "artikel 26"],
      },
      {
        id: "tre-linjer",
        name: "Tre-linjers forsvarsmodel for AI",
        description:
          "Anvend tre-linjers model (1L udvikler/driver, 2L compliance/risk, 3L intern revision) på AI — særligt vigtigt for finansielle virksomheder under Finanstilsynet.",
        severity: "high",
        actions: [
          "Definér uafhængigt 2L AI-risk-team adskilt fra dataudvikling",
          "Etabler årligt 3L-audit-program for AI-systemer",
          "Sikr at 2L har vetoret før produktionssætning af højrisiko-AI",
          "Indfør \"challenger model\"-review for kritiske beslutningsmodeller",
        ],
        sourceLinks: [
          { label: "IIA AI Auditing Framework (sept 2024)", url: IIA_AI_FRAMEWORK, source: "IIA" },
          { label: "Finanstilsynet — god praksis for AI", url: FINANSTILSYNET_GODPRAKSIS, source: "Finanstilsynet" },
          { label: "ISO/IEC 42001 A.3", url: ISO_42001, source: "ISO" },
        ],
        tags: ["3LoD", "finans", "intern revision", "IIA"],
      },
      {
        id: "eskalering-whistleblower",
        name: "Eskaleringsveje og whistleblower-funktion for AI",
        description:
          "Medarbejdere og brugere skal kunne rapportere bekymringer om AI-systemer uden frygt for repressalier. Komplementerer almindelig whistleblower-ordning.",
        severity: "medium",
        actions: [
          "Etabler dedikeret AI-incident-rapporteringskanal (intern + ekstern)",
          "Sammenkobl med eksisterende whistleblower-funktion (lov om beskyttelse af whistleblowere)",
          "Sikr triage inden 5 hverdage; månedlig rapportering til AI Council",
          "Publicér aggregerede tal årligt for transparens",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 26(5)–(6)", url: EU_ACT_ART_26, source: "EU AI Act" },
          { label: "Council of Europe Framework Convention on AI", url: COE_FCAI, source: "CoE" },
        ],
        tags: ["whistleblower", "eskalering", "transparens"],
      },
    ],
    sourceLinks: [
      { label: "NIST AI RMF Playbook — GOVERN", url: NIST_AIRMF, source: "NIST" },
      { label: "ISO/IEC 42001:2023", url: ISO_42001, source: "ISO" },
      { label: "Microsoft Responsible AI Standard v2", url: MS_RAI, source: "Microsoft" },
    ],
  },

  {
    id: "ai-literacy",
    name: "AI-kompetencer (Article 4-literacy)",
    pillar: "organisering",
    icon: "🎓",
    description:
      "EU AI Act art. 4 kræver, at organisationer sikrer \"tilstrækkelig AI-literacy\" hos alle, der bruger eller udvikler AI. Bindende fra 2. februar 2025 og verificeres i 2026.",
    subcategories: [
      {
        id: "literacy-basis",
        name: "AI-literacy-program (basis)",
        description:
          "Obligatorisk grundtræning for alle medarbejdere, der bruger AI-værktøjer — også Copilot/ChatGPT. Skal dokumenteres pr. medarbejder.",
        severity: "high",
        actions: [
          "Basistræning (1-2 timer) med test og certifikat; opdatér årligt",
          "Rolledifferentieret indhold (almindelig bruger / power user / udvikler / leder)",
          "Krav om træning før adgang til generative AI-værktøjer aktiveres",
          "LMS-integration så ledelsen kan dokumentere dækningsgrad",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 4 (i kraft 2. feb 2025)", url: EU_ACT_ART_4, source: "EU AI Act" },
          { label: "Digst: AI-tilsyn", url: DIGST, source: "Digst" },
          { label: "ISO/IEC 42001 A.4", url: ISO_42001, source: "ISO" },
        ],
        tags: ["AI-literacy", "uddannelse", "artikel 4"],
      },
      {
        id: "ledelses-fluency",
        name: "Ledelses-AI-fluency",
        description:
          "Top- og mellemledere skal forstå AI tilstrækkeligt til at træffe forsvarlige investeringsbeslutninger og udfordre teknikere. DI peger på, at 51 % af SMV-ledere mangler dette.",
        severity: "medium",
        actions: [
          "Bestyrelses-briefing 2x årligt med konkrete cases",
          "Direktion gennemfører \"AI literacy for executives\" certificering",
          "Mellemledere ekstra modul om beslutningsdelegation til AI",
          "Genbesøg ved nye teknologispring (fx agent-skift)",
        ],
        sourceLinks: [
          { label: "DI strategisk AI-guide", url: DI_GUIDE, source: "DI" },
          { label: "NIST GOVERN 2.2", url: NIST_AIRMF, source: "NIST" },
        ],
        tags: ["ledelse", "fluency", "bestyrelse"],
      },
      {
        id: "udvikler-dybde",
        name: "Teknisk dybde-kompetence for udviklere og dataingeniører",
        description:
          "Udviklere, der bygger AI-systemer, har behov for specialiseret træning i sikkerhed, bias, evaluering, prompt-engineering og agent-design.",
        severity: "medium",
        actions: [
          "Krav om certificering (fx AWS/Google/Azure AI Practitioner som minimum)",
          "Internt sparringsforum / community of practice for AI-udviklere",
          "Hands-on red team-træning mod egne modeller årligt",
          "Mentorordning hvor seniorer reviewer juniorudviklerens AI-kode",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 A.4", url: ISO_42001, source: "ISO" },
          { label: "OWASP Top 10 for LLM Apps 2025", url: OWASP_LLM, source: "OWASP" },
        ],
        tags: ["udvikler", "kompetence", "certificering"],
      },
    ],
    sourceLinks: [
      { label: "EU AI Act art. 4", url: EU_ACT_ART_4, source: "EU AI Act" },
      { label: "Digitaliseringsstyrelsen AI-tilsyn", url: DIGST, source: "Digst" },
    ],
  },

  {
    id: "agent-skill-org",
    name: "Agent- og skill-governance (organisatorisk)",
    pillar: "organisering",
    icon: "🤖",
    description:
      "Den organisatoriske side af agent- og skill-governance: hvem ejer agenter og skills som artefakter, hvordan godkendes nye, hvordan livscyklus-styres de. Et nyt governance-surface i 2026.",
    subcategories: [
      {
        id: "agent-register",
        name: "Agent- og skill-register (single source of truth)",
        description:
          "Komplet register over alle agenter, skills (Claude Code skills, Copilot Studio agents, Custom GPTs, MCP-servere) i organisationen — versioneret, ejet og klassificeret. Uden register er resten umuligt.",
        severity: "critical",
        actions: [
          "Centralt register med ejer, formål, datakilder, tool-permissions, miljø, version",
          "Forbud mod produktion uden registrering — håndhæves via deployment-pipeline",
          "Klassificering pr. risikoniveau (info / decision-support / autonomous action)",
          "Genvurdering hver 90 dage; markér forældede skills til decommissioning",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 A.6.2", url: ISO_42001, source: "ISO" },
          { label: "OWASP Agentic Security Initiative", url: OWASP_ASI, source: "OWASP" },
        ],
        tags: ["agent-register", "register", "skill"],
      },
      {
        id: "skill-approval",
        name: "Skill- og agent-approvalproces",
        description:
          "Formel godkendelsesgate før en skill eller agent når produktion eller distribueres i organisationen. Modvirker \"shadow agents\" bygget af enkeltmedarbejdere.",
        severity: "high",
        actions: [
          "Trinvis approval: forfatter → tech review → security review → AI Council for høj-risiko",
          "Tjekliste: scope, tools, data, kill switch, owner, monitoring",
          "Kortere fast-track for lavrisiko-skills (intern info-hentning) med automatisk audit",
          "Genapproval ved >25 % ændring af skillens scope eller tools",
        ],
        sourceLinks: [
          { label: "OWASP Top 10 for Agentic Applications 2026", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
          { label: "ISO/IEC 42001 A.6", url: ISO_42001, source: "ISO" },
        ],
        tags: ["approval", "gate", "shadow agents"],
      },
      {
        id: "skill-ejerskab",
        name: "Ejerskab af skills og agenter på tværs af platforme",
        description:
          "Skills migrerer mellem Claude Code, GitHub Copilot, Copilot Studio — samme skill kan eksekvere forskelligt. Ejerskabsmodel skal følge skillen, ikke platformen.",
        severity: "medium",
        actions: [
          "Definér \"skill custodian\"-rolle uafhængigt af platform",
          "Krav om source-of-truth-repository (typisk Git) for skill-definitioner",
          "Forbud mod platform-specifik modifikation uden tilbageskrivning til kilden",
          "Gennemgå skill-portability ved platform-skift (fx Copilot → Claude)",
        ],
        sourceLinks: [
          { label: "OWASP Agentic Security Initiative", url: OWASP_ASI, source: "OWASP" },
        ],
        tags: ["ejerskab", "portability", "skill custodian"],
      },
      {
        id: "beslutnings-graenser",
        name: "Beslutningsgrænser for autonome agenter",
        description:
          "Eksplicit definition pr. agent af hvad den selv må beslutte vs. hvad der kræver menneskelig godkendelse. Den vigtigste governance-mekanisme for agentic AI i 2026.",
        severity: "critical",
        actions: [
          "Definér \"decision class\"-skema (read-only / draft / commit / irreversible)",
          "Beløbs-, hyppigheds- og scope-tærskler dokumenteret pr. agent",
          "Irreversible handlinger (sletning, ekstern kommunikation, betaling) kræver per default menneske",
          "Auditlog skal vise hvilke beslutninger agenten har truffet selv vs. eskaleret",
        ],
        sourceLinks: [
          { label: "OWASP Agentic ASI01 (Planning)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "Anthropic Responsible Scaling Policy v3.1", url: ANTHROPIC_RSP, source: "Anthropic" },
        ],
        tags: ["autonomi", "beslutning", "agent", "irreversibel"],
      },
    ],
    sourceLinks: [
      { label: "OWASP Top 10 for Agentic Applications 2026", url: OWASP_AGENTIC, source: "OWASP" },
      { label: "OWASP Agentic Security Initiative", url: OWASP_ASI, source: "OWASP" },
      { label: "CSA Non-Human Identity & Agentic AI Governance", url: CSA_NHI, source: "CSA" },
    ],
  },

  {
    id: "politikker-etik",
    name: "Politikker, etik og menneskerettigheder",
    pillar: "organisering",
    icon: "⚖️",
    description:
      "Skriftlige politikker, der binder organisationen til normer ud over juridiske minimumskrav — særligt menneskerettighedsmæssige.",
    subcategories: [
      {
        id: "aup",
        name: "AI Acceptable Use Policy",
        description:
          "Skriftlig politik for hvad medarbejdere må og ikke må gøre med AI-værktøjer — inkl. ChatGPT, Copilot, Claude. Skal være konkret, ikke abstrakt.",
        severity: "high",
        actions: [
          "Klar liste over forbudte input (CPR, kundelister, kildekode med IP)",
          "Klare regler om output-attribution (må AI-genereret tekst sendes som \"mit arbejde\"?)",
          "Hjemmel til logning og review",
          "Genbesøg hvert år; tving accept ved login efter ændring",
        ],
        sourceLinks: [
          { label: "Microsoft Responsible AI Standard", url: MS_RAI, source: "Microsoft" },
          { label: "Datatilsynet: Kunstig intelligens", url: DATATILSYNET_AI, source: "Datatilsynet" },
          { label: "NIST GV-3.2", url: NIST_AIRMF, source: "NIST" },
        ],
        tags: ["AUP", "politik", "medarbejder"],
      },
      {
        id: "fria",
        name: "Fundamental Rights Impact Assessment (FRIA)",
        description:
          "EU AI Act art. 27 kræver FRIA for offentlige myndigheder og visse private aktører ved højrisiko-AI fra 2. august 2026. DPIA dækker ikke.",
        severity: "critical",
        actions: [
          "Etabler skabelon der dækker art. 27's seks krav (proces, varighed, berørte personer, risici, oversight, klagemekanisme)",
          "Tidlig integration i use case-godkendelse, ikke som efter-bagklog",
          "Genbrug DPIA hvor relevant (art. 27(4)) for at undgå dobbeltarbejde",
          "Offentliggør sammenfatning af FRIA for borgerrettede systemer",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 27", url: EU_ACT_ART_27, source: "EU AI Act" },
          { label: "Datatilsynet: Kunstig intelligens", url: DATATILSYNET_AI, source: "Datatilsynet" },
          { label: "Council of Europe Framework Convention", url: COE_FCAI, source: "CoE" },
        ],
        tags: ["FRIA", "DPIA", "grundrettigheder"],
      },
      {
        id: "red-line-katalog",
        name: "Etisk reviewboard / red-line-katalog",
        description:
          "Eksplicit liste over use cases, organisationen ikke vil bygge — uanset legalitet. Stærk signaleffekt eksternt og internt.",
        severity: "medium",
        actions: [
          "Vedtag mindst 5-10 konkrete no-go (fx følelsesgenkendelse på medarbejdere)",
          "Etablér uafhængigt etisk panel ved tvivlssager",
          "Offentliggør red-line-kataloget på hjemmeside",
          "Genbesøg årligt — særligt ved nye teknologier",
        ],
        sourceLinks: [
          { label: "Microsoft RAI \"sensitive uses\"", url: MS_RAI, source: "Microsoft" },
          { label: "OECD Principle 1.2", url: OECD_PRINCIPLES, source: "OECD" },
          { label: "NIST GOVERN 1", url: NIST_AIRMF, source: "NIST" },
        ],
        tags: ["red lines", "etik", "no-go"],
      },
      {
        id: "ai-disclosure",
        name: "Transparens-erklæringer og AI-disclosure",
        description:
          "Eksternt og internt synliggør hvor AI bruges, så brugere kan træffe informerede valg. EU AI Act art. 50 kræver det for bestemte systemer.",
        severity: "high",
        actions: [
          "Offentlig AI-disclosure-side på koncernens hjemmeside",
          "Pop-up / labels i UI hvor AI er aktiv (chatbot, beslutningsstøtte)",
          "AI-genereret indhold mærkes (C2PA / SynthID hvor muligt)",
          "Årlig transparensrapport med aggregerede metrics",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 50", url: EU_ACT_ART_50, source: "EU AI Act" },
          { label: "Council of Europe Framework Convention art. 8", url: COE_FCAI, source: "CoE" },
        ],
        tags: ["transparens", "disclosure", "mærkning"],
      },
    ],
    sourceLinks: [
      { label: "Council of Europe Framework Convention on AI", url: COE_FCAI, source: "CoE" },
      { label: "OECD AI Principles", url: OECD_PRINCIPLES, source: "OECD" },
      { label: "EU AI Act art. 27 — FRIA", url: EU_ACT_ART_27, source: "EU AI Act" },
    ],
  },

  // ╔═══════════════════════════════════════════════════════════════════════╗
  // ║  PILLAR 2: UDVIKLING & LEVERANCE                                      ║
  // ╚═══════════════════════════════════════════════════════════════════════╝

  {
    id: "use-case-lifecycle",
    name: "Use case-livscyklus og porteføljestyring",
    pillar: "udvikling",
    icon: "📋",
    description:
      "Standardiseret proces fra idé til produktion, der filtrerer dårlige ideer fra tidligt og sikrer dokumentation. Modvirker shadow AI.",
    subcategories: [
      {
        id: "intake-triage",
        name: "Use case-intake og triage",
        description:
          "Single front door for AI-idéer — ingen produktionsbygning uden registrering. Forhindrer fragmenteret skygge-AI.",
        severity: "high",
        actions: [
          "Standardiseret intake-form med påkrævede felter (formål, data, risikoklasse)",
          "Triage inden 10 hverdage — accept / afvis / venteliste",
          "Synligt portefølje-dashboard for AI Council",
          "Periodisk \"amnesti-runde\" hvor shadow-systemer kan registreres uden konsekvens",
        ],
        sourceLinks: [
          { label: "NIST MAP 1", url: NIST_AIRMF, source: "NIST" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
        ],
        tags: ["intake", "shadow AI", "triage"],
      },
      {
        id: "risiko-klassificering",
        name: "Risikoklassificering og EU AI Act-mapping",
        description:
          "Hver use case klassificeres som forbudt / højrisiko / begrænset / minimal jf. EU AI Act + intern matrix. Bestemmer hele det videre forløb.",
        severity: "critical",
        actions: [
          "Beslutningstræ baseret på Annex III + interne kriterier",
          "Dual-sign-off: forretning + 2L compliance",
          "Dokumentér klassificeringen — myndigheder vil bede om denne",
          "Genvurdér ved scope-ændring (>20 % funktionsændring)",
        ],
        sourceLinks: [
          { label: "EU AI Act", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "NIST GenAI Profile", url: NIST_GENAI, source: "NIST" },
          { label: "ISO/IEC 42001 A.5", url: ISO_42001, source: "ISO" },
        ],
        tags: ["klassificering", "Annex III", "AI Act"],
      },
      {
        id: "poc-prod-gate",
        name: "Proof of Concept → Produktions-gating",
        description:
          "Eksplicit gate mellem PoC og produktion. Mange organisationer hopper direkte til prod med eksperimentkode.",
        severity: "medium",
        actions: [
          "Krav om produktionsplan før PoC starter (\"hvad sker der hvis det virker?\")",
          "Eksplicit \"kill\"-beslutning ved enden af PoC — ingen autopromote",
          "Sikkerhedsreview før produktionssætning, ikke efter",
          "90-dages post-launch evaluering tilbage til AI Council",
        ],
        sourceLinks: [
          { label: "NIST MAP 2", url: NIST_AIRMF, source: "NIST" },
          { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
        ],
        tags: ["PoC", "gate", "produktion"],
      },
      {
        id: "kill-criteria",
        name: "Kill-criteria og decommissioning-plan fra dag 1",
        description:
          "Hver use case defineres med eksplicitte kriterier for nedlukning før den startes. Modvirker zombie-AI.",
        severity: "medium",
        actions: [
          "Definér målbar performance-tærskel, hvor nedlukning udløses",
          "Definér scenario-tærskel: regulatorisk ændring, vendor-skift, brug under kritisk masse",
          "Dokumentér sunset-plan inkl. data-, model-, log-arkivering",
          "Inkluder decommissioning som budgetlinje fra start",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 A.6.2.8", url: ISO_42001, source: "ISO" },
          { label: "NIST MANAGE 4", url: NIST_AIRMF, source: "NIST" },
          { label: "NIST GenAI GV-1.7", url: NIST_GENAI, source: "NIST" },
        ],
        tags: ["kill criteria", "zombie AI", "decommissioning"],
      },
    ],
    sourceLinks: [
      { label: "NIST AI RMF MAP function", url: NIST_AIRMF, source: "NIST" },
      { label: "ISO/IEC 42001 cl. 6", url: ISO_42001, source: "ISO" },
    ],
  },

  {
    id: "data-governance",
    name: "Data governance for AI",
    pillar: "udvikling",
    icon: "📊",
    description:
      "Specifikke data-disciplin-krav til AI: træningsdata, RAG-kilder, syntetisk data, dataminimering.",
    subcategories: [
      {
        id: "data-lineage",
        name: "Data lineage og training-data-provenance",
        description:
          "Dokumenteret kæde fra rådata til model — særligt vigtigt for EU AI Act art. 10 og copyright-risiko.",
        severity: "high",
        actions: [
          "Data card / datasheet pr. datakilde med licens, oprindelse, opdateringskadence",
          "Krav om sletning af PII der ikke er nødvendigt for formålet",
          "Stikprøvevis manuel verifikation kvartalsvist",
          "Sammenkobl med model-card så modellen kan spores tilbage",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 10", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "NIST GenAI GV-1.2", url: NIST_GENAI, source: "NIST" },
          { label: "ISO/IEC 42001 A.7", url: ISO_42001, source: "ISO" },
        ],
        tags: ["data lineage", "provenance", "data card"],
      },
      {
        id: "rag-governance",
        name: "RAG-kildegovernance",
        description:
          "RAG-systemer henter løbende fra kildedokumenter — disse er en governance-overflade i sig selv. Hvem må indeksere hvad?",
        severity: "high",
        actions: [
          "Adgangsstyring på chunk-niveau, ikke kun dokument",
          "Sletning fra index når kilde slettes (right-to-be-forgotten cascade)",
          "Versionering så svar kan rekonstrueres på en given dato",
          "Periodisk relevansreview — fjern outdated kilder",
        ],
        sourceLinks: [
          { label: "OWASP LLM06 (Sensitive Info Disclosure)", url: OWASP_LLM, source: "OWASP" },
          { label: "NIST GenAI MAP 4", url: NIST_GENAI, source: "NIST" },
          { label: "Datatilsynet: GDPR-vejledning", url: DATATILSYNET_AI, source: "Datatilsynet" },
        ],
        tags: ["RAG", "vector store", "indekssletning"],
      },
      {
        id: "syntetisk-data",
        name: "Syntetisk data og privacy-bevarende træning",
        description:
          "Brug af syntetisk data, differential privacy, federated learning som governance-værktøj. Reducerer dataeksponering men kræver egne kontroller.",
        severity: "medium",
        actions: [
          "Politik for hvornår syntetisk data er acceptabelt (vurdering pr. use case)",
          "Krav om bias-måling før vs. efter syntetisering",
          "Re-identifikationsrisiko-test før release",
          "Dokumentér valg i FRIA/DPIA",
        ],
        sourceLinks: [
          { label: "ISO/IEC 23894", url: ISO_23894, source: "ISO" },
          { label: "Datatilsynet: Kunstig intelligens", url: DATATILSYNET_AI, source: "Datatilsynet" },
          { label: "NIST GenAI MS-2.10", url: NIST_GENAI, source: "NIST" },
        ],
        tags: ["syntetisk data", "differential privacy", "federated"],
      },
      {
        id: "right-to-forgotten",
        name: "Right-to-be-forgotten i AI-systemer",
        description:
          "GDPR art. 17-anmodninger i AI-kontekst er ulineær: kan ikke \"slette\" fra trænede modeller. Kræver dokumenteret tilgang.",
        severity: "high",
        actions: [
          "Etabler proces for sletning af RAG-kilde, fine-tune-eksempel og log-data",
          "Dokumentér når sletning ikke er teknisk mulig (fx i frosne baseline-modeller)",
          "Forhandling med vendor om sletteforpligtelse",
          "Klar kommunikation til registrerede om reelle begrænsninger",
        ],
        sourceLinks: [
          { label: "GDPR art. 17", url: GDPR_ART_17, source: "GDPR/EDPB" },
          { label: "Datatilsynet: AI-vejledning", url: DATATILSYNET_AI, source: "Datatilsynet" },
        ],
        tags: ["GDPR art. 17", "sletning", "rettighed"],
      },
    ],
    sourceLinks: [
      { label: "Datatilsynet: Kunstig intelligens", url: DATATILSYNET_AI, source: "Datatilsynet" },
      { label: "EU AI Act art. 10", url: EU_AI_ACT, source: "EU AI Act" },
      { label: "ISO/IEC 42001 Annex A.7", url: ISO_42001, source: "ISO" },
    ],
  },

  {
    id: "vendor-third-party",
    name: "Vendor- og tredjepartsgovernance",
    pillar: "udvikling",
    icon: "🤝",
    description:
      "I 2026 er størstedelen af AI'en tredjepartsmodeller. Vendor-governance er det vigtigste enkeltområde for de fleste danske organisationer.",
    subcategories: [
      {
        id: "vendor-dd",
        name: "AI-leverandørvurdering og due diligence",
        description:
          "Standardiseret vurdering af AI-leverandører før kontrakt — bias, sikkerhed, datapraksis, sub-processorer, model-provenance.",
        severity: "critical",
        actions: [
          "Bindende AI-due-diligence-spørgeskema (50-80 punkter)",
          "Krav om SOC 2 + ISO 42001-attestering for kritiske vendors",
          "Vurdér model-supply-chain: hvem trænede underliggende model?",
          "Periodisk re-assessment årligt for high-risk vendors",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 A.10", url: ISO_42001, source: "ISO" },
          { label: "NIST MAP 4", url: NIST_AIRMF, source: "NIST" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
        ],
        tags: ["due diligence", "vendor", "supply chain"],
      },
      {
        id: "foundation-model-eval",
        name: "Foundation model-evaluering",
        description:
          "Eksplicit valgproces når flere foundation-modeller er tilgængelige (GPT, Claude, Gemini, Llama). Skal være målbar, ikke baseret på hype.",
        severity: "high",
        actions: [
          "Standardiseret benchmark-suite på reelle organisationsopgaver (ikke MMLU)",
          "Test bias og refusal-rates på dansk-sproget data",
          "Vurdér data-residency, sub-processors, EU-tilgængelighed",
          "Genevaluér halvårligt — modellandskabet flytter sig hurtigt",
        ],
        sourceLinks: [
          { label: "NIST GenAI MEASURE", url: NIST_GENAI, source: "NIST" },
          { label: "AI Verify Foundation toolkit", url: AI_VERIFY, source: "AI Verify" },
          { label: "MIT AI Risk Repository", url: MIT_RISK, source: "MIT" },
        ],
        tags: ["foundation model", "benchmark", "model evaluation"],
      },
      {
        id: "ai-kontrakter",
        name: "Kontrakt- og DPA-klausuler for AI",
        description:
          "AI-specifikke krav i kontrakter: ikke-træning på kundedata, sletteforpligtelser, model-changelog, EU AI Act-rolle-allokering.",
        severity: "high",
        actions: [
          "Standard-klausuler: no-training-on-customer-data, opt-out af logging, audit-ret",
          "Eksplicit rolle-fordeling under EU AI Act (provider vs. deployer)",
          "Notice-pligt ved model-skift eller capability-ændring (28 dages varsel som baseline)",
          "Exit-klausul med dataportabilitet i åbent format",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 25", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "Datatilsynet: DPA-vejledning", url: DATATILSYNET_AI, source: "Datatilsynet" },
        ],
        tags: ["kontrakter", "DPA", "vendor lock-in"],
      },
      {
        id: "mcp-governance",
        name: "MCP-server- og tool-leverandørgovernance",
        description:
          "MCP-servere er en ny vendor-kategori i 2026 — en MCP-server giver agenter adgang til eksterne systemer. Skal vurderes som tredjepartssoftware med eskaleret kritikalitet.",
        severity: "high",
        actions: [
          "Whitelist af godkendte MCP-servere; resten blokeres på netværksniveau",
          "Vurdering pr. server: ejer, scope, data-eksponering, RFC 8707-resource-indicators",
          "Krav om mutual TLS og OAuth 2.1 mod produktionsservere",
          "Periodisk genvurdering af aktivt anvendte servere",
        ],
        sourceLinks: [
          { label: "MCP authorization specification", url: MCP_AUTH, source: "MCP" },
          { label: "OWASP ASI04 (Supply Chain)", url: OWASP_AGENTIC, source: "OWASP" },
        ],
        tags: ["MCP", "tool", "OAuth", "mutual TLS"],
      },
    ],
    sourceLinks: [
      { label: "NIST AI RMF MAP 4", url: NIST_AIRMF, source: "NIST" },
      { label: "ISO/IEC 42001 Annex A.10", url: ISO_42001, source: "ISO" },
      { label: "Google SAIF", url: GOOGLE_SAIF, source: "Google" },
    ],
  },

  {
    id: "agent-skill-design",
    name: "Agent- og skill-design (build-time)",
    pillar: "udvikling",
    icon: "🛠️",
    description:
      "Designprincipper for agenter og skills, før de når produktion. Lægger fundament for sikker drift.",
    subcategories: [
      {
        id: "least-privilege",
        name: "Least-privilege tool-authorization",
        description:
          "Hver agent får kun adgang til de tools/scopes den faktisk behøver. Default skal være \"kan ikke\", ikke \"kan alt\".",
        severity: "critical",
        actions: [
          "Eksplicit tool-allowlist pr. agent — ingen wildcard",
          "Time-bound og scope-bound tokens (kort levetid + RFC 8707)",
          "Incremental scope consent — agenten beder pr. operation, ikke samlet",
          "Tool-call rate limits pr. session",
        ],
        sourceLinks: [
          { label: "OWASP ASI02 (Tool Use)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "MCP authorization specification", url: MCP_AUTH, source: "MCP" },
        ],
        tags: ["least privilege", "tool auth", "scope"],
      },
      {
        id: "plan-validering",
        name: "Plan-validering og guardrails",
        description:
          "Før en agent eksekverer en flertrins plan, valideres planen mod policy — særligt vigtigt for irreversible handlinger.",
        severity: "high",
        actions: [
          "Pre-execution policy check (deterministisk regel-engine, ikke LLM-self-check)",
          "Kategorisér tools som \"reversible\" / \"irreversible\"; sidstnævnte kræver review",
          "Tjek for prompt injection-mønstre i agent-input",
          "Sandbox-eksekvering for nye/eksperimentelle skills",
        ],
        sourceLinks: [
          { label: "OWASP ASI01 (Planning)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "NIST GenAI MS-2.6", url: NIST_GENAI, source: "NIST" },
        ],
        tags: ["plan validation", "guardrails", "policy engine"],
      },
      {
        id: "multi-agent",
        name: "Multi-agent koordination og A2A-grænser",
        description:
          "Flere agenter, der taler sammen, skaber emergente fejlmodusser. Kræver eksplicit topology-design.",
        severity: "high",
        actions: [
          "Definér agent-roller og kommunikationsgrænser eksplicit (ikke \"alle taler med alle\")",
          "Mutual authentication mellem agenter (signerede beskeder)",
          "Loop-detektion: maks. N hops i en agent-kæde",
          "Single source-of-truth for agent-state — undgå distribueret konsensus uden begrundelse",
        ],
        sourceLinks: [
          { label: "OWASP ASI07 (Inter-agent Comm)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "OWASP ASI08 (Cascading Failures)", url: OWASP_AGENTIC, source: "OWASP" },
        ],
        tags: ["multi-agent", "A2A", "topology", "cascading"],
      },
      {
        id: "skill-versionering",
        name: "Skill-versionering og changelog",
        description:
          "Skills udvikler sig hurtigt — uden semver og changelog mister man overblikket. Brugere skal vide, hvad der har ændret sig.",
        severity: "medium",
        actions: [
          "Semantisk versionering pr. skill (major.minor.patch)",
          "Obligatorisk changelog ved publikation",
          "Backwards-incompatible changes kræver re-approval",
          "Sunset-policy for forældede versioner (fx max 2 minor-versioner bagud)",
        ],
        sourceLinks: [
          { label: "OWASP Agentic Security Initiative", url: OWASP_ASI, source: "OWASP" },
        ],
        tags: ["versionering", "semver", "changelog"],
      },
      {
        id: "prompt-injection-design",
        name: "Prompt-injection forsvar by design",
        description:
          "Indirect prompt injection er den mest udbredte angrebsvektor mod agenter. Skal modvirkes i design, ikke alene runtime.",
        severity: "critical",
        actions: [
          "Adskil instruktion-kanaler fra data-kanaler arkitektonisk",
          "Markér extern-hentet indhold som \"untrusted\" gennem hele pipelinen",
          "Privilege-separation: agent med skrive-tool ser ikke ekstern data",
          "Inkluder injection-tests i CI/CD",
        ],
        sourceLinks: [
          { label: "OWASP LLM01 (Prompt Injection)", url: OWASP_LLM, source: "OWASP" },
          { label: "OWASP ASI06 (Memory)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "MITRE ATLAS", url: MITRE_ATLAS, source: "MITRE" },
        ],
        tags: ["prompt injection", "design", "untrusted input"],
      },
    ],
    sourceLinks: [
      { label: "OWASP Top 10 for Agentic Applications 2026", url: OWASP_AGENTIC, source: "OWASP" },
      { label: "OWASP Agentic Security Initiative", url: OWASP_ASI, source: "OWASP" },
      { label: "Anthropic Responsible Scaling Policy v3.1", url: ANTHROPIC_RSP, source: "Anthropic" },
    ],
  },

  {
    id: "test-eval",
    name: "Test, evaluering og pre-launch-verifikation",
    pillar: "udvikling",
    icon: "🔍",
    description:
      "Hvordan måles AI-systemer før produktion — bias, robustness, hallucinationsrate, red-team.",
    subcategories: [
      {
        id: "eval-suite",
        name: "Pre-launch-evalueringssuite",
        description:
          "Standardiseret test-suite, der køres på enhver AI-løsning før produktion — performance, bias, robustness.",
        severity: "high",
        actions: [
          "Test på dansk-sproget data, ikke kun engelsk",
          "Bias-test pr. relevant beskyttet gruppe (køn, alder, etnicitet, geografi)",
          "Adversarial robustness-test (mindst en runde manuel red team)",
          "Dokumentation som forudsætning for produktion-gate",
        ],
        sourceLinks: [
          { label: "NIST MEASURE 2", url: NIST_AIRMF, source: "NIST" },
          { label: "AI Verify Foundation toolkit", url: AI_VERIFY, source: "AI Verify" },
          { label: "ISO/IEC 42001 A.6.2", url: ISO_42001, source: "ISO" },
        ],
        tags: ["evaluation", "benchmark", "bias", "robustness"],
      },
      {
        id: "red-teaming",
        name: "Red teaming og adversarial testing",
        description:
          "Aktiv adversarial test — eksternt eller internt team forsøger at få modellen til at fejle. Særligt vigtigt for GenAI og agenter.",
        severity: "high",
        actions: [
          "Mindst ét red team-event før produktion for høj-risiko-systemer",
          "Kombinér MITRE ATLAS-teknikker med OWASP LLM/ASI top 10",
          "Ekstern red team årligt for kritiske systemer",
          "Findings tilbage i evalueringssuite som regression-tests",
        ],
        sourceLinks: [
          { label: "MITRE ATLAS", url: MITRE_ATLAS, source: "MITRE" },
          { label: "NIST GenAI MS-1.1", url: NIST_GENAI, source: "NIST" },
          { label: "Anthropic RSP v3.1", url: ANTHROPIC_RSP, source: "Anthropic" },
        ],
        tags: ["red team", "adversarial", "ATLAS"],
      },
      {
        id: "hallucination-maaling",
        name: "Hallucinationsmåling og grounded-output",
        description:
          "Specifik måling af hvor ofte GenAI-systemet svarer med ikke-faktuelle påstande. Brugerens tillidsforhold afhænger af det.",
        severity: "high",
        actions: [
          "Benchmark mod kuraterede QA-datasæt (gerne dansk-specifikke)",
          "Kræv citation/grounding i output for kunderettede systemer",
          "Definér acceptabel hallucinationsrate pr. use case (kan være 0 for visse)",
          "Re-mål kvartalsvist; modeller drifter",
        ],
        sourceLinks: [
          { label: "NIST GenAI MS-2.5", url: NIST_GENAI, source: "NIST" },
          { label: "OWASP LLM09", url: OWASP_LLM, source: "OWASP" },
          { label: "MIT AI Risk Repository", url: MIT_RISK, source: "MIT" },
        ],
        tags: ["hallucination", "grounding", "citation"],
      },
      {
        id: "model-card",
        name: "Model card og system card",
        description:
          "Dokumentation pr. model: formål, træningsdata, evalueringsresultater, kendte begrænsninger. Forventet under ISO 42001 og EU AI Act.",
        severity: "medium",
        actions: [
          "Standardskabelon for alle produktions-modeller",
          "Inkluder bias-resultater, ikke kun performance",
          "Vedligehold som living document — opdatér ved hver retraining",
          "Tilgængelig for AI Council og 2L compliance",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 A.6", url: ISO_42001, source: "ISO" },
          { label: "EU AI Act art. 11+13", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "NIST GenAI GV-1.2", url: NIST_GENAI, source: "NIST" },
        ],
        tags: ["model card", "system card", "dokumentation"],
      },
    ],
    sourceLinks: [
      { label: "NIST AI RMF MEASURE", url: NIST_AIRMF, source: "NIST" },
      { label: "Singapore AI Verify Foundation", url: AI_VERIFY, source: "AI Verify" },
    ],
  },

  // ╔═══════════════════════════════════════════════════════════════════════╗
  // ║  PILLAR 3: DRIFT & VEDLIGEHOLD                                        ║
  // ╚═══════════════════════════════════════════════════════════════════════╝

  {
    id: "monitoring",
    name: "Monitorering og observability",
    pillar: "drift",
    icon: "📡",
    description:
      "Løbende måling af model-performance, datadrift, bias og brugeradfærd i produktion.",
    subcategories: [
      {
        id: "performance-drift",
        name: "Performance- og drift-monitorering",
        description:
          "Løbende metrik på model-output kvalitet og input-data-distribution. Driftalarmer skal trigge handlinger, ikke kun emails.",
        severity: "high",
        actions: [
          "Definér key metrics pr. model (accuracy, F1, hallucinationsrate, latency)",
          "Alarmer ved drift >X % fra baseline; auto-eskalér til Model Owner",
          "Sammenlign produktion-distribution med træningsfordeling",
          "Månedlig rapportering til AI Council",
        ],
        sourceLinks: [
          { label: "NIST MANAGE 4", url: NIST_AIRMF, source: "NIST" },
          { label: "Gartner AI TRiSM Runtime", url: GARTNER_TRISM, source: "Gartner" },
          { label: "ISO/IEC 42001 A.9", url: ISO_42001, source: "ISO" },
        ],
        tags: ["model drift", "monitoring", "baseline"],
      },
      {
        id: "bias-monitoring",
        name: "Bias- og fairness-monitorering i drift",
        description:
          "Bias-tests skal gentages i drift, ikke kun pre-launch. Modeller kan drift mod skævheder over tid.",
        severity: "high",
        actions: [
          "Kvartalsvis bias-måling pr. beskyttet gruppe i live-data",
          "Tærskel-baseret alarm ved disparate impact",
          "Dokumentér både resultat og handling i fairness-register",
          "Genberegn ved hver retraining eller dataopdatering",
        ],
        sourceLinks: [
          { label: "NIST MS-2.11", url: NIST_AIRMF, source: "NIST" },
          { label: "EU AI Act art. 10+15", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
        ],
        tags: ["bias", "fairness", "drift"],
      },
      {
        id: "logging-audit",
        name: "Logning og audit trail",
        description:
          "EU AI Act art. 12+26 kræver logning for højrisiko-systemer i 6 mdr. minimum. Logs skal være tilstrækkelige til efter-rekonstruktion.",
        severity: "critical",
        actions: [
          "Strukturerede logs: input, output, modelversion, bruger, timestamp",
          "Tamper-evident lagring (WORM/hash-chain) for kritiske systemer",
          "Mindst 6 måneders retention; længere for finans/sundhed",
          "Logreview-disciplin: ikke kun gem, men også læs (stikprøvebasis)",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 12+26", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "Finanstilsynet logning", url: FINANSTILSYNET_AI, source: "Finanstilsynet" },
          { label: "ISO/IEC 42001 A.9", url: ISO_42001, source: "ISO" },
        ],
        tags: ["logging", "audit trail", "retention"],
      },
      {
        id: "misbrug-monitoring",
        name: "Brugeradfærds- og misbrugsmonitorering",
        description:
          "Detektion af medarbejdere/kunder, der forsøger at omgå AI-systemets safeguards (jailbreaks, prompt manipulation).",
        severity: "medium",
        actions: [
          "Logning af jailbreak-forsøg + classifier på input",
          "Alarm ved gentaget refusal-trigger fra samme bruger",
          "Periodisk rapportering til sikkerhed og HR",
          "Trænings-feedback loop til AI literacy-program",
        ],
        sourceLinks: [
          { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
          { label: "MITRE ATLAS", url: MITRE_ATLAS, source: "MITRE" },
          { label: "OWASP LLM02", url: OWASP_LLM, source: "OWASP" },
        ],
        tags: ["misbrug", "jailbreak", "insider"],
      },
    ],
    sourceLinks: [
      { label: "NIST AI RMF MANAGE", url: NIST_AIRMF, source: "NIST" },
      { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
      { label: "Google SAIF", url: GOOGLE_SAIF, source: "Google" },
    ],
  },

  {
    id: "incident-response",
    name: "Hændelseshåndtering og incident response",
    pillar: "drift",
    icon: "🚨",
    description:
      "Hvordan organisationen reagerer når AI-systemet fejler — fra teknisk udfald til etisk hændelse.",
    subcategories: [
      {
        id: "incident-runbook",
        name: "AI-incident response-plan",
        description:
          "Specifik runbook for AI-hændelser — adskilt fra almindelig IT-incident men koordineret med den.",
        severity: "critical",
        actions: [
          "Klassificering af hændelser (P1-P4) med tilknyttede responstider",
          "Definér roller: Model Owner, Risk Owner, kommunikation, jura",
          "Pre-aftalt kill switch — hvem trykker, og hvordan?",
          "Tabletop-øvelse halvårligt",
        ],
        sourceLinks: [
          { label: "NIST MANAGE 4.3", url: NIST_AIRMF, source: "NIST" },
          { label: "ISO/IEC 42001 A.9.5", url: ISO_42001, source: "ISO" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
        ],
        tags: ["incident", "runbook", "tabletop"],
      },
      {
        id: "serious-incident-reporting",
        name: "Serious incident reporting til myndigheder",
        description:
          "EU AI Act art. 73 forpligter deployere af højrisiko-AI til at rapportere alvorlige hændelser inden 15 dage. Fra 2. august 2026 er dette skarpt.",
        severity: "critical",
        actions: [
          "Definér internt hvad \"serious incident\" er (mapping til art. 3(49))",
          "Pre-udfyldt rapporteringsskabelon klar",
          "Trigger-mekanisme: hvilke alarmer trigger automatisk eskalering?",
          "Test rapporteringskæden årligt",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 73", url: EU_ACT_ART_73, source: "EU AI Act" },
          { label: "Digst: AI-tilsyn", url: DIGST, source: "Digst" },
          { label: "Datatilsynet", url: DATATILSYNET_AI, source: "Datatilsynet" },
        ],
        tags: ["incident reporting", "artikel 73", "myndighed"],
      },
      {
        id: "kill-switch",
        name: "Kill switch og graceful degradation",
        description:
          "Evnen til hurtigt at stoppe en AI-funktion uden at vælte den underliggende forretningsproces. Sjældent designet ind fra start.",
        severity: "high",
        actions: [
          "Feature flag på alle AI-funktioner; dokumentér hvem der kan toggle",
          "Fallback-flow defineret (manuel, regel-baseret, tidligere modelversion)",
          "Test kill switch kvartalsvist — chaos engineering for AI",
          "Decision rights: hvem kan trykke i en krise uden videre godkendelse?",
        ],
        sourceLinks: [
          { label: "NIST MANAGE 2", url: NIST_AIRMF, source: "NIST" },
          { label: "OWASP ASI10 (Rogue Agents)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
        ],
        tags: ["kill switch", "fallback", "chaos engineering"],
      },
      {
        id: "post-incident",
        name: "Post-incident review og root cause",
        description:
          "Hver alvorlig hændelse skal afsluttes med blameless post-mortem og opdatering af kontroller. Modvirker gentagelse.",
        severity: "medium",
        actions: [
          "Skriftlig RCA inden 30 dage; AI Council reviewer",
          "Identificér om fejlen var teknisk, governance, eller proces",
          "Opdatér evalueringssuite med regressions-test for samme fejl",
          "Aggregeret hændelsesrapport til bestyrelse halvårligt",
        ],
        sourceLinks: [
          { label: "NIST GenAI GV-1.5", url: NIST_GENAI, source: "NIST" },
          { label: "ISO/IEC 42001 A.9.5", url: ISO_42001, source: "ISO" },
        ],
        tags: ["post-mortem", "RCA", "lessons learned"],
      },
    ],
    sourceLinks: [
      { label: "EU AI Act art. 73 — serious incident reporting", url: EU_ACT_ART_73, source: "EU AI Act" },
      { label: "NIST AI RMF MANAGE 4", url: NIST_AIRMF, source: "NIST" },
    ],
  },

  {
    id: "model-lifecycle",
    name: "Model-livscyklus, retraining og decommissioning",
    pillar: "drift",
    icon: "🔄",
    description:
      "Modeller skal vedligeholdes som ethvert andet produkt — periodisk retraining, version-bumps, kontrolleret nedlæggelse.",
    subcategories: [
      {
        id: "retraining-politik",
        name: "Retraining-politik",
        description:
          "Eksplicit politik for hvornår en model retraines — tidsbaseret, drift-baseret eller event-baseret.",
        severity: "medium",
        actions: [
          "Definér trigger-typer pr. model (tid, datadrift, performance-drop)",
          "Krav om fuld evalueringssuite før release af retrænet version",
          "Champion/challenger-model under en testperiode",
          "Dokumentér retraining-historik som del af model card",
        ],
        sourceLinks: [
          { label: "NIST MANAGE 4.2", url: NIST_AIRMF, source: "NIST" },
          { label: "ISO/IEC 42001 A.8", url: ISO_42001, source: "ISO" },
        ],
        tags: ["retraining", "champion challenger"],
      },
      {
        id: "model-version",
        name: "Model-version-management og rollback",
        description:
          "Strukturerede modelversioner med rollback-evne. Næsten ingen organisationer kan rulle GenAI-vendor-ændringer tilbage.",
        severity: "medium",
        actions: [
          "Pin model-versioner mod vendor (fx specifik dato-version ikke \"latest\")",
          "Kvalificér nye versioner gennem evalueringssuite før upgrade",
          "Bevar evnen til at køre forrige version i mindst 30 dage parallelt",
          "Forhandl med vendor om varselsperiode ved model-deprecation",
        ],
        sourceLinks: [
          { label: "NIST MEASURE 1", url: NIST_AIRMF, source: "NIST" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
          { label: "Anthropic RSP v3.1", url: ANTHROPIC_RSP, source: "Anthropic" },
        ],
        tags: ["versionering", "rollback", "model pinning"],
      },
      {
        id: "decommissioning",
        name: "Decommissioning og dataarkivering",
        description:
          "Ordnet nedlukning af AI-systemer — model, data, logs, dokumentation — efter retention-krav.",
        severity: "medium",
        actions: [
          "Decommissioning-tjekliste eksekveret af Model Owner",
          "Arkivér model + dokumentation i mindst lovbestemt periode (10 år for høj-risiko jf. EU AI Act)",
          "Slet personoplysninger jf. GDPR — særskilt fra modelarkiv",
          "Final report til AI Council inkl. lessons learned",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 18 (record-keeping)", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "ISO/IEC 42001 cl. 10", url: ISO_42001, source: "ISO" },
        ],
        tags: ["decommissioning", "arkivering", "sunset"],
      },
    ],
    sourceLinks: [
      { label: "NIST AI RMF MANAGE", url: NIST_AIRMF, source: "NIST" },
      { label: "ISO/IEC 42001 cl. 8+10", url: ISO_42001, source: "ISO" },
    ],
  },

  {
    id: "agent-runtime",
    name: "Agent runtime-governance (kerneområdet for 2026)",
    pillar: "drift",
    icon: "🤖",
    description:
      "Drift af agenter er kvalitativt anderledes end klassisk modeldrift. Agenter handler — og fejl multipliceres på sekunder. Den mest underudviklede del af de fleste organisationers governance i 2026.",
    subcategories: [
      {
        id: "agent-identitet",
        name: "Agent-identitet og non-human identity governance",
        description:
          "Hver agent skal have unik, scoped, kortlivet identitet med menneskelig ansvarsperson. NHI'er overstiger menneskelige identiteter 45:1 i 2026 — uden NHI-governance er det blindspot total.",
        severity: "critical",
        actions: [
          "Unik agent-identity pr. agent-instans (ikke delt service account)",
          "Short-lived credentials (timer/dage, ikke måneder)",
          "Eksplicit kæde: agent → menneskelig \"principal\" → afdeling",
          "Auto-deprovisioning når principalen forlader organisationen",
        ],
        sourceLinks: [
          { label: "CSA Non-Human Identity / Agentic AI whitepaper", url: CSA_NHI, source: "CSA" },
          { label: "OWASP ASI03 (Identity)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "EU AI Act art. 26 accountability", url: EU_ACT_ART_26, source: "EU AI Act" },
        ],
        tags: ["NHI", "agent identity", "principal"],
      },
      {
        id: "loop-cost-containment",
        name: "Loop- og cost-containment",
        description:
          "Per-session token-budget og loop-detection. Det mest konkrete agent-governance-mål i 2026: ingen produktions-agent uden hard cost-ceiling.",
        severity: "critical",
        actions: [
          "Per-session token + tool-call budget; hard-stop ved tærskel",
          "Recursion-depth limit på multi-agent kæder",
          "Anomaly detection på cost-per-session-distribution",
          "Real-time budget-dashboard, ikke månedlig faktura-overraskelse",
        ],
        sourceLinks: [
          { label: "OWASP ASI08 (Cascading Failures)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "FinOps for AI", url: FINOPS_AI, source: "FinOps" },
          { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
        ],
        tags: ["loop", "cost", "token budget"],
      },
      {
        id: "human-oversight-skala",
        name: "Human oversight i skala",
        description:
          "Når 1000 agenter kører, kan ikke alt eskalere til menneske. Oversight-strategien skal være risiko-tieret og sampling-baseret.",
        severity: "high",
        actions: [
          "Tier 1 (lav-risiko): periodisk sampling-review (fx 1 % af sessions)",
          "Tier 2 (medium): real-time human approval på definerede beslutningsgrænser",
          "Tier 3 (høj-risiko): two-person rule for irreversible handlinger",
          "Reviewer-fatigue mitigation: roterende reviewers, hjælpe-prompts",
        ],
        sourceLinks: [
          { label: "EU AI Act art. 14", url: EU_AI_ACT, source: "EU AI Act" },
          { label: "Anthropic: Framework for safe and trustworthy agents (aug 2025)", url: ANTHROPIC_AGENT_FRAMEWORK, source: "Anthropic" },
          { label: "OWASP ASI09 (Human-Agent Trust)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "Microsoft RAI Standard", url: MS_RAI, source: "Microsoft" },
        ],
        tags: ["human oversight", "sampling", "two-person rule"],
      },
      {
        id: "agent-memory",
        name: "Agent-memory governance",
        description:
          "Persistent agent-memory (vector store, conversation history) er en ny dataeksponering. Hvad husker agenten, og hvem kan tilgå det?",
        severity: "high",
        actions: [
          "Klassificér memory-typer: ephemeral / session / cross-session / shared",
          "Adgangskontrol på cross-session memory; ikke fri læseadgang",
          "Memory-purge ved data subject request (GDPR cascade)",
          "Periodisk audit: hvad sidder i memory der ikke burde?",
        ],
        sourceLinks: [
          { label: "OWASP ASI06 (Memory)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "GDPR art. 17", url: GDPR_ART_17, source: "GDPR/EDPB" },
          { label: "MIT AI Risk Repository", url: MIT_RISK, source: "MIT" },
        ],
        tags: ["agent memory", "vector store", "purge"],
      },
      {
        id: "rogue-agent",
        name: "Rogue agent-detektion",
        description:
          "Agenter der \"går af sporet\" — handler uden for scope, gentager mislykkede handlinger, omgår guardrails. Skal detekteres aktivt.",
        severity: "high",
        actions: [
          "Baseline-modeller for normal agent-adfærd; alarmer på anomalier",
          "\"Two strikes\" — to forsøg på samme blokerede handling = auto-suspend",
          "Daglig review af agenter på alarmliste",
          "Rogue agent-runbook (suspend, audit, root cause)",
        ],
        sourceLinks: [
          { label: "OWASP ASI10 (Rogue Agents)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "MITRE ATLAS", url: MITRE_ATLAS, source: "MITRE" },
        ],
        tags: ["rogue agent", "anomaly", "suspend"],
      },
      {
        id: "agent-exfiltration",
        name: "Agent-induceret data-eksfiltration",
        description:
          "Agenter med adgang til både sensitive data og external tools (email, web, file share) kan ufrivilligt lække data — særligt under prompt injection.",
        severity: "critical",
        actions: [
          "Privilege separation: agent med ekstern kommunikation må ikke se sensitive data direkte",
          "Data Loss Prevention på agent-egress (email, upload, API)",
          "Markér og blokér exfil-mønstre (CPR, store dokument-paste)",
          "Audit: hvilke agenter har set hvilke data den seneste 90 dage?",
        ],
        sourceLinks: [
          { label: "OWASP LLM06", url: OWASP_LLM, source: "OWASP" },
          { label: "OWASP ASI06 (Memory)", url: OWASP_AGENTIC, source: "OWASP" },
          { label: "MITRE ATLAS", url: MITRE_ATLAS, source: "MITRE" },
        ],
        tags: ["exfiltration", "DLP", "privilege separation"],
      },
    ],
    sourceLinks: [
      { label: "OWASP Top 10 for Agentic Applications 2026", url: OWASP_AGENTIC, source: "OWASP" },
      { label: "CSA Non-Human Identity & Agentic AI Governance", url: CSA_NHI, source: "CSA" },
      { label: "MITRE ATLAS", url: MITRE_ATLAS, source: "MITRE" },
    ],
  },

  {
    id: "finops",
    name: "FinOps og bæredygtighed",
    pillar: "drift",
    icon: "💰",
    description:
      "AI-økonomi og miljøaftryk — to relativt nye governance-overflader. FinOps fordi tokenforbrug er ulineært; bæredygtighed fordi OECD/CoE-rammer kræver dokumentation.",
    subcategories: [
      {
        id: "showback",
        name: "AI-omkostningsallokering og showback",
        description:
          "Tokens og GPU-tid skal tilbageføres til business unit, der bruger dem. Uden showback bliver det kollektiv pulje med tragedy of the commons.",
        severity: "medium",
        actions: [
          "Tag alle API-kald med business unit + use case",
          "Månedlig showback-rapport pr. afdeling",
          "Top-10 dyreste use cases til kvartalsmøde",
          "Eskalering ved >20 % budget-overskridelse",
        ],
        sourceLinks: [
          { label: "FinOps for AI", url: FINOPS_AI, source: "FinOps" },
          { label: "Gartner AI TRiSM", url: GARTNER_TRISM, source: "Gartner" },
        ],
        tags: ["FinOps", "showback", "TCO"],
      },
      {
        id: "token-budget",
        name: "Token-budget pr. team og pr. use case",
        description:
          "Hård tærskel som sikkerhedsforanstaltning, ikke kun måling. Forhindrer surprises.",
        severity: "medium",
        actions: [
          "Månedlig token-quota pr. team; hard-stop ved 110 %",
          "Per-use case budget defineret i business case",
          "Auto-eskalering ved 80 %, hard-stop ved 100 %",
          "Genvurdering kvartalsvis baseret på faktisk brug",
        ],
        sourceLinks: [
          { label: "FinOps for AI", url: FINOPS_AI, source: "FinOps" },
        ],
        tags: ["token budget", "quota", "hard stop"],
      },
      {
        id: "energi-co2",
        name: "Energi- og CO2-rapportering for AI",
        description:
          "CSRD/ESRS E1 har endnu ikke AI-specifikke krav, men dækker Scope 1-3 hvor AI-energiforbrug indgår. Forventning om eksplicitte AI-krav i kommende ESRS-revisioner (gældende FY 2027). Voksende bestyrelsesopmærksomhed.",
        severity: "medium",
        actions: [
          "Vendor-attestation om regions energi-mix",
          "Vurder inferenceeffektivitet ved modelvalg (mindre model = mindre CO2)",
          "Inkluder AI-fodaftryk i CSRD-rapportering under Scope 3",
          "Etabler interne reduktionsmål — foran kommende ESRS-revisioner",
        ],
        sourceLinks: [
          { label: "OECD Principles 1.4", url: OECD_PRINCIPLES, source: "OECD" },
        ],
        tags: ["CO2", "CSRD", "ESG", "bæredygtighed"],
      },
    ],
    sourceLinks: [
      { label: "FinOps for AI Working Group", url: FINOPS_AI, source: "FinOps" },
      { label: "OECD Principles 1.4", url: OECD_PRINCIPLES, source: "OECD" },
    ],
  },

  {
    id: "audit-revision",
    name: "Kontinuerlig revision og forbedring",
    pillar: "drift",
    icon: "🔁",
    description:
      "Den løbende governance-cyklus — audits, modenhedsvurdering, opdatering af rammer.",
    subcategories: [
      {
        id: "intern-audit",
        name: "Intern AI-audit-program",
        description:
          "Periodisk 3L-audit af AI governance og enkelt-systemer. Forventningen fra Finanstilsynet og kommende EU AI Office er at dette eksisterer.",
        severity: "high",
        actions: [
          "Årligt audit-program godkendt af revisionsudvalg",
          "Risikobaseret valg af systemer til detalje-audit",
          "Audit-findings tilbage til AI Council med tidsfrister",
          "Ekstern audit af governance-system mindst hvert 3. år",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001 cl. 9.2", url: ISO_42001, source: "ISO" },
          { label: "Finanstilsynet god praksis", url: FINANSTILSYNET_AI, source: "Finanstilsynet" },
        ],
        tags: ["audit", "3LoD", "ekstern revision"],
      },
      {
        id: "modenhed",
        name: "Modenhedsvurdering og benchmark",
        description:
          "Periodisk vurdering af egen AI governance-modenhed mod ramme (NIST AI RMF tier-model, ISO 42001 readiness).",
        severity: "medium",
        actions: [
          "Årlig self-assessment mod NIST AI RMF tiers",
          "Benchmark mod sektor-peers via DI/brancheforening",
          "Roadmap for modenhedsforbedring godkendt af AI Council",
          "Bestyrelses-rapportering på modenhedsdelta",
        ],
        sourceLinks: [
          { label: "NIST GOVERN 4", url: NIST_AIRMF, source: "NIST" },
          { label: "DI strategisk AI-guide", url: DI_GUIDE, source: "DI" },
          { label: "AI Verify Foundation toolkit", url: AI_VERIFY, source: "AI Verify" },
        ],
        tags: ["modenhed", "benchmark", "self-assessment"],
      },
      {
        id: "horizon-scanning",
        name: "Horizon scanning og policy-opdatering",
        description:
          "AI-landskabet ændrer sig hurtigt — politikker skal følge med. Specifik ansvar for at scanne, vurdere og opdatere.",
        severity: "medium",
        actions: [
          "Navngiv ansvarlig for horizon scanning (typisk AI Risk Owner)",
          "Kvartalsvis review af regulatoriske ændringer (Digitaliseringsstyrelsen, Datatilsynet, EU AI Office)",
          "Halvårlig policy-revision",
          "Forhåndspositionering på kommende frameworks (CoE Convention, NIST opdateringer)",
        ],
        sourceLinks: [
          { label: "OECD Principles 2.4", url: OECD_PRINCIPLES, source: "OECD" },
          { label: "Digst: AI-tilsyn", url: DIGST, source: "Digst" },
        ],
        tags: ["horizon scanning", "policy update", "regulatorisk"],
      },
      {
        id: "ekstern-certificering",
        name: "Eksterne assurances og certificeringer",
        description:
          "ISO/IEC 42001-certificering kombineret med SOC 2 / ISO 27001 (med AI-scope) bliver markedsforventning i 2026. Singapore AI Verify-attestering vinder international troværdighed.",
        severity: "medium",
        actions: [
          "Roadmap til ISO 42001-certificering med konkret target-dato",
          "Kombinér med eksisterende ISO 27001/27701-programmer",
          "Vurder AI Verify-foundation testing toolkit for international troværdighed",
          "Publicér certifikatstatus eksternt",
        ],
        sourceLinks: [
          { label: "ISO/IEC 42001", url: ISO_42001, source: "ISO" },
          { label: "AI Verify Foundation", url: AI_VERIFY, source: "AI Verify" },
        ],
        tags: ["ISO 42001", "certificering", "assurance"],
      },
    ],
    sourceLinks: [
      { label: "ISO/IEC 42001 cl. 9", url: ISO_42001, source: "ISO" },
      { label: "NIST AI RMF GOVERN 4", url: NIST_AIRMF, source: "NIST" },
    ],
  },
];

export const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case "critical": return "text-danger";
    case "high": return "text-warning";
    case "medium": return "text-info";
    case "low": return "text-success";
  }
};

export const getSeverityBg = (severity: Severity): string => {
  switch (severity) {
    case "critical": return "bg-danger/15 border-danger/30";
    case "high": return "bg-warning/15 border-warning/30";
    case "medium": return "bg-info/15 border-info/30";
    case "low": return "bg-success/15 border-success/30";
  }
};

export const getCategoriesByPillar = (pillar: PillarId): Category[] => {
  return categories.filter((c) => c.pillar === pillar);
};
