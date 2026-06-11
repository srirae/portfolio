import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { DATA } from "@/data/resume";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Resume",
  description: "My work experience, education, and skills.",
};

const BLUR_FADE_DELAY = 0.04;

export default function ResumePage() {
  return (
    <main className="flex flex-col gap-12 py-8 relative font-sans">
      {/* Title */}
      <div className="space-y-4">
        <BlurFadeText
          delay={BLUR_FADE_DELAY}
          className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl"
          text="Resume"
        />
        <BlurFadeText
          delay={BLUR_FADE_DELAY * 1.5}
          className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed"
          text="My professional history, academic background, and technical toolkit."
        />
      </div>

      {/* Work Section */}
      <section className="space-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
        </BlurFade>
        <div className="space-y-8">
          {DATA.work.map((work, idx) => (
            <BlurFade key={work.company + work.title} delay={BLUR_FADE_DELAY * (3 + idx)}>
              <div className="flex gap-4 items-start group">
                <Avatar className="size-12 border rounded-full bg-background shrink-0 shadow-sm transition-transform group-hover:scale-105">
                  <AvatarImage alt={work.company} src={work.logoUrl} className="object-contain p-1" />
                  <AvatarFallback>{work.company[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-semibold text-base leading-none">
                      {work.href ? (
                        <a href={work.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary transition-colors">
                          {work.company}
                        </a>
                      ) : (
                        work.company
                      )}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      {work.start} – {work.end}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {work.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {work.description}
                  </p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <h2 className="text-2xl font-bold tracking-tight">Education</h2>
        </BlurFade>
        <div className="space-y-8">
          {DATA.education.map((edu, idx) => (
            <BlurFade key={edu.school + edu.degree} delay={BLUR_FADE_DELAY * (8 + idx)}>
              <div className="flex gap-4 items-start group">
                <Avatar className="size-12 border rounded-full bg-background shrink-0 shadow-sm transition-transform group-hover:scale-105">
                  <AvatarImage alt={edu.school} src={edu.logoUrl} className="object-contain p-1" />
                  <AvatarFallback>{edu.school[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-semibold text-base leading-none">
                      {edu.href ? (
                        <a href={edu.href} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary transition-colors">
                          {edu.school}
                        </a>
                      ) : (
                        edu.school
                      )}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      {edu.start} – {edu.end}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {edu.degree}
                  </p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 12}>
          <h2 className="text-2xl font-bold tracking-tight">Skills & Technologies</h2>
        </BlurFade>
        <div className="space-y-6">
  {Object.entries(DATA.skills).map(([category, skills]) => (
    <div key={category}>
      <h3 className="mb-2 font-semibold">{category}</h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const IconComponent = skill.icon;

          return (
            <div
              key={skill.name}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5"
            >
              {IconComponent && <IconComponent className="size-4" />}
              <span>{skill.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>
      </section>
    </main>
  );
}
