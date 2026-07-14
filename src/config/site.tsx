import type { ReactNode } from "react";

export const siteConfig = {
  topicWord: "Governance",
  sourceLine: (
    <>
      Governance-data baseret på{" "}
      <a href="https://airc.nist.gov/airmf-resources/playbook/" target="_blank" rel="noopener noreferrer">NIST AI RMF</a>,{" "}
      <a href="https://www.iso.org/standard/42001" target="_blank" rel="noopener noreferrer">ISO/IEC 42001</a>,{" "}
      <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener noreferrer">EU AI Act</a>,{" "}
      <a href="https://oecd.ai/en/ai-principles" target="_blank" rel="noopener noreferrer">OECD AI Principles</a>,{" "}
      <a href="https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" target="_blank" rel="noopener noreferrer">OWASP Agentic Top 10</a> og{" "}
      <a href="https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf" target="_blank" rel="noopener noreferrer">Microsoft RAI</a>. Opdateret juni 2026.
    </>
  ) as ReactNode,
};
