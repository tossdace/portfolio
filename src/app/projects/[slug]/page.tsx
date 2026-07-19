import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, FileText, Rocket, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects, site, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const project = projects.find((item) => item.slug === params.slug);

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

export default function ProjectPage({ params }: PageProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#04070e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[#071016]/80 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-100/60">
              {project.eyebrow}
            </p>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              {project.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75">
                {project.status}
              </span>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-cyan-200/8 px-3 py-2 text-xs uppercase tracking-[0.16em] text-cyan-100"
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

        <div className="grid gap-6 xl:grid-cols-[0.95fr_0.85fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#071116]/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#02080f]">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title} showcase`}
                  fill
                  sizes="(min-width: 1280px) 60vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white/80 px-8 text-center">
                  <FileText className="size-14 text-cyan-200" />
                  <p className="max-w-lg text-sm leading-7 text-white/70">
                    No visual available for this project yet. View the GitHub repository for the full details.
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%)]" />
            </div>
            </div>

            <section className="rounded-[2rem] border border-white/10 bg-[#071116]/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.15)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-100/50">Case study</p>
                  <h2 className="mt-3 text-3xl font-black text-white">Why this project matters</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                  {project.timeline.join(" • ")}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <ProjectDetailCard title="Problem" value={project.caseStudy.problem} icon={<ScrollText />} />
                <ProjectDetailCard title="Results" value={project.caseStudy.results} icon={<Rocket />} />
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
            <div className="rounded-[2rem] border border-white/10 bg-[#071116]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-100/50">Details</p>
              <div className="mt-5 grid gap-4">
                <SummaryRow label="Status" value={project.status} />
                <SummaryRow label="Impact" value={project.impact} />
                <SummaryRow label="Stack" value={project.techStack.join(", ")} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#071116]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-100/50">Challenges</p>
              <ul className="mt-5 space-y-3">
                {project.challenges.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/70">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-200/10 text-cyan-100">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#071116]/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-100/50">Improvements</p>
              <div className="mt-5 grid gap-3">
                {project.caseStudy.improvements.map((item) => (
                  <p key={item} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/70">
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-3xl bg-white/[0.04] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="text-sm leading-7 text-white/75">{value}</p>
    </div>
  );
}

function ProjectDetailCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[#02080f]/85 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-100 [&_svg]:size-5">
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-4 text-sm leading-7 text-white/70">{value}</p>
    </div>
  );
}

function ProjectDetailSection({
  title,
  content,
}: {
  title: string;
  content: { heading: string; text: string }[];
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#071116]/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.15)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-100/50">{title}</p>
      <div className="mt-5 space-y-5">
        {content.map((item) => (
          <div key={item.heading}>
            <h3 className="text-xl font-semibold text-white">{item.heading}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
