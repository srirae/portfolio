"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModalWrapper } from "@/components/modal-wrapper";
import { EXPERIENCE_EVENTS, TimelineEvent } from "./data";
import { cn } from "@/lib/utils";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_WIDTH = 72; // px per month
const ROW_HEIGHT = 52; // px per gantt row
const RULER_HEIGHT = 56; // px for the ruler strip
const GANTT_PADDING_TOP = 16; // px between ruler and first row
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

export function ExperienceModal({ isOpen, onClose }: ExperienceModalProps) {
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

  // ── Auto-scroll to today on open ────────────────────────────
  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
    const timer = setTimeout(() => {
      const today = parseToMonths("Present");
      const todayPx = (today - minMonths) * MONTH_WIDTH;
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ left: Math.max(0, todayPx - el.clientWidth / 2), behavior: "smooth" });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [isOpen, minMonths]);

  // Close detail panel when modal closes
  useEffect(() => {
    if (!isOpen) setSelected(null);
  }, [isOpen]);

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
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Experience">
      {/* Dark terminal canvas */}
      <div className="relative flex h-full w-full bg-[#0e0e0e] dark:bg-[#0a0a0a] overflow-hidden font-mono">

        {/* ── Main scrollable area ── */}
        <div className="flex flex-1 flex-col h-full overflow-hidden">

          {/* Subheader row */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3 shrink-0">
            <span className="text-xs font-bold tracking-widest text-[#c8ff00] uppercase">
              Career Timeline{" "}
              <span className="text-neutral-400 font-normal">
                ({careerYears} years)
              </span>
            </span>
            <span className="text-xs text-neutral-500 tracking-wide">
              Scroll to explore
            </span>
          </div>

          {/* Timeline scroll container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-none cursor-grab active:cursor-grabbing select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
          >
            <div
              style={{ width: totalWidth, minHeight: RULER_HEIGHT + ganttHeight }}
              className="relative"
            >
              {/* ── Ruler ── */}
              <div
                style={{ height: RULER_HEIGHT }}
                className="relative border-b border-neutral-800"
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
                          ? "h-5 bg-neutral-400"
                          : "h-3 bg-neutral-700"
                      )}
                    />
                    {/* Label */}
                    <span
                      className={cn(
                        "mt-1 pl-1 leading-none whitespace-nowrap select-none",
                        isYear
                          ? "text-[11px] font-bold text-neutral-100"
                          : "text-[10px] text-neutral-600"
                      )}
                    >
                      {isYear ? year : MONTHS_SHORT[mon]}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Today line ── */}
              <div
                style={{ left: todayLeft }}
                className="absolute top-0 bottom-0 w-px bg-white/20 z-10 pointer-events-none"
              />

              {/* ── Gantt bars ── */}
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
                        "absolute h-9 flex items-center gap-2 px-3 border text-left transition-colors",
                        "rounded-sm select-none",
                        isSelected
                          ? "bg-neutral-700 border-neutral-500 text-white"
                          : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                      )}
                    >
                      <span className="text-xs truncate tracking-tight font-mono">
                        <span className="text-neutral-500">{event.orgName}</span>
                        <span className="text-neutral-600 mx-1">@</span>
                        <span>{event.role}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right detail panel ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute top-0 right-0 bottom-0 w-[340px] bg-[#111111] border-l border-neutral-800 z-20 flex flex-col font-sans"
            >
              {/* Panel header */}
              <div className="flex items-start justify-between px-5 pt-5 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-mono">
                    {selected.type} • {formatShortDisplay(selected.startDate)} – {formatShortDisplay(selected.endDate)}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Org name */}
              <div className="px-5 pb-4">
                <h4 className="text-xl font-bold text-white leading-tight tracking-tight">
                  {selected.orgName}
                </h4>
                <p className="text-sm text-neutral-400 mt-1">{selected.role}</p>
              </div>

              <Separator className="bg-neutral-800" />

              {/* Meta */}
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                  <MapPin className="size-3.5 text-neutral-600 shrink-0" />
                  <span>{selected.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                  <Calendar className="size-3.5 text-neutral-600 shrink-0" />
                  <span>
                    {formatDisplay(selected.startDate)} – {formatDisplay(selected.endDate)}
                  </span>
                </div>
              </div>

              <Separator className="bg-neutral-800" />

              {/* Bullet points */}
              <div className="px-5 py-4 flex-1 overflow-y-auto">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3 font-mono">
                  What I worked on:
                </p>
                <ul className="space-y-2.5">
                  {selected.description.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                      <span className="mt-1.5 shrink-0 text-neutral-600">·</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalWrapper>
  );
}
