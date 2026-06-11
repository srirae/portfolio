import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Extra",
  description: "Skills and technologies I work with",
};

const BLUR_FADE_DELAY = 0.04;

export default function ExtraPage() {
  return (
    <main className="flex flex-col gap-8 py-8 relative font-sans">
      <div className="space-y-1">
        <BlurFadeText
          delay={BLUR_FADE_DELAY}
          className="text-3xl font-mono font-bold tracking-tight text-foreground"
          text="extra"
        />
        <BlurFadeText
          delay={BLUR_FADE_DELAY * 1.5}
          className="text-muted-foreground font-mono text-sm"
          text="skills & tools I work with"
        />
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 mt-4">
        {Object.entries(DATA.skills).map(([category, skills], categoryIdx) => (
          <BlurFade key={category} delay={BLUR_FADE_DELAY * (2 + categoryIdx)}>
            <div className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border/60" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground px-3">
                  {category}
                </h3>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* Skills in this category */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {skills.map((skill, idx) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={`${category}-${skill.name}-${idx}`}
                      className={cn(
                        "group relative flex items-center gap-2.5 p-3",
                        "rounded-xl border border-border/60",
                        "bg-card/50 hover:bg-card/80",
                        "transition-all duration-200 hover:scale-105",
                        "hover:border-primary/40 hover:shadow-md"
                      )}
                    >
                      <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </BlurFade>
        ))}
      </div>

      {/* Additional Stats Section */}
      <BlurFade delay={BLUR_FADE_DELAY * 8}>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border/60" />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground px-3">
              Quick Stats
            </h3>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border/60 bg-card/50 space-y-1">
              <p className="text-2xl font-bold text-primary">5+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Years Coding</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-card/50 space-y-1">
              <p className="text-2xl font-bold text-primary">20+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Projects Built</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-card/50 space-y-1">
              <p className="text-2xl font-bold text-primary">10+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Technologies</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-card/50 space-y-1">
              <p className="text-2xl font-bold text-primary">∞</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Learning</p>
            </div>
          </div>
        </div>
      </BlurFade>
    </main>
  );
}