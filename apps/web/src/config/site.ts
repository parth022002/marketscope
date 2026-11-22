// ==============================================================================
// MarketScope.io — Central Application & Site Configuration
// ==============================================================================

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  developerName: string;
  contactEmail: string;
  securityEmail: string;
  privacyEmail: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "MarketScope.io",
  tagline: "Financial Research & Intelligence",
  description:
    "Research global markets, explore financial insights and make informed decisions through transparent, data-driven intelligence.",

  // Single Source of Truth for Developer Attribution
  // Configurable via NEXT_PUBLIC_DEVELOPER_NAME environment variable
  developerName: process.env.NEXT_PUBLIC_DEVELOPER_NAME || "Parth",

  // Contact & Security Disclosure Addresses
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@marketscope.io",
  securityEmail: process.env.NEXT_PUBLIC_SECURITY_EMAIL || "security@marketscope.io",
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "privacy@marketscope.io",

  // Policy & Release Governance
  version: "2.1.0",
  effectiveDate: "November 20, 2026",
  lastUpdated: "November 22, 2026",

  // Social Links (Only displayed in UI when populated with official active URLs)
  socialLinks: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/parth022002/marketscope",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  },
};
