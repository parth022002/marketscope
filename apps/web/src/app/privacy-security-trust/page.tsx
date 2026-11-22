import type { Metadata } from "next";
import PrivacySecurityTrustContent from "@/components/PrivacySecurityTrustContent";

export const metadata: Metadata = {
  title: "Privacy, Security & Trust | MarketScope.io",
  description:
    "Comprehensive disclosure of MarketScope.io's privacy safeguards, DPDP Act 2023 compliance, application security architecture, financial data integrity, verified news sourcing, and responsible AI guardrails.",
  keywords: [
    "MarketScope privacy",
    "financial data integrity",
    "DPDP Act 2023",
    "market data latency",
    "financial news verification",
    "application security",
    "responsible AI finance",
  ],
  openGraph: {
    title: "Privacy, Security & Trust | MarketScope.io",
    description:
      "Explore MarketScope.io's commitment to personal privacy, multi-exchange data verification, source-backed news intelligence, and application security.",
    type: "website",
  },
};

export default function PrivacySecurityTrustPage() {
  return <PrivacySecurityTrustContent />;
}
