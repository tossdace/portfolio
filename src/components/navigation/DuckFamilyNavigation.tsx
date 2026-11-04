"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Terminal } from "lucide-react";
import { navigation, profile } from "@/data/portfolio";

interface DuckFamilyNavigationProps {
  onTerminal: () => void;
}

export function DuckFamilyNavigation({
  onTerminal,
}: DuckFamilyNavigationProps) {
  const [activeHref, setActiveHref] = useState("#top");

  useEffect(() => {
    const targets = ["top", ...navigation.map(({ href }) => href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((target): target is HTMLElement => target instanceof HTMLElement);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );
        const current = visible[0]?.target;
        if (current instanceof HTMLElement) {
          setActiveHref(`#${current.id}`);
        }
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="duck-nav-header">
      <nav className="duck-family-nav" aria-label="Portfolio sections">
        <a
          className="duck-nav-home"
          href="#top"
          aria-label={`Home, ${profile.name}`}
          aria-current={activeHref === "#top" ? "location" : undefined}
          onClick={() => setActiveHref("#top")}
        >
          <DuckIllustration mother pose={0} />
          <span className="duck-home-label">{profile.name}</span>
        </a>

        {navigation.map((item, index) => (
          <a
            key={item.href}
            className="duck-nav-item"
            href={item.href}
            aria-label={item.label}
            aria-current={activeHref === item.href ? "location" : undefined}
            onClick={() => setActiveHref(item.href)}
          >
            <DuckIllustration pose={index + 1} />
            <span className="duck-nav-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        className="duck-nav-terminal"
        type="button"
        onClick={onTerminal}
        aria-label="Open terminal"
        title="Open terminal"
      >
        <Terminal aria-hidden="true" />
      </button>
    </header>
  );
}

function DuckIllustration({
  mother = false,
  pose,
}: {
  mother?: boolean;
  pose: number;
}) {
  const wingPaths = [
    "M31 42c8-11 24-10 31 0-8 7-21 8-31 0Z",
    "M31 42c7-12 22-13 31-2-7 9-20 10-31 2Z",
    "M31 42c9-10 24-8 31 3-9 6-23 6-31-3Z",
    "M30 43c9-12 24-11 32 0-8 8-23 8-32 0Z",
    "M31 42c8-11 22-9 31 2-9 7-22 6-31-2Z",
  ];
  const bobDelay = mother ? "0ms" : `${(pose % 5) * -170}ms`;

  return (
    <svg
      className={`duck-art${mother ? " duck-art-mother" : ""} duck-art-pose-${pose % 5}`}
      viewBox="0 0 88 68"
      role="img"
      aria-hidden="true"
      focusable="false"
      style={{ "--duck-delay": bobDelay } as CSSProperties}
    >
      <ellipse className="duck-water-shadow" cx="45" cy="59" rx="27" ry="4" />
      <path
        className="duck-tail"
        d="M65 43c9-9 13-8 17-6-2 6-7 10-15 11"
      />
      <path
        className="duck-body"
        d="M17 44c0-12 10-21 25-21 12 0 20 6 24 16 4 1 8 3 10 7-4 3-9 4-15 4H31c-8 0-14-2-14-6Z"
      />
      <path className="duck-wing" d={wingPaths[pose % wingPaths.length]} />
      <path
        className="duck-neck"
        d="M26 31c-1-9 2-19 10-22 8-3 17 2 18 10 1 7-3 12-8 15"
      />
      {mother && <path className="duck-scarf" d="M28 33c7 5 15 5 22 0l3 5c-8 6-19 6-28 0Z" />}
      <path className="duck-beak" d="M12 19c-5-2-9-1-11 2 3 4 8 6 14 5l5-3Z" />
      <circle className="duck-eye" cx="25" cy="17" r="1.8" />
      <circle className="duck-highlight" cx="24.5" cy="16.5" r="0.55" />
      <path className="duck-leg" d="M37 51v5m15-5v5" />
      <path className="duck-foot" d="M33 57h8m7 0h8" />
      {mother && (
        <g className="duck-blossom" aria-hidden="true">
          <circle cx="49" cy="5" r="2.2" />
          <circle cx="53" cy="7" r="2.2" />
          <circle cx="51" cy="11" r="2.2" />
          <circle cx="47" cy="9" r="2.2" />
          <circle className="duck-blossom-center" cx="50" cy="8" r="1.2" />
        </g>
      )}
    </svg>
  );
}
