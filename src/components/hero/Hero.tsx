"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { profile } from "@/data/portfolio";

interface HeroProps {
  bootDone?: boolean;
}

export default function Hero({ bootDone = true }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const updateMotionPreference = () => setMotionAllowed(media.matches);
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!bootDone || hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dhyan-kicker",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".dhyan-title-line",
        { yPercent: 115, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.25,
          stagger: 0.12,
          delay: 0.2,
          ease: "power4.out",
        }
      );
      gsap.fromTo(
        ".dhyan-copy, .dhyan-actions, .dhyan-meta",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          delay: 0.6,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".dhyan-scene-wrap",
        { opacity: 0, scale: 0.9, y: 35 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.6,
          delay: 0.05,
          ease: "power3.out",
        }
      );
    }, root);

    return () => ctx.revert();
  }, [bootDone]);

  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <section
      ref={root}
      id="top"
      className="dhyan-hero"
    >
      <div className="dhyan-grain" />
      <div className="dhyan-vignette" />

      {/* Hero-internal topbar */}
      <div className="dhyan-topbar">
        <a
          className="dhyan-mark"
          href="#top"
          aria-label={`${profile.name} home`}
        >
          {firstName.charAt(0)}
          <span>.</span>
        </a>
        <nav className="dhyan-nav" aria-label="Hero navigation">
          <a href="#projects">Work</a>
          <a href="#profile">About</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="dhyan-status">
          <i /> BUILDING {profile.currentProject.toUpperCase()}
        </span>
      </div>

      {/* The still image remains visible until the supplied video can play. */}
      <div className="dhyan-scene-wrap">
        <div
          className={`dhyan-scene${sceneReady ? " dhyan-scene-ready" : ""}`}
          aria-hidden="true"
        >
          <video
            className="dhyan-scene-video"
            autoPlay={motionAllowed}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/floating-island-poster.png"
            onPlaying={() => setSceneReady(true)}
            onError={() => setSceneReady(false)}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/media/floating-island.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Orbit labels */}
      <div className="dhyan-orbit-label dhyan-orbit-left">
        A PERSONAL WORLD
        <br />
        BUILT WITH CURIOSITY
      </div>
      <div className="dhyan-orbit-label dhyan-orbit-right">
        09° 58&apos; N&nbsp; / &nbsp;76° 16&apos; E
        <br />
        KERALA, INDIA
      </div>

      {/* Main content */}
      <div className="dhyan-hero-content">
        <p className="dhyan-kicker">
          <span>✳</span> CREATIVE DEVELOPER /{" "}
          {profile.role.toUpperCase()} / BUILDER
        </p>
        <h1 className="dhyan-title" aria-label={profile.name}>
          <span className="dhyan-title-mask">
            <span className="dhyan-title-line">
              {firstName.toUpperCase()}
            </span>
          </span>
          <span className="dhyan-title-mask dhyan-title-second">
            <span className="dhyan-title-line">
              {lastName.toUpperCase()}
              <span className="dhyan-title-period">.</span>
            </span>
          </span>
        </h1>
        <p className="dhyan-copy">
          {profile.headline}
        </p>
        <div className="dhyan-actions">
          <a className="dhyan-button dhyan-button-primary" href="#projects">
            EXPLORE MY WORK <span>↗</span>
          </a>
          <a
            className="dhyan-button dhyan-button-quiet"
            href={profile.contact.github}
            target="_blank"
            rel="noreferrer"
          >
            GITHUB <span>↗</span>
          </a>
        </div>
      </div>

      {/* Bottom meta bar */}
      <div className="dhyan-bottom-meta">
        <span className="dhyan-meta">
          SCROLL TO EXPLORE <b>↓</b>
        </span>
        <span className="dhyan-meta dhyan-scene-state">
          {sceneReady ? "A SMALL WORLD IN MOTION" : "A WORLD TAKING SHAPE"}
        </span>
        <span className="dhyan-meta">
          © {new Date().getFullYear()} {profile.name.toUpperCase()}
        </span>
      </div>
    </section>
  );
}
