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
  Menu,
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
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  achievements,
  chess,
  contactActions,
  githubConfig,
  navigation,
  profile,
  projects,
  skillGroups,
  timeline,
  type Project,
  type ProjectLink,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";

const ZENO = projects.find((project) => project.slug === "zeno5-emulator")!;
const HIREVOY = projects.find((project) => project.slug === "hirevoy")!;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const cardHoverVariants: Variants = {
  hover: { y: -8, scale: 1.01, transition: { duration: 0.25, ease: "easeOut" } },
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [pixelMode, setPixelMode] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [unlocks, setUnlocks] = useState<string[]>([]);
  const shellRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const konamiRef = useRef<string[]>([]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setBootVisible(false);
      return;
    }

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
  }, []);

  const addUnlock = (name: string) => {
    setUnlocks((current) => (current.includes(name) ? current : [...current, name]));
  };

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
        "portfolio-shell min-h-screen overflow-hidden bg-[#05070b] text-white",
        developerMode && "developer-mode",
        pixelMode && "pixel-mode",
      )}
    >
      <AnimatePresence>{bootVisible && <BootOverlay refNode={bootRef} />}</AnimatePresence>

      <SiteNav
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onTerminal={() => {
          setTerminalOpen(true);
          addUnlock("Hidden Terminal");
        }}
      />

      <main>
        <Hero />
        <PlayerProfile unlocks={unlocks} />
        <FeaturedProjects />
        <Skills />
        <InteractiveTimeline />
        <ZenoSection />
        <HirevoySection />
        <ChessSection />
        <Achievements />
        <GitHubPanel />
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

function BootOverlay({ refNode }: { refNode: React.RefObject<HTMLDivElement | null> }) {
  return (
    <motion.div
      ref={refNode}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030508]"
      exit={{ opacity: 0 }}
    >
      <div className="w-[min(560px,86vw)]">
        <div className="mb-5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/80">
          <span>Dhyan_Ajay.OS</span>
          <span>boot</span>
        </div>
        <div className="h-px origin-left bg-cyan-200 boot-line" />
        <div className="mt-5 grid gap-2 font-mono text-xs text-white/70">
          {["mount profile", "sync projects", "prime contact path"].map((line) => (
            <span key={line} className="boot-log opacity-0">
              &gt; {line}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SiteNav({
  mobileOpen,
  setMobileOpen,
  onTerminal,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onTerminal: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05070b]/78 backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#top"
          className="group inline-flex items-center gap-3 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          aria-label="Dhyan Ajay home"
        >
          <span className="grid size-8 place-items-center rounded-md border border-cyan-200/30 bg-cyan-200/10 font-mono text-xs text-cyan-100">
            DA
          </span>
          <span className="hidden sm:block">Dhyan Ajay</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-white/68 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onTerminal}
            aria-label="Open terminal"
            title="Open terminal"
            className="hidden sm:inline-flex"
          >
            <Terminal className="size-4" aria-hidden="true" />
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="#contact">
              Hire Me
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            className="lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-[#05070b]/96 px-4 py-3 lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-3 text-sm text-white/78 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onTerminal();
                }}
                className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-sm text-white/78 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <Terminal className="size-4" aria-hidden="true" />
                Console
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <motion.section
      id="top"
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden border-b border-white/10 px-4 pb-16 pt-28 sm:px-6 lg:px-8"
    >
      <Image
        src="/assets/hero-command-deck.png"
        alt="Dark futuristic command deck with code panels and a chess board"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_var(--cursor-x,55%)_var(--cursor-y,40%),rgba(56,189,248,0.18),transparent_28rem),linear-gradient(90deg,rgba(4,7,14,0.96),rgba(4,7,14,0.70)_38%,rgba(4,7,14,0.30))]"
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04070e] to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <motion.div className="max-w-4xl" variants={sectionVariants}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-100"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Available for selected freelance builds
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
            className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg"
          >
            {profile.headline}
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
      className="group relative overflow-hidden rounded-lg border border-white/12 bg-[#0b1118]/72 p-4 shadow-2xl shadow-black/30 backdrop-blur-md"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-cyan-200/70" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md border border-cyan-200/20 bg-cyan-200/8 text-cyan-100 [&_svg]:size-5">
          {icon}
        </span>
      </div>
    </motion.div>
  );
}

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
      title="A builder profile recruiters can scan and clients can trust."
      copy={profile.shortPitch}
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-white/12 bg-white/[0.045] p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                Identity
              </p>
              <h3 className="mt-2 text-2xl font-bold">{profile.name}</h3>
            </div>
            <div className="grid size-14 place-items-center rounded-lg border border-amber-200/30 bg-amber-200/10 text-amber-100">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </div>
          </div>
          <div className="grid gap-3">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 rounded-md border border-white/8 bg-[#070c12]/72 p-3 sm:grid-cols-[150px_1fr]"
              >
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/42">
                  {label}
                </span>
                <span className="text-sm font-medium text-white/84">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileTile
            icon={<Code2 />}
            title="Developer"
            text="Frontend craft, product logic, accessibility, and performance-minded implementation."
          />
          <ProfileTile
            icon={<Briefcase />}
            title="Founder"
            text="Hirevoy gives the portfolio a product lens: problem, audience, roadmap, and execution."
          />
          <ProfileTile
            icon={<Brain />}
            title="Problem Solver"
            text="The strongest through-line is not one stack. It is the habit of turning unclear problems into workable systems."
          />
          <ProfileTile
            icon={<Trophy />}
            title="Chess Player"
            text={`${profile.chessRating} on ${profile.chessPlatform}. Pattern recognition, calculation, and blunder checks transfer directly into code.`}
          />
          <div className="rounded-lg border border-white/12 bg-[#070c12]/74 p-5 md:col-span-2">
            <div className="flex items-center gap-3">
              <Award className="size-5 text-amber-200" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Unlocked Signals</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.personality.map((trait) => (
                <span
                  key={trait}
                  className="rounded-md border border-cyan-200/18 bg-cyan-200/8 px-3 py-2 text-sm text-cyan-50"
                >
                  {trait}
                </span>
              ))}
              {unlocks.map((unlock) => (
                <span
                  key={unlock}
                  className="rounded-md border border-amber-200/28 bg-amber-200/10 px-3 py-2 text-sm text-amber-50"
                >
                  {unlock}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function ProfileTile({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-white/12 bg-white/[0.045] p-5 transition hover:border-cyan-200/28 hover:bg-white/[0.07]">
      <span className="grid size-10 place-items-center rounded-md border border-cyan-200/22 bg-cyan-200/8 text-cyan-100 [&_svg]:size-5">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/64">{text}</p>
    </article>
  );
}

function FeaturedProjects() {
  return (
    <MotionSection
      id="projects"
      eyebrow="Featured projects"
      title="The work is presented as case studies, not thumbnails."
      copy="Every project card makes a hiring argument: what problem it represents, what was hard, what changed, and what is next."
      className="bg-[#070a10]"
    >
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </motion.div>
    </MotionSection>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      whileHover="hover"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#0a1017] shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-cyan-200/35 hover:shadow-[0_30px_120px_rgba(0,0,0,0.28)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
        <Image
          src={project.image}
          alt={`${project.title} visual`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-[700ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1017] via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#000a12]/75 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-md">
          {project.status}
        </div>
      </div>
      <div className="p-6 sm:p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-100/70">
          {project.eyebrow}
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">{project.title}</h3>
        <p className="mt-4 text-sm leading-7 text-white/70">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/65"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Challenge</p>
          <p className="mt-3 text-sm leading-7 text-white/70">{project.challenges[0]}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/projects/${project.slug}`}>
              Case Study
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          {project.links.map((link) => (
            <ActionLink key={link.label} link={link} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function Skills() {
  const [active, setActive] = useState(skillGroups[0].label);
  const group = skillGroups.find((item) => item.label === active) ?? skillGroups[0];

  return (
    <MotionSection
      id="skills"
      eyebrow="Skill inventory"
      title="No fake percentages. Just the tool clusters that support the current mission."
      copy="The stack is organized by how Dhyan builds: interface craft, product logic, systems curiosity, and learning velocity."
    >
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 lg:grid-cols-[340px_1fr]"
      >
        <div className="grid gap-2 rounded-lg border border-white/12 bg-white/[0.045] p-2">
          {skillGroups.map((item) => (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "flex min-h-12 items-center justify-between rounded-md px-4 text-left text-sm font-semibold text-white/66 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                active === item.label && "bg-cyan-200 text-[#031015]",
              )}
            >
              {item.label}
              <ChevronRight className="size-4" aria-hidden="true" />
            </motion.button>
          ))}
        </div>

        <motion.div
          variants={sectionVariants}
          className="rounded-lg border border-white/12 bg-[#070c12] p-5"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-md border border-cyan-200/22 bg-cyan-200/8 text-cyan-100">
              <Zap className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/42">
                Active group
              </p>
              <h3 className="text-2xl font-bold">{group.label}</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex min-h-16 items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-4"
              >
                <CheckCircle2 className="size-5 shrink-0 text-emerald-200" aria-hidden="true" />
                <span className="text-sm font-medium text-white/78">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </MotionSection>
  );
}

function InteractiveTimeline() {
  const [active, setActive] = useState(0);
  const selected = timeline[active];

  return (
    <MotionSection
      id="timeline"
      eyebrow="Timeline"
      title="Milestones that explain momentum."
      copy="Awards, founder work, and current technical focus are organized as a career path, not a loose list."
      className="bg-[#070a10]"
    >
      <motion.div
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]"
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
                "grid gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-200/24 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                active === index && "border-cyan-200/45 bg-cyan-200/9",
              )}
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-100/65">
                {item.year} / {item.type}
              </span>
              <span className="text-lg font-semibold text-white">{item.title}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-lg border border-white/12 bg-[#0a1017] p-6"
        >
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-cyan-200/60 via-amber-200/40 to-red-300/40" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/42">
            Selected node
          </p>
          <h3 className="mt-3 text-3xl font-black">{selected.title}</h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/68">{selected.detail}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Focus", value: selected.type },
              { label: "Period", value: selected.year },
              { label: "Detail", value: selected.detail },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </MotionSection>
  );
}

function ZenoSection() {
  return (
    <ProjectFeatureSection
      id="zeno5"
      project={ZENO}
      icon={<Cpu />}
      title="Zeno5 gets the flagship treatment."
      copy="The page borrows the clarity of a premium game product page: hero art, status, architecture notes, devlogs, roadmap, and future gallery slots."
      accent="cyan"
    />
  );
}

function HirevoySection() {
  return (
    <ProjectFeatureSection
      id="hirevoy"
      project={HIREVOY}
      icon={<Network />}
      title="Hirevoy is framed as a founder journey."
      copy="The startup page is designed around problem clarity, mission, vision, current progress, and roadmap instead of vague founder hype."
      accent="amber"
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
  accent,
  flip,
}: {
  id: string;
  project: Project;
  icon: ReactNode;
  title: string;
  copy: string;
  accent: "cyan" | "amber";
  flip?: boolean;
}) {
  const accentClass =
    accent === "cyan"
      ? "border-cyan-200/28 bg-cyan-200/8 text-cyan-100"
      : "border-amber-200/28 bg-amber-200/8 text-amber-100";

  return (
    <MotionSection id={id} eyebrow={project.eyebrow} title={title} copy={copy}>
      <div className={cn("grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center", flip && "lg:grid-cols-[0.95fr_1.05fr]")}>
        <div className={cn("relative overflow-hidden rounded-lg border border-white/12 bg-[#0a1017]", flip && "lg:order-2")}>
          <div className="relative aspect-[16/9]">
            <Image
              src={project.image}
              alt={`${project.title} showcase`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="rounded-lg border border-white/12 bg-white/[0.045] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/44">
                {project.status}
              </p>
              <h3 className="mt-2 text-3xl font-black">{project.title}</h3>
            </div>
            <span className={cn("grid size-12 place-items-center rounded-md border [&_svg]:size-6", accentClass)}>
              {icon}
            </span>
          </div>
          <p className="mt-4 text-base leading-8 text-white/68">{project.impact}</p>
          <div className="mt-6 grid gap-3">
            {project.solutions.map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-[#070c12]/78 p-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-200" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/70">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
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
        <FeatureList title="Dev Timeline" items={project.timeline} icon={<Rocket />} />
        <FeatureList title="Future Plans" items={project.future} icon={<BookOpen />} />
      </div>
    </MotionSection>
  );
}

function FeatureList({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/12 bg-[#070c12] p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md border border-white/12 bg-white/[0.045] text-cyan-100 [&_svg]:size-5">
          {icon}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="border-l border-cyan-200/30 pl-3 text-sm leading-6 text-white/64">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ChessSection() {
  return (
    <MotionSection
      id="chess"
      eyebrow="Chess"
      title={`${chess.rating} rated calculation, translated into programming discipline.`}
      copy="Chess is not a decorative hobby here. It is proof of patience, pattern recognition, and disciplined decision-making under uncertainty."
      className="bg-[#070a10]"
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-white/12 bg-[#0a1017] p-5">
          <div className="mx-auto grid aspect-square max-w-[300px] grid-cols-8 overflow-hidden rounded-md border border-white/12">
            {Array.from({ length: 64 }).map((_, index) => {
              const row = Math.floor(index / 8);
              const col = index % 8;
              const dark = (row + col) % 2 === 1;
              const piece = getDisplayPiece(index);

              return (
                <div
                  key={index}
                  className={cn(
                    "grid place-items-center text-2xl sm:text-3xl",
                    dark ? "bg-[#172328]" : "bg-[#d8e4d9]",
                    piece && "text-[#05070b]",
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
            <div key={lesson} className="rounded-lg border border-white/12 bg-white/[0.045] p-5">
              <Brain className="size-6 text-amber-100" aria-hidden="true" />
              <p className="mt-4 text-base leading-7 text-white/74">{lesson}</p>
            </div>
          ))}
          <div className="rounded-lg border border-amber-200/20 bg-amber-200/8 p-5 md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-100/70">
              Opening prep
            </p>
            <p className="mt-3 text-sm leading-6 text-white/68">
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
    4: "k",
    12: "p",
    19: "n",
    28: "q",
    35: "B",
    44: "N",
    52: "P",
    60: "K",
  };

  return pieces[index] ?? "";
}

function Achievements() {
  return (
    <MotionSection
      id="achievements"
      eyebrow="Achievements"
      title="Achievement cards that say what was earned."
      copy="The unlock style fits the game-inspired direction, while the claims stay concrete and verifiable."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((achievement, index) => (
          <motion.article
            key={achievement.title}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.28 }}
            transition={{ delay: index * 0.06 }}
            className="achievement-card group rounded-lg border border-white/12 bg-[#0a1017] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-11 place-items-center rounded-md border border-amber-200/28 bg-amber-200/10 text-amber-100">
                <Trophy className="size-5" aria-hidden="true" />
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/48">
                {achievement.rarity}
              </span>
            </div>
            <h3 className="mt-6 text-xl font-bold">{achievement.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{achievement.context}</p>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-cyan-100/58">
              {achievement.year}
            </p>
          </motion.article>
        ))}
      </div>
    </MotionSection>
  );
}

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
      title="Dynamic repository signal, ready for the real account."
      copy="Once the GitHub username is set, this section pulls public profile and recent repository data directly from GitHub."
      className="bg-[#070a10]"
    >
      <div className="rounded-lg border border-white/12 bg-[#0a1017] p-5 sm:p-6">
        {!username ? (
          <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-center">
            <div className="grid aspect-square max-w-[260px] place-items-center rounded-lg border border-white/12 bg-white/[0.04]">
              <GitBranch className="size-16 text-white/55" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">GitHub profile not connected yet.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">
                Add `NEXT_PUBLIC_GITHUB_USERNAME` or a GitHub URL in the portfolio data file to
                activate pinned-style repository cards, public repo count, followers, and recent
                activity links.
              </p>
            </div>
          </div>
        ) : status === "loading" ? (
          <div className="grid gap-3">
            <div className="h-8 w-48 animate-pulse rounded-md bg-white/10" />
            <div className="h-24 animate-pulse rounded-md bg-white/8" />
          </div>
        ) : status === "error" ? (
          <div className="flex items-center gap-3 text-red-100">
            <X className="size-5" aria-hidden="true" />
            GitHub data could not be loaded.
          </div>
        ) : user ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="rounded-lg border border-white/12 bg-white/[0.04] p-4">
              <div className="relative aspect-square overflow-hidden rounded-md border border-white/12">
                <Image
                  src={user.avatar_url}
                  alt={`${user.login} GitHub avatar`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-2xl font-bold">{user.name || user.login}</h3>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm text-cyan-100 hover:text-white"
              >
                @{user.login}
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStat label="Repos" value={user.public_repos} />
                <MiniStat label="Followers" value={user.followers} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/12 bg-white/[0.04] p-4 transition hover:border-cyan-200/32 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold">{repo.name}</h4>
                    <ArrowUpRight className="size-4 shrink-0 text-cyan-100" aria-hidden="true" />
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">
                    {repo.description || "Public repository"}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/48">
                    {repo.language && <span>{repo.language}</span>}
                    <span>{repo.stargazers_count} stars</span>
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
    <div className="rounded-md border border-white/10 bg-[#070c12] p-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/42">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function Contact() {
  return (
    <MotionSection
      id="contact"
      eyebrow="Contact"
      title="Ready for client work, internship conversations, and serious project collaboration."
      copy="The conversion path is deliberately simple: see the work, understand the builder, then open a direct channel."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-cyan-200/20 bg-cyan-200/8 p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/70">
            Build request
          </p>
          <h3 className="mt-4 text-3xl font-black sm:text-4xl">
            Bring me a hard interface, a messy idea, or a product that needs taste and execution.
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
            Dhyan is positioned for freelance web development first, with enough project depth to
            also make internship recruiters pay attention.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ContactButton action={contactActions[0]} icon={<Mail />} />
            <ContactButton action={contactActions[1]} icon={<FileText />} />
          </div>
        </div>
        <div className="grid gap-3">
          {contactActions.slice(2).map((action) => (
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
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/12 bg-white/[0.06] text-cyan-100 [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-sm font-semibold text-white">{action.label}</span>
        <span className="mt-1 block truncate text-xs text-white/48">{action.value}</span>
      </span>
      {action.href && <ArrowUpRight className="ml-auto size-4 shrink-0 text-cyan-100" aria-hidden="true" />}
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
          "flex min-h-18 items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.035] px-5 py-4 text-left opacity-70",
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
        "flex min-h-18 items-center gap-4 rounded-[1.5rem] border border-white/12 bg-[#0a1017] px-5 py-4 transition duration-300 hover:border-cyan-200/32 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
        wide && "w-full",
      )}
    >
      {content}
    </motion.a>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/48 sm:flex-row sm:items-center sm:justify-between">
        <p>Dhyan Ajay - interactive portfolio system.</p>
        <p className="font-mono text-xs uppercase tracking-[0.16em]">v1 / built for motion, clarity, and trust</p>
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
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-black leading-tight text-white sm:text-5xl xl:text-6xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
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
    "dhyan-cli ready. Type help for commands.",
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
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Developer console"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-full max-w-2xl overflow-hidden rounded-lg border border-cyan-200/25 bg-[#03070b] shadow-[0_24px_90px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100/70">
                <Terminal className="size-4" aria-hidden="true" />
                Console
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-md text-white/58 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                aria-label="Close console"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[46vh] min-h-56 overflow-y-auto p-4 font-mono text-sm leading-7 text-cyan-50/78">
              {lines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
            <form onSubmit={runCommand} className="flex border-t border-white/10">
              <label className="sr-only" htmlFor="terminal-input">
                Terminal command
              </label>
              <span className="px-4 py-3 font-mono text-sm text-cyan-100">&gt;</span>
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-12 flex-1 bg-transparent py-3 pr-4 font-mono text-sm text-white outline-none placeholder:text-white/30"
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
