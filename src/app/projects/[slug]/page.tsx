import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, FileText, Rocket, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects, site, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project not found | Portfolio",
      description: "Project page not found for the requested portfolio item.",
    };
  }

  return {
    title: `${project.title} | ${site.title}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${site.title}`,
      description: project.summary,
      url: `${site.url}/projects/${project.slug}`,
      siteName: site.title,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-[#06080A] text-[#f0fdf4]">
      {/* Background cyber grid & glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="cyber-grid absolute inset-0 opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[40rem] rounded-full bg-[#00FF88]/[0.08] blur-[120px]" />
        <div className="scanlines absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header HUD Banner */}
        <div className="cyber-glass relative mb-8 flex flex-col gap-6 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between border border-[rgba(0,255,136,0.22)]">
          <span className="absolute -left-1 -top-1 h-2 w-2 bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
          <span className="absolute -right-1 -top-1 h-2 w-2 bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />

          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00FF88]">
              {project.eyebrow}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[#f0fdf4]/80 sm:text-lg">
              {project.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="rounded-lg border border-[#00FF88]/30 bg-[#00FF88]/10 px-3.5 py-1.5 font-mono text-xs text-[#00FF88]">
                {project.status}
              </span>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[rgba(0,255,136,0.18)] bg-[#0B1114]/90 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#6CFFB2]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link href="/">
                Back home
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            {project.links.map((link) =>
              link.href ? (
                <Button asChild key={link.label} variant="ghost" size="lg">
                  {link.href.startsWith("http") ? (
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={link.href}>
                      {link.label}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </Button>
              ) : null,
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-6 xl:grid-cols-[0.95fr_0.85fr]">
          <div className="space-y-6">
            <div className="cyber-glass overflow-hidden rounded-3xl p-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[rgba(0,255,136,0.2)] bg-[#04070a]">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} showcase`}
                    fill
                    sizes="(min-width: 1280px) 60vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#04070a] via-[#0B1114] to-[#00FF88]/10 text-white/80 px-8 text-center">
                    <FileText className="size-14 text-[#00FF88]" />
                    <p className="max-w-lg text-xs leading-6 text-[#f0fdf4]/70 font-mono">
                      [NO_VISUAL_AVAILABLE_VIEW_REPOSITORIES]
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.15),transparent_40%)]" />
              </div>
            </div>

            <section className="cyber-glass rounded-3xl p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#00FF88]">Case study</p>
                  <h2 className="mt-2 text-3xl font-black text-white">Why this project matters</h2>
                </div>
                <span className="rounded-lg border border-[#00FF88]/30 bg-[#00FF88]/10 px-4 py-2 font-mono text-xs text-[#00FF88]">
                  {project.status}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <ProjectDetailCard title="Problem" value={project.caseStudy.problem} icon={<ScrollText />} />
                <ProjectDetailCard title="Results" value={project.caseStudy.results} icon={<Rocket />} />
              </div>

              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#00FF88] mb-4">Timeline</p>
                <div className="relative pl-8 border-l border-[#00FF88]/20">
                  {project.timeline.map((milestone, i) => (
                    <div key={i} className="mb-6 relative last:mb-0">
                      <div className="absolute -left-[8px] top-1.5 h-2 w-2 rounded-full bg-[#00FF88] border border-[#00FF88]/40" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#00FF88]/60 block mb-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-7 text-[#f0fdf4]/80">{milestone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <ProjectDetailSection
                title="Research & planning"
                content={[
                  { heading: "Research", text: project.caseStudy.research },
                  { heading: "Planning", text: project.caseStudy.planning },
                ]}
              />
              <ProjectDetailSection
                title="Architecture & development"
                content={[
                  { heading: "Architecture", text: project.caseStudy.architecture },
                  { heading: "Development", text: project.caseStudy.development },
                ]}
              />
            </section>
          </div>

          <aside className="space-y-6">
            <div className="cyber-glass rounded-3xl p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#00FF88]">Details</p>
              <div className="mt-5 grid gap-3">
                <SummaryRow label="Status" value={project.status} />
                <SummaryRow label="Impact" value={project.impact} />
                <SummaryRow label="Stack" value={project.techStack.join(", ")} />
              </div>
            </div>

            <div className="cyber-glass rounded-3xl p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#00FF88]">Challenges</p>
              <ul className="mt-5 space-y-3">
                {project.challenges.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-4 text-sm leading-7 text-[#f0fdf4]/80">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#00FF88]/20 font-mono text-xs font-bold text-[#00FF88]">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cyber-glass rounded-3xl p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#00FF88]">Improvements</p>
              <div className="mt-5 grid gap-3">
                {project.caseStudy.improvements.map((item) => (
                  <p key={item} className="rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-4 text-sm leading-7 text-[#f0fdf4]/80">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88] [&_svg]:size-5">
          {icon}
        </span>
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00FF88]">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-7 text-[#f0fdf4]/80">{value}</p>
    </div>
  );
}

function ProjectDetailSection({
  title,
  content,
}: {
  title: string;
  content: Array<{ heading: string; text: string }>;
}) {
  return (
    <div className="cyber-glass rounded-3xl p-6">
      <h3 className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#00FF88]">
        {title}
      </h3>
      <div className="mt-5 space-y-4">
        {content.map((item) => (
          <div key={item.heading} className="rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-4">
            <h4 className="font-semibold text-white">{item.heading}</h4>
            <p className="mt-2 text-sm leading-7 text-[#f0fdf4]/80">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-[rgba(0,255,136,0.18)] bg-[#06080A]/80 p-3.5 sm:grid-cols-[110px_1fr]">
      <span className="font-mono text-xs uppercase tracking-wider text-[#00FF88]/60">{label}</span>
      <span className="text-sm font-medium text-white/90">{value}</span>
    </div>
  );
}
