"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EXPERIENCE_EVENTS, TimelineEvent } from "@/components/experience/data";
import { cn } from "@/lib/utils";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";

const MONTH_WIDTH = 100; // px per month
const ROW_HEIGHT = 56; // px per gantt row
const RULER_HEIGHT = 64; // px for the ruler strip
const GANTT_PADDING_TOP = 24; // px between ruler and first row
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const parseToMonths = (dateStr: string): number => {
  if (dateStr === "Present") {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [year, month] = dateStr.split("-").map(Number);
  return year * 12 + (month - 1);
};

const formatDisplay = (dateStr: string): string => {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const formatShortDisplay = (dateStr: string): string => {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-").map(Number);
  return `${MONTHS_SHORT[month - 1].toUpperCase()} ${year}`;
};

export default function ExperiencePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<TimelineEvent | null>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  // ── Time bounds ──────────────────────────────────────────────
  const { minMonths, totalMonths } = useMemo(() => {
    let minM = Infinity, maxM = -Infinity;
    EXPERIENCE_EVENTS.forEach((e) => {
      const s = parseToMonths(e.startDate);
      const en = parseToMonths(e.endDate);
      if (s < minM) minM = s;
      if (en > maxM) maxM = en;
    });
    const startYear = Math.floor(minM / 12);
    const endYear   = Math.ceil(maxM / 12);
    return {
      minMonths: startYear * 12,
      totalMonths: endYear * 12 - startYear * 12,
    };
  }, []);

  // Career span label
  const careerYears = useMemo(() => {
    let minM = Infinity, maxM = -Infinity;
    EXPERIENCE_EVENTS.forEach((e) => {
      const s = parseToMonths(e.startDate);
      const en = parseToMonths(e.endDate);
      if (s < minM) minM = s;
      if (en > maxM) maxM = en;
    });
    return Math.round(((maxM - minM) / 12) * 10) / 10;
  }, []);

  // ── Gantt row layout ─────────────────────────────────────────
  const eventsWithLayout = useMemo(() => {
    const sorted = [...EXPERIENCE_EVENTS].sort(
      (a, b) => parseToMonths(a.startDate) - parseToMonths(b.startDate)
    );
    const rowEnds: number[] = [];
    return sorted.map((event) => {
      const start = parseToMonths(event.startDate);
      const end   = parseToMonths(event.endDate);
      let row = 0;
      while (row < rowEnds.length && rowEnds[row] + 1 > start) row++;
      rowEnds[row] = end;
      const left  = (start - minMonths) * MONTH_WIDTH;
      const width = Math.max(2, end - start) * MONTH_WIDTH;
      return { event, left, width, row };
    });
  }, [minMonths]);

  const numRows = useMemo(
    () => Math.max(...eventsWithLayout.map((e) => e.row)) + 1,
    [eventsWithLayout]
  );

  // ── Auto-scroll to today on load ────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scrollRef.current) return;
      const today = parseToMonths("Present");
      const todayPx = (today - minMonths) * MONTH_WIDTH;
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ left: Math.max(0, todayPx - el.clientWidth / 2), behavior: "smooth" });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [minMonths]);

  // ── Drag-to-scroll ───────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollStart.current - (x - startX.current) * 1.3;
  };
  const onDragEnd = () => { isDown.current = false; };

  // ── Today marker ─────────────────────────────────────────────
  const todayLeft = (parseToMonths("Present") - minMonths) * MONTH_WIDTH;

  // ── Ruler tick data ──────────────────────────────────────────
  const ticks = useMemo(() => {
    return Array.from({ length: totalMonths }, (_, i) => {
      const abs  = minMonths + i;
      const year = Math.floor(abs / 12);
      const mon  = abs % 12;
      return { i, year, mon, isYear: mon === 0 };
    });
  }, [minMonths, totalMonths]);

  const totalWidth = totalMonths * MONTH_WIDTH;
  const ganttHeight = numRows * ROW_HEIGHT + GANTT_PADDING_TOP + 20;

  return (
    <main className="flex flex-col gap-10 py-8 relative font-sans">
      <div className="space-y-4">
        <BlurFadeText
          delay={0.04}
          className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl"
          text="Experience"
        />
        <BlurFadeText
          delay={0.06}
          className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed"
          text="An interactive map of my career timeline. Click on any block to see detailed achievements."
        />
      </div>

      <BlurFade delay={0.08}>
        {/* Full-bleed wrapper: break out of the parent max-w-2xl */}
        <div className="relative left-1/2 -translate-x-1/2 w-[min(100vw-2rem,1400px)] flex h-[520px] bg-card border border-border/80 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Main scrollable board */}
          <div className="flex flex-1 flex-col h-full overflow-hidden">
            {/* Header info */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3 shrink-0 border-b border-border/40 bg-muted/20">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">
                Career Timeline{" "}
                <span className="text-muted-foreground font-normal normal-case">
                  ({careerYears} years)
                </span>
              </span>
              <span className="text-xs text-muted-foreground tracking-wide">
                Drag or scroll to explore
              </span>
            </div>

            {/* Scrollable Gantt Canvas */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none cursor-grab active:cursor-grabbing select-none bg-background/50"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
            >
              <div
                style={{ width: totalWidth, minHeight: RULER_HEIGHT + ganttHeight }}
                className="relative"
              >
                {/* Ruler ticks */}
                <div
                  style={{ height: RULER_HEIGHT }}
                  className="relative border-b border-border/40 bg-muted/10"
                >
                  {ticks.map(({ i, year, mon, isYear }) => (
                    <div
                      key={i}
                      style={{ left: i * MONTH_WIDTH }}
                      className="absolute top-0 h-full flex flex-col items-start"
                    >
                      {/* Tick mark */}
                      <div
                        className={cn(
                          "w-px mt-2",
                          isYear
                            ? "h-5 bg-neutral-400 dark:bg-neutral-600"
                            : "h-3 bg-neutral-200 dark:bg-neutral-800"
                        )}
                      />
                      {/* Label */}
                      <span
                        className={cn(
                          "mt-1 pl-1 leading-none whitespace-nowrap select-none",
                          isYear
                            ? "text-[11px] font-bold text-neutral-800 dark:text-neutral-200"
                            : "text-[10px] text-neutral-400 dark:text-neutral-500"
                        )}
                      >
                        {isYear ? year : MONTHS_SHORT[mon]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Today Marker */}
                <div
                  style={{ left: todayLeft }}
                  className="absolute top-0 bottom-0 w-px bg-red-500 z-10 pointer-events-none"
                />

                {/* Timeline Gantt blocks */}
                <div
                  style={{ height: ganttHeight }}
                  className="relative"
                >
                  {eventsWithLayout.map(({ event, left, width, row }) => {
                    const isSelected = selected?.id === event.id;
                    const top = GANTT_PADDING_TOP + row * ROW_HEIGHT;
                    return (
                      <button
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); setSelected(event); }}
                        style={{ left, width, top }}
                        className={cn(
                          "absolute h-12 flex items-center gap-2 px-3.5 border text-left transition-all duration-200",
                          "rounded-xl select-none shadow-sm",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card hover:bg-muted/50 border-border text-foreground hover:border-neutral-400 dark:hover:border-neutral-600"
                        )}
                      >
                        <span className="text-sm truncate tracking-tight font-medium">
                          <span className={cn(isSelected ? "text-primary-foreground/75" : "text-muted-foreground")}>{event.orgName}</span>
                          <span className={cn("mx-1", isSelected ? "text-primary-foreground/50" : "text-neutral-300 dark:text-neutral-700")}>@</span>
                          <span>{event.role}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar details panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 240 }}
                className="absolute top-0 right-0 bottom-0 w-[340px] sm:w-[400px] lg:w-[440px] bg-card border-l border-border/80 z-20 flex flex-col shadow-2xl"
              >
                {/* Panel Header */}
                <div className="flex items-start justify-between px-5 pt-5 pb-3">
                  <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">
                    {selected.type} • {formatShortDisplay(selected.startDate)} – {formatShortDisplay(selected.endDate)}
                  </span>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Header title */}
                <div className="px-5 pb-4">
                  <h4 className="text-xl font-bold text-foreground leading-tight tracking-tight">
                    {selected.orgName}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{selected.role}</p>
                </div>

                <Separator className="bg-border/60" />

                {/* Metadata */}
                <div className="px-5 py-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-neutral-400 shrink-0" />
                    <span>{selected.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {formatDisplay(selected.startDate)} – {formatDisplay(selected.endDate)}
                    </span>
                  </div>
                </div>

                <Separator className="bg-border/60" />

                {/* Bullets List */}
                <div className="px-5 py-4 flex-1 overflow-y-auto">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
                    Core Accomplishments:
                  </p>
                  <ul className="space-y-3">
                    {selected.description.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BlurFade>
    </main>
  );
}
