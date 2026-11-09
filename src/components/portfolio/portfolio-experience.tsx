"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  ExternalLink,
  FileText,
  GitBranch,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MonitorPlay,
  Network,
  Rocket,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  achievements,
  chess,
  contactActions,
  githubConfig,
  profile,
  projects,
  skillGroups,
  timeline,
  type Project,
  type ProjectLink,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import RedesignHero from "@/components/hero/Hero";
import { DuckFamilyNavigation } from "@/components/navigation/DuckFamilyNavigation";
import ProjectsExhibition from "@/components/portfolio/ProjectsExhibition";

const ZENO = projects.find((project) => project.slug === "zeno5-emulator")!;
const HIREVOY = projects.find((project) => project.slug === "hirevoy")!;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

type GitHubUser = {
  login: string;
  name?: string;
  html_url: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description?: string;
  language?: string;
  stargazers_count: number;
};

export function PortfolioExperience() {
  const prefersReducedMotion = useReducedMotion();
  const [bootVisible, setBootVisible] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);
  const [pixelMode, setPixelMode] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const shellRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const konamiRef = useRef<string[]>([]);
  const addUnlock = useCallback((name: string) => {
    setUnlocks((current) => (current.includes(name) ? current : [...current, name]));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = bootRef.current;
    if (!node) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setBootVisible(false),
      });

      timeline
        .fromTo(".boot-line", { scaleX: 0 }, { scaleX: 1, duration: 0.42 })
        .fromTo(
          ".boot-log",
          { opacity: 0, y: 7 },
          { opacity: 1, y: 0, duration: 0.22, stagger: 0.07 },
          "-=0.1",
        )
        .to(node, { opacity: 0, duration: 0.32, delay: 0.22, ease: "power2.inOut" });
    }, node);

    return () => context.revert();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const typing =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement;

      if (!typing && (event.key === "`" || event.key === "~")) {
        event.preventDefault();
        setTerminalOpen((open) => !open);
        addUnlock("Hidden Terminal");
        return;
      }

      if (typing) return;

      const next = [...konamiRef.current, event.key].slice(-konami.length);
      konamiRef.current = next;

      if (konami.every((key, index) => next[index] === key)) {
        setDeveloperMode(true);
        setPixelMode(true);
        setTerminalOpen(true);
        addUnlock("Developer Mode");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addUnlock]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = shellRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--cursor-x", `${x}%`);
    node.style.setProperty("--cursor-y", `${y}%`);
  };

  return (
    <div
      ref={shellRef}
      onPointerMove={handlePointerMove}
      className={cn(
        "portfolio-shell relative min-h-screen overflow-hidden bg-[#06080A] text-[#f0fdf4]",
        developerMode && "developer-mode",
        pixelMode && "pixel-mode",
      )}
    >
      <AnimatePresence>
        {bootVisible && prefersReducedMotion !== true && (
          <BootOverlay refNode={bootRef} />
        )}
      </AnimatePresence>

      <DuckFamilyNavigation
        onTerminal={() => {
          setTerminalOpen(true);
          addUnlock("Hidden Terminal");
        }}
      />

      <main className="relative z-10">
        <RedesignHero bootDone={!bootVisible || prefersReducedMotion === true} />
        <PixelDivider />
        <PlayerProfile unlocks={unlocks} />
        <PixelDivider />
        <FeaturedProjects />
        <PixelDivider />
        <Skills />
        <PixelDivider />
        <InteractiveTimeline />
        <PixelDivider />
        <ZenoSection />
        <PixelDivider />
        <HirevoySection />
        <PixelDivider />
        <ChessSection />
        <PixelDivider />
        <Achievements />
        <PixelDivider />
        <GitHubPanel />
        <PixelDivider />
        <Contact />
      </main>

      <Footer />

      <TerminalConsole
        open={terminalOpen}
        setOpen={setTerminalOpen}
        developerMode={developerMode}
        setDeveloperMode={setDeveloperMode}
        pixelMode={pixelMode}
        setPixelMode={setPixelMode}
        addUnlock={addUnlock}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* BACKGROUND & PARTICLES                                                     */
/* -------------------------------------------------------------------------- */

function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool
    const numParticles = 45;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() < 0.2 ? 3 : 2, // pixel size
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.2 - Math.random() * 0.4,
      opacity: Math.random() * 0.6 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080A] via-[#0B1114] to-[#06080A]" />

      {/* Moving fog radial spots */}
      <div className="animate-fog absolute -top-40 left-1/4 h-[35rem] w-[35rem] rounded-full bg-[#00FF88]/[0.05] blur-[100px]" />
      <div className="animate-fog absolute top-1/2 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#6CFFB2]/[0.04] blur-[120px]" />
      <div className="animate-fog absolute bottom-10 left-1/3 h-[40rem] w-[40rem] rounded-full bg-[#00FF88]/[0.03] blur-[140px]" />

      {/* Cyber grid overlay */}
      <div className="cyber-grid absolute inset-0 opacity-40" />

      {/* Interactive Cursor Light Pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--cursor-x,50%)_var(--cursor-y,30%),rgba(0,255,136,0.08),transparent_24rem)]" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

      {/* Subtle Scanlines overlay */}
      <div className="scanlines absolute inset-0 opacity-30" />
    </div>
  );
}

function PixelDivider() {
  return (
    <div className="portfolio-divider" aria-hidden="true" />
  );
}

function PixelCornerBrackets() {
  return (
    <>
      <span className="absolute -left-1 -top-1 h-1.5 w-1.5 bg-[#00FF88] opacity-60 shadow-[0_0_6px_#00FF88]" />
      <span className="absolute -right-1 -top-1 h-1.5 w-1.5 bg-[#00FF88] opacity-60 shadow-[0_0_6px_#00FF88]" />
      <span className="absolute -bottom-1 -left-1 h-1.5 w-1.5 bg-[#00FF88] opacity-60 shadow-[0_0_6px_#00FF88]" />
      <span className="absolute -bottom-1 -right-1 h-1.5 w-1.5 bg-[#00FF88] opacity-60 shadow-[0_0_6px_#00FF88]" />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* BOOT OVERLAY                                                               */
/* -------------------------------------------------------------------------- */

function BootOverlay({ refNode }: { refNode: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      ref={refNode}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04070a] p-4"
      exit={{ opacity: 0 }}
    >
      <div className="cyber-glass relative w-[min(560px,90vw)] rounded-2xl p-6 sm:p-8">
        <PixelCornerBrackets />
        <div className="mb-5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.28em] text-[#00FF88]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00FF88] animate-pulse" />
            Dhyan_Ajay.OS
          </span>
          <span className="text-[#6CFFB2]/60">v2.0_boot</span>
        </div>
        <div className="h-[2px] w-full origin-left bg-[#00FF88] shadow-[0_0_12px_#00FF88] boot-line" />
        <div className="mt-5 grid gap-2.5 font-mono text-xs text-[#6CFFB2]/80">
          {["mount profile", "sync projects", "prime contact path"].map((line) => (
            <span key={line} className="boot-log flex items-center gap-2 opacity-0">
              <span className="text-[#00FF88]">&gt;</span>
              <span>{line}</span>
              <span className="ml-auto text-[10px] text-[#00FF88]/40">[OK]</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO SECTION                                                               */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <motion.section
      id="top"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden border-b border-[#00FF88]/15 px-4 pb-16 pt-32 sm:px-6 lg:px-8"
    >
      {/* Neo Emerald gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080A] via-[#06080A]/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--cursor-x,50%)_var(--cursor-y,40%),rgba(0,255,136,0.12),transparent_32rem)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <motion.div className="max-w-4xl" variants={sectionVariants}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00FF88]/30 bg-[#00FF88]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.2)]"
          >
            <Sparkles className="size-4 text-[#00FF88]" aria-hidden="true" />
            Creative developer and product builder
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.9, ease: "easeOut" }}
            className="max-w-5xl text-balance text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-7xl lg:text-8xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
            className="mt-6 max-w-3xl text-base leading-8 text-[#f0fdf4]/80 sm:text-lg"
          >
            I&apos;m a {profile.age}-year-old AI and data science student and the founder of Hirevoy. I&apos;m currently building the Zeno5 Emulator while learning reverse engineering and asset extraction. I enjoy turning ideas into working software and learning through hands-on projects.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="#projects">
                View Projects
                <MonitorPlay className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#contact">
                Hire Me
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          className="grid gap-4 justify-self-stretch lg:justify-self-end"
        >
          <HudMetric label="Current Project" value={profile.currentProject} icon={<Cpu />} />
          <HudMetric label="Founder" value={profile.founderOf} icon={<Briefcase />} />
          <HudMetric label="Chess.com Rating" value={profile.chessRating} icon={<Trophy />} />
        </motion.div>
      </div>
    </motion.section>
  );
}

function HudMetric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="cyber-glass group relative overflow-hidden rounded-xl p-4 shadow-2xl"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#00FF88]/60">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-lg border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] [&_svg]:size-5">
          {icon}
        </span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* PLAYER PROFILE                                                             */
/* -------------------------------------------------------------------------- */

function PlayerProfile({ unlocks }: { unlocks: string[] }) {
  const rows = [
    ["Name", profile.name],
    ["Age", `${profile.age}`],
    ["Role", profile.role],
    ["Current Quest", profile.currentQuest],
    ["Current Learning", profile.currentLearning.join(" / ")],
    ["Founder", profile.founderOf],
  ];

  return (
    <MotionSection
      id="profile"
      eyebrow="Player profile"
      title="A little about me."
      copy={profile.shortPitch}
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="cyber-glass relative rounded-2xl p-6">
          <PixelCornerBrackets />
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00FF88]">
                Identity
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">{profile.name}</h3>
            </div>
            <div className="grid size-14 place-items-center rounded-xl border border-[#00FF88]/40 bg-[#00FF88]/10 text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
          </div>
          <div className="grid gap-3">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 rounded-xl border border-[rgba(0,255,136,0.15)] bg-[#0B1114]/80 p-3 sm:grid-cols-[150px_1fr]"
              >
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#00FF88]/60">
                  {label}
                </span>
                <span className="text-sm font-medium text-white/90">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileTile
            icon={<Code2 />}
            title="Developer"
            text="I explore ideas through projects and learn something new with each one."
          />
          <ProfileTile
            icon={<Briefcase />}
            title="Founder"
            text={
              <>
                I built Hirevoy, a hiring app for local guides. Visit{" "}
                <a
                  href="https://hirevoy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00FF88] underline underline-offset-4 hover:text-[#6CFFB2]"
                >
                  Hirevoy
                </a>
              </>
            }
          />
          <ProfileTile
            icon={<Brain />}
            title="Problem Solver"
            text="I stay with a problem until the result meets my standards."
          />
          <ProfileTile
            icon={<Trophy />}
            title="Chess Player"
            text={
              <>
                My Chess.com rating is {profile.chessRating.split(" ")[0]}. Find me{" "}
                <a
                  href="https://www.chess.com/member/dhyan-ajay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00FF88] underline underline-offset-4 hover:text-[#6CFFB2]"
                >
                  on Chess.com as dhyan-ajay
                </a>
                .
              </>
            }
          />
          <div className="cyber-glass relative rounded-2xl p-5 md:col-span-2">
            <PixelCornerBrackets />
            <div className="flex items-center gap-3">
              <Award className="size-5 text-[#00FF88]" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-white">Traits and discoveries</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.personality.map((trait) => (
                <span
                  key={trait}
                  className="rounded-lg border border-[#00FF88]/30 bg-[#00FF88]/10 px-3 py-1.5 font-mono text-xs text-[#00FF88]"
                >
                  {trait}
                </span>
              ))}
              {unlocks.map((unlock) => (
                <span
                  key={unlock}
                  className="rounded-lg border border-[#6CFFB2]/40 bg-[#6CFFB2]/15 px-3 py-1.5 font-mono text-xs font-bold text-[#6CFFB2] shadow-[0_0_10px_rgba(0,255,136,0.2)]"
                >
                  🔓 {unlock}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function ProfileTile({ icon, title, text }: { icon: ReactNode; title: string; text: ReactNode }) {
  return (
    <article className="cyber-glass cyber-glass-hover relative rounded-2xl p-5">
      <span className="grid size-10 place-items-center rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] [&_svg]:size-5">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#f0fdf4]/70">{text}</p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* FEATURED PROJECTS                                                          */
/* -------------------------------------------------------------------------- */

function FeaturedProjects() {
  return <ProjectsExhibition />;
}

/* -------------------------------------------------------------------------- */
/* SKILLS SECTION                                                             */
/* -------------------------------------------------------------------------- */

function Skills() {
  const [active, setActive] = useState(skillGroups[0].label);
  const group = skillGroups.find((item) => item.label === active) ?? skillGroups[0];

  return (
    <MotionSection
      id="skills"
      eyebrow="Skill inventory"
      title="Tools and topics I'm exploring"
      copy="A snapshot of the tools I use and the areas I'm continuing to learn through projects."
    >
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-6 lg:grid-cols-[320px_1fr]"
      >
        <div className="cyber-glass relative grid gap-2 rounded-2xl p-3">
          <PixelCornerBrackets />
          {skillGroups.map((item) => (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "flex min-h-12 items-center justify-between rounded-xl px-4 text-left font-mono text-xs font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]",
                active === item.label
                  ? "border border-[#00FF88] bg-[#00FF88] text-[#06080A] font-bold shadow-[0_0_18px_rgba(0,255,136,0.3)]"
                  : "text-white/70 hover:bg-[#00FF88]/10 hover:text-[#00FF88]",
              )}
            >
              {item.label}
              <ChevronRight className="size-4" aria-hidden="true" />
            </motion.button>
          ))}
        </div>

        <motion.div
          variants={sectionVariants}
          className="cyber-glass relative rounded-2xl p-6"
        >
          <PixelCornerBrackets />
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]">
              <Zap className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FF88]/60">
                Active group
              </p>
              <h3 className="text-2xl font-bold text-white">{group.label}</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-[rgba(0,255,136,0.18)] bg-[#0B1114]/80 p-4 transition-colors hover:border-[#00FF88]/50"
              >
                <CheckCircle2 className="size-5 shrink-0 text-[#00FF88]" aria-hidden="true" />
                <span className="text-sm font-medium text-white/90">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </MotionSection>
  );
}

/* -------------------------------------------------------------------------- */
/* INTERACTIVE TIMELINE                                                       */
/* -------------------------------------------------------------------------- */

function InteractiveTimeline() {
  const [active, setActive] = useState(0);
  const selected = timeline[active];

  return (
    <MotionSection
      id="timeline"
      eyebrow="Timeline"
      title="Milestones, projects, and awards"
      copy="A few milestones from my studies, projects, and competitions."
      className="bg-[#0B1114]/60"
    >
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="grid gap-3">
          {timeline.map((item, index) => (
            <motion.button
              key={`${item.year}-${item.title}`}
              type="button"
              onClick={() => setActive(index)}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "cyber-glass relative grid gap-1.5 rounded-2xl p-4 text-left transition hover:border-[#00FF88]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]",
                active === index && "border-[#00FF88] bg-[#00FF88]/10 shadow-[0_0_20px_rgba(0,255,136,0.2)]",
              )}
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FF88]">
                {item.year} / {item.type}
              </span>
              <span className="text-base font-semibold text-white">{item.title}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="cyber-glass relative overflow-hidden rounded-2xl p-6 sm:p-8"
        >
          <PixelCornerBrackets />
          <div className="absolute right-0 top-0 h-full w-1 bg-[#00FF88] shadow-[0_0_12px_#00FF88]" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FF88]/60">
            Selected node
          </p>
          <h3 className="mt-3 text-3xl font-black text-white">{selected.title}</h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#f0fdf4]/80">{selected.detail}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Focus", value: selected.type },
              { label: "Period", value: selected.year },
              { label: "Detail", value: selected.detail },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
                className="rounded-xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#00FF88]/60">
                  {item.label}
                </p>
                <p className="mt-2 text-xs leading-6 text-white/80">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </MotionSection>
  );
}

/* -------------------------------------------------------------------------- */
/* FLAGSHIP PROJECT SECTIONS                                                  */
/* -------------------------------------------------------------------------- */

function ZenoSection() {
  return (
    <ProjectFeatureSection
      id="zeno5"
      project={ZENO}
      icon={<Cpu />}
      title="Zeno5 is my biggest project so far."
      copy="I'm developing the emulator while exploring systems research, asset pipelines, and reverse engineering."
    />
  );
}

function HirevoySection() {
  return (
    <ProjectFeatureSection
      id="hirevoy"
      project={HIREVOY}
      icon={<Network />}
      title="Hirevoy is my first startup project."
      copy="I started Hirevoy while learning web development, including Vite.js."
      flip
    />
  );
}

function ProjectFeatureSection({
  id,
  project,
  icon,
  title,
  copy,
  flip,
}: {
  id: string;
  project: Project;
  icon: ReactNode;
  title: string;
  copy: string;
  flip?: boolean;
}) {
  return (
    <MotionSection id={id} eyebrow={project.eyebrow} title={title} copy={copy}>
      <div className={cn("grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center", flip && "lg:grid-cols-[0.95fr_1.05fr]")}>
        <div className={cn("cyber-glass relative overflow-hidden rounded-2xl", flip && "lg:order-2")}>
          <PixelCornerBrackets />
          <div className="relative aspect-[16/9]">
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} showcase`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#06080A] via-[#0B1114] to-[#00FF88]/10 text-white/80 px-8 text-center">
                <FileText className="size-14 text-[#00FF88]" />
                <p className="max-w-lg text-xs leading-6 text-[#f0fdf4]/70 font-mono">
                  No project image is available yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="cyber-glass relative rounded-2xl p-6 sm:p-8">
          <PixelCornerBrackets />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00FF88]">
                {project.status}
              </p>
              <h3 className="mt-2 text-3xl font-black text-white">{project.title}</h3>
            </div>
            <span className="grid size-12 place-items-center rounded-xl border border-[#00FF88]/40 bg-[#00FF88]/10 text-[#00FF88] [&_svg]:size-6 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
              {icon}
            </span>
          </div>
          <p className="mt-4 text-base leading-8 text-[#f0fdf4]/80">{project.impact}</p>
          <div className="mt-6 grid gap-3">
            {project.solutions.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#00FF88]" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/80">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild variant="secondary">
              <Link href={`/projects/${project.slug}`}>
                Open Case Study
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            {project.links.map((link) => (
              <ActionLink key={link.label} link={link} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <FeatureList title="Challenges" items={project.challenges} icon={<ScrollText />} />
        <FeatureList title="Development timeline" items={project.timeline} icon={<Rocket />} />
        <FeatureList title="Future Plans" items={project.future} icon={<BookOpen />} />
      </div>
    </MotionSection>
  );
}

function FeatureList({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <div className="cyber-glass relative rounded-2xl p-5">
      <PixelCornerBrackets />
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] [&_svg]:size-5">
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="border-l-2 border-[#00FF88]/50 pl-3 text-sm leading-6 text-[#f0fdf4]/70">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHESS SECTION                                                              */
/* -------------------------------------------------------------------------- */

function ChessSection() {
  return (
    <MotionSection
      id="chess"
      eyebrow="Chess"
      title="Chess has shaped how I approach difficult problems."
      copy="Playing chess has helped me practice patience, pattern recognition, and decision-making when the next move isn't obvious."
      className="bg-[#0B1114]/60"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="cyber-glass relative rounded-2xl p-5">
          <PixelCornerBrackets />
          <div className="mx-auto grid aspect-square max-w-[300px] grid-cols-8 overflow-hidden rounded-xl border border-[#00FF88]/30 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
            {Array.from({ length: 64 }).map((_, index) => {
              const row = Math.floor(index / 8);
              const col = index % 8;
              const dark = (row + col) % 2 === 1;
              const piece = getDisplayPiece(index);

              return (
                <div
                  key={index}
                  className={cn(
                    "grid place-items-center text-xl sm:text-2xl font-bold font-mono",
                    dark ? "bg-[#0b1b14] text-[#00FF88]" : "bg-[#183327] text-[#6CFFB2]",
                  )}
                  aria-hidden="true"
                >
                  {piece}
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <HudMetric label="Rating" value={chess.rating} icon={<Trophy />} />
            <HudMetric label="Platform" value={chess.platform} icon={<GraduationCap />} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {chess.lessons.map((lesson) => (
            <div key={lesson} className="cyber-glass relative rounded-2xl p-5">
              <Brain className="size-6 text-[#00FF88]" aria-hidden="true" />
              <p className="mt-4 text-base leading-7 text-[#f0fdf4]/80">{lesson}</p>
            </div>
          ))}
          <div className="cyber-glass relative rounded-2xl border-[#00FF88]/40 bg-[#00FF88]/5 p-5 md:col-span-2">
            <PixelCornerBrackets />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#00FF88]">
              Opening prep
            </p>
            <p className="mt-3 text-sm leading-6 text-[#f0fdf4]/80">
              {chess.openings.length
                ? chess.openings.join(" / ")
                : "Private for now. The public signal is the rating, the discipline, and the way chess thinking informs debugging."}
            </p>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function getDisplayPiece(index: number) {
  const pieces: Record<number, string> = {
    4: "♚",
    12: "♟",
    19: "♞",
    28: "♛",
    35: "♝",
    44: "♘",
    52: "♙",
    60: "♔",
  };

  return pieces[index] ?? "";
}

/* -------------------------------------------------------------------------- */
/* ACHIEVEMENTS                                                               */
/* -------------------------------------------------------------------------- */

function Achievements() {
  return (
    <MotionSection
      id="achievements"
      eyebrow="Achievements"
      title="Awards and achievements"
      copy="A record of the awards and milestones included in my portfolio."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((achievement, index) => (
          <motion.article
            key={achievement.title}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.28 }}
            transition={{ delay: index * 0.06 }}
            className="cyber-glass cyber-glass-hover relative rounded-2xl p-6"
          >
            <PixelCornerBrackets />
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-12 place-items-center rounded-xl border border-[#00FF88]/40 bg-[#00FF88]/15 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.25)]">
                <Trophy className="size-6" aria-hidden="true" />
              </span>
              <span className="rounded-lg border border-[#00FF88]/30 bg-[#00FF88]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#00FF88]">
                {achievement.rarity}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">{achievement.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#f0fdf4]/70">{achievement.context}</p>
            <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#00FF88]">
              {achievement.year}
            </p>
          </motion.article>
        ))}
      </div>
    </MotionSection>
  );
}

/* -------------------------------------------------------------------------- */
/* GITHUB PANEL                                                               */
/* -------------------------------------------------------------------------- */

function GitHubPanel() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const username = githubConfig.username.trim();

  useEffect(() => {
    if (!username) return;

    const controller = new AbortController();

    async function loadGitHub() {
      setStatus("loading");
      try {
        const [userResponse, repoResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            signal: controller.signal,
          }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`, {
            signal: controller.signal,
          }),
        ]);

        if (!userResponse.ok || !repoResponse.ok) {
          throw new Error("GitHub request failed");
        }

        setUser((await userResponse.json()) as GitHubUser);
        setRepos((await repoResponse.json()) as GitHubRepo[]);
        setStatus("idle");
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    }

    loadGitHub();

    return () => controller.abort();
  }, [username]);

  return (
    <MotionSection
      id="github"
      eyebrow="GitHub"
      title="My work on GitHub"
      copy="Browse my public profile and recent repositories."
      className="bg-[#0B1114]/60"
    >
      <div className="cyber-glass relative rounded-2xl p-6 sm:p-8">
        <PixelCornerBrackets />
        {!username ? (
          <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-center">
            <div className="grid aspect-square max-w-[260px] place-items-center rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80">
              <GitBranch className="size-16 text-[#00FF88]/50" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">GitHub profile unavailable.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#f0fdf4]/70">
                The GitHub profile could not be loaded. You can still visit the repositories linked
                in the project case studies.
              </p>
            </div>
          </div>
        ) : status === "loading" ? (
          <div className="grid gap-3 font-mono text-xs text-[#00FF88]">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-[#00FF88]/20" />
            <div className="h-24 animate-pulse rounded-lg bg-[#00FF88]/10" />
          </div>
        ) : status === "error" ? (
          <div className="flex items-center gap-3 text-emerald-300 font-mono text-sm">
            <X className="size-5" aria-hidden="true" />
            GitHub data could not be loaded.
          </div>
        ) : user ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-4">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-[#00FF88]/30">
                <Image
                  src={user.avatar_url}
                  alt={`${user.login} GitHub avatar`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">{user.name || user.login}</h3>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-[#00FF88] hover:underline"
              >
                @{user.login}
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStat label="Repos" value={user.public_repos} />
                <MiniStat label="Followers" value={user.followers} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="cyber-glass cyber-glass-hover rounded-xl p-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-white">{repo.name}</h4>
                    <ArrowUpRight className="size-4 shrink-0 text-[#00FF88]" aria-hidden="true" />
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#f0fdf4]/70">
                    {repo.description || "Public repository"}
                  </p>
                  <div className="mt-4 flex items-center gap-3 font-mono text-xs text-[#00FF88]">
                    {repo.language && <span>{repo.language}</span>}
                    <span>★ {repo.stargazers_count}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </MotionSection>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[rgba(0,255,136,0.18)] bg-[#0B1114] p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#00FF88]/60">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTACT                                                                    */
/* -------------------------------------------------------------------------- */

function Contact() {
  const primaryActions = contactActions.filter(
    (action) => action.label === "Email" || action.label === "Resume",
  );
  const otherActions = contactActions.filter(
    (action) => action.label !== "Email" && action.label !== "Resume",
  );

  return (
    <MotionSection
      id="contact"
      eyebrow="Contact"
      title="Have a project, internship opportunity, or idea to discuss?"
      copy="If you'd like to work together or ask about a project, get in touch."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="cyber-glass relative rounded-2xl p-6 sm:p-8">
          <PixelCornerBrackets />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00FF88]">
            Say hello
          </p>
          <h3 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Have a challenging interface or an early idea? I&apos;d be glad to hear about it.
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#f0fdf4]/80">
            I&apos;m open to freelance web projects, internship conversations, and thoughtful
            collaborations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {primaryActions.map((action) => (
              <ContactButton
                key={action.label}
                action={action}
                icon={action.label === "Email" ? <Mail /> : <FileText />}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          {otherActions.map((action) => (
            <ContactButton
              key={action.label}
              action={action}
              icon={
                action.label === "GitHub" ? (
                  <GitBranch />
                ) : action.label === "LinkedIn" ? (
                  <LinkIcon />
                ) : (
                  <Trophy />
                )
              }
              wide
            />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

function ContactButton({
  action,
  icon,
  wide,
}: {
  action: { label: string; href?: string; value: string };
  icon: ReactNode;
  wide?: boolean;
}) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-semibold text-white">{action.label}</span>
        <span className="mt-0.5 block truncate font-mono text-xs text-[#00FF88]/70">{action.value}</span>
      </span>
      {action.href && <ArrowUpRight className="ml-auto size-4 shrink-0 text-[#00FF88]" aria-hidden="true" />}
    </>
  );

  if (!action.href) {
    return (
      <motion.button
        type="button"
        disabled
        aria-disabled="true"
        title={action.value}
        whileHover={{ scale: 1.01 }}
        className={cn(
          "cyber-glass flex min-h-18 items-center gap-4 rounded-2xl px-5 py-4 text-left opacity-60",
          wide && "w-full",
        )}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={action.href}
      target={action.href.startsWith("http") ? "_blank" : undefined}
      rel={action.href.startsWith("http") ? "noreferrer" : undefined}
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "cyber-glass cyber-glass-hover flex min-h-18 items-center gap-4 rounded-2xl px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF88]",
        wide && "w-full",
      )}
    >
      {content}
    </motion.a>
  );
}

/* -------------------------------------------------------------------------- */
/* FOOTER & HELPERS                                                           */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[rgba(0,255,136,0.18)] bg-[#04070a]/90 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-mono text-[#f0fdf4]/50 sm:flex-row sm:items-center sm:justify-between">
        <p>Dhyan Ajay: an interactive portfolio.</p>
        <p className="uppercase tracking-[0.16em] text-[#00FF88]/70">
          MADE WITH CARE BY DHYAN AJAY
        </p>
      </div>
    </footer>
  );
}

function MotionSection({
  id,
  eyebrow,
  title,
  copy,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className={cn("relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={eyebrow} title={title} copy={copy} />
        {children}
      </div>
    </motion.section>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FF88]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-black leading-tight text-white sm:text-5xl xl:text-6xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-[#f0fdf4]/75 sm:text-lg">
        {copy}
      </p>
    </div>
  );
}

function ActionLink({ link }: { link: ProjectLink }) {
  if (!link.href) {
    return (
      <Button type="button" variant="ghost" size="sm" disabled title={link.disabledReason}>
        {link.label}
      </Button>
    );
  }

  const external = link.href.startsWith("http");
  const content = (
    <>
      {link.label}
      {external ? (
        <ExternalLink className="size-4" aria-hidden="true" />
      ) : (
        <ChevronRight className="size-4" aria-hidden="true" />
      )}
    </>
  );

  return external ? (
    <Button asChild variant="ghost" size="sm">
      <a href={link.href} target="_blank" rel="noreferrer">
        {content}
      </a>
    </Button>
  ) : (
    <Button asChild variant="ghost" size="sm">
      <Link href={link.href}>{content}</Link>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* TERMINAL CONSOLE                                                           */
/* -------------------------------------------------------------------------- */

function TerminalConsole({
  open,
  setOpen,
  developerMode,
  setDeveloperMode,
  pixelMode,
  setPixelMode,
  addUnlock,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  developerMode: boolean;
  setDeveloperMode: (enabled: boolean) => void;
  pixelMode: boolean;
  setPixelMode: (enabled: boolean) => void;
  addUnlock: (name: string) => void;
}) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([
    "dhyan-cli v2.0 ready. Type help for commands.",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const commands = useMemo(
    () => ({
      help: "commands: whoami, quest, chess, zeno, hire, projects, pixel, dev, clear",
      whoami: `${profile.name} / ${profile.role} / founder of ${profile.founderOf}`,
      quest: profile.currentQuest,
      chess: `${profile.chessRating} on ${profile.chessPlatform}. Calculation is debugging in another language.`,
      zeno: "Opening Zeno5...",
      hire: "Opening contact...",
      projects: "Opening projects...",
      pixel: `Pixel mode ${pixelMode ? "disabled" : "enabled"}.`,
      dev: `Developer mode ${developerMode ? "disabled" : "enabled"}.`,
    }),
    [developerMode, pixelMode],
  );

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    if (command === "zeno") {
      document.querySelector("#zeno5")?.scrollIntoView({ behavior: "smooth" });
    }

    if (command === "hire") {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }

    if (command === "projects") {
      document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
    }

    if (command === "pixel") {
      setPixelMode(!pixelMode);
      addUnlock("Pixel Mode");
    }

    if (command === "dev") {
      setDeveloperMode(!developerMode);
      addUnlock("Developer Mode");
    }

    const output = commands[command as keyof typeof commands] ?? `Unknown command: ${command}`;
    setLines((current) => [...current.slice(-7), `> ${command}`, output]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 p-4 backdrop-blur-md sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Developer console"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="cyber-glass relative w-full max-w-2xl overflow-hidden rounded-2xl border-[#00FF88]/40 shadow-[0_24px_90px_rgba(0,0,0,0.8)]"
          >
            <PixelCornerBrackets />
            <div className="flex items-center justify-between border-b border-[#00FF88]/20 bg-[#06080A]/80 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#00FF88]">
                <Terminal className="size-4" aria-hidden="true" />
                Console :: Dhyan_OS
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-white/60 transition hover:bg-[#00FF88]/10 hover:text-[#00FF88]"
                aria-label="Close console"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[46vh] min-h-56 overflow-y-auto bg-[#04070a]/95 p-4 font-mono text-xs leading-7 text-[#00FF88]">
              {lines.map((line, index) => (
                <p key={`${line}-${index}`} className="text-emerald-300">{line}</p>
              ))}
            </div>
            <form onSubmit={runCommand} className="flex border-t border-[#00FF88]/20 bg-[#06080A]">
              <label className="sr-only" htmlFor="terminal-input">
                Terminal command
              </label>
              <span className="px-4 py-3 font-mono text-sm text-[#00FF88]">&gt;</span>
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-12 flex-1 bg-transparent py-3 pr-4 font-mono text-sm text-[#6CFFB2] outline-none placeholder:text-[#00FF88]/30"
                placeholder="help"
                autoComplete="off"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
