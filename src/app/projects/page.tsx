"use client";

import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { DATA } from "@/data/resume";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, FolderGit2, Server, Cloud, Wrench, LayoutGrid } from "lucide-react";
import { useState } from "react";

const BLUR_FADE_DELAY = 0.04;

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  all: LayoutGrid,
  apis: Server,
  infra: Cloud,
  tools: Wrench,
  apps: FolderGit2,
};

type ProjectLike = (typeof DATA.projects)[number];

function ProjectCard({ project, idx }: { project: ProjectLike; idx: number }) {
  const githubLink = project.links.find(
    (l) => l.type.toLowerCase().includes("source") || l.type.toLowerCase().includes("github")
  )?.href;
  const websiteLink = project.links.find(
    (l) => l.type.toLowerCase().includes("website") || l.type.toLowerCase().includes("site")
  )?.href;

  return (
    <BlurFade delay={BLUR_FADE_DELAY * (1 + idx * 0.5)}>
      <div className="group relative flex gap-4 p-5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/70 hover:-translate-y-0.5">
        <div className="flex-shrink-0 size-11 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-sm font-bold text-muted-foreground select-none overflow-hidden">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.image} alt={project.title} className="size-full object-cover" />
          ) : (
            <span>{project.title.substring(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-base leading-none">
              {project.title}
            </span>
            <span
              className={`text-xs font-medium flex items-center gap-1 select-none ${
                project.active ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              • {project.active ? "Live" : "In Progress"}
            </span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-muted/60 text-muted-foreground border border-border/50 text-[10px] px-2 py-0.5 hover:bg-muted"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 text-muted-foreground shrink-0">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Icons.github className="size-4" />
                </a>
              )}
              {websiteLink && (
                <a
                  href={websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  aria-label="Live Website"
                >
                  <Globe className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </BlurFade>
  );
}

export default function ProjectsPage() {
  const [active, setActive] = useState("all");

  const categories = DATA.projectCategories;
  const projects = DATA.projects as readonly ProjectLike[];

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  const counts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = c.id === "all" ? projects.length : projects.filter((p) => p.category === c.id).length;
    return acc;
  }, {});

  const activeMeta = categories.find((c) => c.id === active);

  return (
    <main className="flex flex-col gap-8 py-8 relative font-sans">
      <div className="space-y-1">
        <BlurFadeText
          delay={BLUR_FADE_DELAY}
          className="text-3xl font-mono font-bold tracking-tight text-foreground"
          text="projects"
        />
        <BlurFadeText
          delay={BLUR_FADE_DELAY * 1.5}
          className="text-muted-foreground font-mono text-sm"
          text="things I've built — grouped by what they are"
        />
      </div>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <Tabs value={active} onValueChange={setActive} className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] ?? LayoutGrid;
              return (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="gap-1.5 px-3 py-1.5 text-xs"
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                  <span className="ml-1 text-[10px] text-muted-foreground tabular-nums">
                    {counts[cat.id]}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-5">
              {activeMeta && active === cat.id && (
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  {cat.description}
                </p>
              )}

              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-card/20 p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nothing here yet — stay tuned.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((project, idx) => (
                    <ProjectCard key={project.title} project={project} idx={idx} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </BlurFade>
    </main>
  );
}
