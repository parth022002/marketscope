import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "icon" | "inline";
  className?: string;
  size?: number;
  height?: number;
}

export default function BrandLogo({
  variant = "full",
  className = "",
  size = 32,
  height = 36,
}: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <Link href="/" className={`inline-flex items-center gap-2 hover:opacity-90 transition ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-icon.png"
          alt="MarketScope.io Icon"
          width={size}
          height={size}
          className="rounded-lg shadow-md object-contain"
        />
      </Link>
    );
  }

  if (variant === "inline") {
    return (
      <Link href="/" className={`inline-flex items-center gap-2.5 hover:opacity-90 transition ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-icon.png"
          alt="MarketScope.io Icon"
          width={size}
          height={size}
          className="rounded-lg shadow-sm object-contain"
        />
        <div className="flex flex-col">
          <div className="text-base font-extrabold tracking-tight text-white flex items-center leading-none">
            Market<span className="text-[#087BEE]">Scope</span>
            <span className="text-slate-400 font-semibold text-xs ml-0.5">.io</span>
          </div>
          <div className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
            Financial Research &amp; Intelligence
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`block hover:opacity-95 transition ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-full.png"
        alt="MarketScope.io — Financial Research & Intelligence"
        style={{ height: `${height}px` }}
        className="w-auto max-w-full object-contain"
      />
    </Link>
  );
}
