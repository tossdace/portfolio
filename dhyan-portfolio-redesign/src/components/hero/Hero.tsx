"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="dhyan-scene dhyan-scene-loading" aria-hidden="true" />,
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".dhyan-kicker", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.25, ease: "power3.out" });
      gsap.fromTo(".dhyan-title-line", { yPercent: 115, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.12, delay: 0.35, ease: "power4.out" });
      gsap.fromTo(".dhyan-copy, .dhyan-actions, .dhyan-meta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, delay: 0.85, ease: "power3.out" });
      gsap.fromTo(".dhyan-scene-wrap", { opacity: 0, scale: 0.9, y: 35 }, { opacity: 1, scale: 1, y: 0, duration: 1.6, delay: 0.2, ease: "power3.out", onComplete: () => setSceneReady(true) });
    }, root);
    return () => ctx.revert();
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  function onPointerLeave() {
    pointer.current.x = 0;
    pointer.current.y = 0;
  }

  return (
    <section ref={root} className="dhyan-hero" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="dhyan-grain" />
      <div className="dhyan-vignette" />
      <div className="dhyan-topbar">
        <a className="dhyan-mark" href="#home" aria-label="Dhyan home">D<span>.</span></a>
        <nav className="dhyan-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experiments">Experiments</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="dhyan-status"><i /> AVAILABLE FOR SELECT PROJECTS</span>
      </div>

      <div className="dhyan-scene-wrap">
        <HeroScene pointer={pointer} />
      </div>

      <div className="dhyan-orbit-label dhyan-orbit-left">AN INDEPENDENT DIGITAL WORLD<br />BUILT WITH CURIOSITY</div>
      <div className="dhyan-orbit-label dhyan-orbit-right">09° 58' N&nbsp; / &nbsp;76° 16' E<br />KERALA, INDIA</div>

      <div className="dhyan-hero-content">
        <p className="dhyan-kicker"><span>✳</span> CREATIVE DEVELOPER / COMPUTER SCIENCE</p>
        <h1 className="dhyan-title" aria-label="Dhyan Ajay">
          <span className="dhyan-title-mask"><span className="dhyan-title-line">DHYAN</span></span>
          <span className="dhyan-title-mask dhyan-title-second"><span className="dhyan-title-line">AJAY<span className="dhyan-title-period">.</span></span></span>
        </h1>
        <p className="dhyan-copy">I build curious things at the intersection of code, design<br className="desktop-break" /> and imagination. Welcome to my little corner of the internet.</p>
        <div className="dhyan-actions">
          <a className="dhyan-button dhyan-button-primary" href="#work">EXPLORE MY WORK <span>↗</span></a>
          <a className="dhyan-button dhyan-button-quiet" href="https://github.com/tossdace" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a>
        </div>
      </div>

      <div className="dhyan-bottom-meta">
        <span className="dhyan-meta">SCROLL TO EXPLORE <b>↓</b></span>
        <span className="dhyan-meta dhyan-scene-state">{sceneReady ? "A SMALL WORLD, IN REAL TIME" : "ENTERING THE SCENE…"}</span>
        <span className="dhyan-meta">© 2026 DHYAN AJAY</span>
      </div>
    </section>
  );
}
