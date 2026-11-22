/**
 * MarketScope.io — Frontend Environment Validator
 * ==============================================================================
 * Validates public and build-time environment variables for Next.js 15.
 */

export interface ClientEnvAudit {
  name: string;
  isSet: boolean;
  isPublic: boolean;
  valueMasked: string;
  status: "VALIDATED" | "OPTIONAL_DEFAULT" | "MISSING_REQUIRED";
  description: string;
}

export function auditFrontendEnvironment(): {
  isConfigured: boolean;
  apiBaseUrl: string;
  items: ClientEnvAudit[];
} {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "MarketScope.io";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marketscope.io";

  const items: ClientEnvAudit[] = [
    {
      name: "NEXT_PUBLIC_API_BASE_URL",
      isSet: Boolean(process.env.NEXT_PUBLIC_API_BASE_URL),
      isPublic: true,
      valueMasked: apiBase,
      status: process.env.NEXT_PUBLIC_API_BASE_URL ? "VALIDATED" : "OPTIONAL_DEFAULT",
      description: "FastAPI Backend endpoint queried by the browser",
    },
    {
      name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      isSet: Boolean(clerkPubKey),
      isPublic: true,
      valueMasked: clerkPubKey ? `${clerkPubKey.slice(0, 8)}...` : "[NOT_SET]",
      status: clerkPubKey ? "VALIDATED" : "MISSING_REQUIRED",
      description: "Clerk browser publishable key for user authentication",
    },
    {
      name: "NEXT_PUBLIC_APP_NAME",
      isSet: Boolean(process.env.NEXT_PUBLIC_APP_NAME),
      isPublic: true,
      valueMasked: appName,
      status: "VALIDATED",
      description: "Application display name",
    },
    {
      name: "NEXT_PUBLIC_APP_URL",
      isSet: Boolean(process.env.NEXT_PUBLIC_APP_URL),
      isPublic: true,
      valueMasked: appUrl,
      status: "VALIDATED",
      description: "Canonical site origin for SEO and OpenGraph tags",
    },
    {
      name: "NEXT_PUBLIC_AI_ENABLED",
      isSet: Boolean(process.env.NEXT_PUBLIC_AI_ENABLED),
      isPublic: true,
      valueMasked: process.env.NEXT_PUBLIC_AI_ENABLED || "true",
      status: "VALIDATED",
      description: "Toggles AI research synthesis panels in UI",
    },
  ];

  const hasMissing = items.some((i) => i.status === "MISSING_REQUIRED");

  return {
    isConfigured: !hasMissing,
    apiBaseUrl: apiBase,
    items,
  };
}
