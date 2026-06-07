/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Markdown from "react-markdown";
const BLUR_FADE_DELAY = 0.04;
export default function Page() {
  return (
    <main className="flex flex-col justify-center gap-10 md:gap-14 relative py-8">
      {/* Introduction Section */}
      <section id="hero" className="w-full">
        <div className="mx-auto w-full max-w-2xl space-y-8">
             <div className="gap-6 md:gap-8 flex flex-col md:flex-row justify-between items-center md:items-start">
            <BlurFade delay={BLUR_FADE_DELAY} className="shrink-0">
              <Avatar className="size-28 md:size-36 lg:size-40 border rounded-full shadow-2xl ring-4 ring-muted">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} className="object-cover" />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
            
            <div className="gap-3 flex flex-col flex-1 text-center md:text-left">
             <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl leading-tight">
                  Hi, I'm {DATA.name}
                </h1>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="w-full">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-2xl font-bold tracking-tight">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>
                {DATA.summary}
              </Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
