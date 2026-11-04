"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Music2, Terminal } from "lucide-react";
import { navigation, profile } from "@/data/portfolio";

interface DuckFamilyNavigationProps {
  onTerminal: () => void;
}

export function DuckFamilyNavigation({
  onTerminal,
}: DuckFamilyNavigationProps) {
  const [activeHref, setActiveHref] = useState("#top");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicStarting, setMusicStarting] = useState(false);
  const [musicError, setMusicError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const musicRequestedRef = useRef(false);
  const autoplayAttemptedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.18;

    return () => {
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      audio.pause();
    };
  }, []);

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

  const fadeVolumeTo = useCallback((
    audio: HTMLAudioElement,
    targetVolume: number,
    onComplete?: () => void,
  ) => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    const startVolume = audio.volume;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || Math.abs(startVolume - targetVolume) < 0.001) {
      audio.volume = targetVolume;
      onComplete?.();
      return;
    }

    const duration = 700;
    let startTime: number | undefined;

    const animateVolume = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(animateVolume);
      } else {
        fadeFrameRef.current = null;
        audio.volume = targetVolume;
        onComplete?.();
      }
    };

    fadeFrameRef.current = requestAnimationFrame(animateVolume);
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || musicStarting) return;

    setMusicError("");

    if (musicPlaying) {
      musicRequestedRef.current = false;
      setMusicPlaying(false);
      fadeVolumeTo(audio, 0, () => {
        if (!musicRequestedRef.current) audio.pause();
      });
      return;
    }

    setMusicStarting(true);
    audio.loop = true;

    if (audio.paused) audio.volume = 0;

    try {
      if (audio.paused) await audio.play();
      musicRequestedRef.current = true;
      setMusicPlaying(true);
      fadeVolumeTo(audio, 0.18);
    } catch {
      musicRequestedRef.current = false;
      audio.pause();
      audio.volume = 0;
      setMusicError("Music could not start. Please try again.");
    } finally {
      setMusicStarting(false);
    }
  };

  const handleAudioError = () => {
    const audio = audioRef.current;
    musicRequestedRef.current = false;
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
    if (audio) {
      audio.pause();
      audio.volume = 0;
    }
    setMusicPlaying(false);
    setMusicStarting(false);
    setMusicError("Music could not load. Please try again later.");
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || autoplayAttemptedRef.current) return;

    autoplayAttemptedRef.current = true;
    audio.loop = true;
    audio.volume = 0;
    setMusicStarting(true);

    audio.play().then(() => {
      musicRequestedRef.current = true;
      setMusicPlaying(true);
      fadeVolumeTo(audio, 0.18);
    }).catch(() => {
      audio.pause();
      audio.volume = 0;
      setMusicError("Autoplay was blocked. Press play to start ambient music.");
    }).finally(() => {
      setMusicStarting(false);
    });
  }, [fadeVolumeTo]);

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
          <DuckCharacter lead pose={0} />
          <span className="duck-nav-plaque duck-home-label">{profile.name}</span>
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
            <DuckCharacter pose={index + 1} />
            <span className="duck-nav-plaque duck-nav-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        className="duck-nav-music"
        type="button"
        onClick={toggleMusic}
        disabled={musicStarting}
        aria-label={
          musicStarting
            ? "Starting ambient music"
            : musicPlaying
              ? "Pause ambient music"
              : musicError
                ? "Retry ambient music"
                : "Play ambient music"
        }
        aria-pressed={musicPlaying}
        aria-describedby={musicError ? "duck-music-status" : undefined}
        title={
          musicStarting
            ? "Starting ambient music"
            : musicPlaying
              ? "Pause ambient music"
              : "Play ambient music"
        }
      >
        {musicPlaying ? (
          <svg
            className="duck-nav-music-wave"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 10v4" />
            <path d="M9 7v10" />
            <path d="M13 4v16" />
            <path d="M17 8v8" />
            <path d="M21 10v4" />
          </svg>
        ) : (
          <Music2 aria-hidden="true" />
        )}
      </button>

      <button
        className="duck-nav-terminal"
        type="button"
        onClick={onTerminal}
        aria-label="Open terminal"
        title="Open terminal"
      >
        <Terminal aria-hidden="true" />
      </button>
      <audio
        ref={audioRef}
        className="duck-nav-audio"
        src="/media/ambient-theme.mp3"
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onError={handleAudioError}
      />
      <span id="duck-music-status" className="sr-only" role="status" aria-live="polite">
        {musicError}
      </span>
    </header>
  );
}

function DuckCharacter({ lead = false, pose }: { lead?: boolean; pose: number }) {
  const bobDelay = lead ? "0ms" : `${((pose - 1) % 5) * -150}ms`;

  return (
    <span className="duck-character">
      <svg className="duck-water-ripple" viewBox="0 0 100 20" aria-hidden="true">
        <ellipse cx="50" cy="10" rx="41" ry="5" />
        <ellipse cx="50" cy="10" rx="29" ry="3" />
      </svg>
      <svg
        className={`duck-art${lead ? " duck-art-lead" : ""} duck-art-pose-${pose}`}
        viewBox="0 0 100 76"
        aria-hidden="true"
        focusable="false"
        style={{ "--duck-delay": bobDelay } as CSSProperties}
      >
        <ellipse className="duck-water-shadow" cx="49" cy="66" rx="33" ry="4" />
        {lead && (
          <g className="duck-backpack">
            <path d="M66 33c7-5 15-3 17 4v19H66Z" />
            <path d="M66 39c-4 2-6 7-5 14l8 2V39Z" />
            <path className="duck-pack-strap" d="M66 36c-5 5-6 13-3 19" />
            <path className="duck-pack-buckle" d="M68 45h10v7H68z" />
          </g>
        )}
        <path className="duck-tail" d="M70 48c10-9 15-8 19-6-2 7-8 11-17 12" />
        <path
          className="duck-body"
          d="M19 51c0-15 12-25 30-25 14 0 23 7 27 19 5 1 9 4 11 8-5 4-11 5-18 5H35c-10 0-16-2-16-7Z"
        />
        <path
          className="duck-wing"
          d={[
            "M37 49c7-12 24-12 33-1-8 9-23 10-33 1Z",
            "M37 49c7-13 24-14 33-3-7 10-23 12-33 3Z",
            "M37 48c9-11 25-9 33 3-10 7-24 7-33-3Z",
            "M36 50c9-13 25-12 34 0-9 9-25 9-34 0Z",
            "M37 49c8-12 23-10 33 2-10 8-24 7-33-2Z",
          ][(pose - 1 + 5) % 5]}
        />
        <path className="duck-neck" d="M31 37c-2-11 2-23 12-27 9-4 19 2 20 12 1 8-3 14-9 18" />
        {lead ? (
          <g className="duck-lead-gear">
            <path className="duck-cap" d="M35 13c3-8 11-11 19-8 5 2 8 6 9 11H35Z" />
            <path className="duck-cap-brim" d="M32 14c7-3 20-3 30 0l-2 4H34Z" />
            <path className="duck-goggle-band" d="M37 10c7-2 16-2 23 0" />
            <circle className="duck-goggle" cx="43" cy="11" r="4.2" />
            <circle className="duck-goggle" cx="55" cy="11" r="4.2" />
            <path className="duck-scarf" d="M31 38c9 6 19 6 28 0l4 6c-10 7-23 7-33 0Z" />
            <path className="duck-scarf-tail" d="M48 44c7 4 11 9 12 15-7-3-12-7-15-12Z" />
          </g>
        ) : (
          <DucklingAccessory pose={pose} />
        )}
        <path className="duck-beak" d="M17 25c-6-2-11-1-14 3 4 5 10 7 17 5l6-4Z" />
        <circle className="duck-eye" cx="32" cy="22" r="2" />
        <circle className="duck-highlight" cx="31.5" cy="21.4" r="0.65" />
        <path className="duck-leg" d="M42 58v6m17-6v6" />
        <path className="duck-foot" d="M37 65h10m8 0h10" />
        {lead && (
          <g className="duck-lantern">
            <path d="M81 44h11l-1 15h-9Z" />
            <path d="M83 44c0-5 7-5 7 0" />
            <path className="duck-lantern-light" d="m86.5 47 2.5 7h-5Z" />
          </g>
        )}
      </svg>
    </span>
  );
}

function DucklingAccessory({ pose }: { pose: number }) {
  switch (pose) {
    case 1:
      return (
        <g className="duckling-accessory duckling-scout-cap">
          <path d="M39 12c3-7 10-9 16-6 4 2 6 5 7 9H39Z" />
          <path d="M36 15c6-2 18-2 27 0l-2 3H38Z" />
        </g>
      );
    case 2:
      return (
        <g className="duckling-accessory duckling-headphones">
          <path d="M38 20c0-14 20-17 25-3" />
          <rect x="36" y="16" width="5" height="9" rx="2" />
          <rect x="59" y="13" width="5" height="9" rx="2" />
        </g>
      );
    case 3:
      return (
        <g className="duckling-accessory duckling-pack">
          <path d="M65 37c1-6 10-8 14-3v14H65Z" />
          <path d="M65 40c-4 2-5 7-3 12h6V39Z" />
          <path d="M67 41h9v6h-9z" />
        </g>
      );
    case 4:
      return (
        <g className="duckling-accessory duckling-pilot-cap">
          <path d="M38 14c3-8 12-10 19-6 4 2 6 5 6 9H38Z" />
          <path d="M36 16c7-2 18-2 28 0l-2 3H38Z" />
          <path d="M45 8h8" />
        </g>
      );
    default:
      return (
        <g className="duckling-accessory duckling-blossom">
          <circle cx="60" cy="8" r="3" />
          <circle cx="65" cy="11" r="3" />
          <circle cx="62" cy="16" r="3" />
          <circle cx="57" cy="13" r="3" />
          <circle className="duck-blossom-center" cx="61" cy="12" r="1.6" />
        </g>
      );
  }
}
