"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, X, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ModalWrapper } from "@/components/modal-wrapper";
import { EXPERIENCE_EVENTS, TimelineEvent } from "./data";
import { cn } from "@/lib/utils";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_WIDTH = 85; // Pixels per month
const ROW_HEIGHT = 70; // Pixels per Gantt row
const MONTHS_LIST = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Helper to convert "YYYY-MM" or "Present" to absolute months since Year 0
const parseToMonths = (dateStr: string): number => {
  if (dateStr === "Present") {
    // Current date is June 2026 based on mock local time metadata
    return 2026 * 12 + 5; 
  }
  const [year, month] = dateStr.split("-").map(Number);
  return year * 12 + (month - 1);
};

// Helper to format date strings for details display
const formatDisplayDate = (dateStr: string): string => {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1);
  return dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export function ExperienceModal({ isOpen, onClose }: ExperienceModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [activeDrag, setActiveDrag] = useState(false);

  // Drag-to-scroll references
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);

  // 1. Calculate the bounding time frame of the ruler
  const { minMonths, totalMonths } = useMemo(() => {
    let minM = Infinity;
    let maxM = -Infinity;

    EXPERIENCE_EVENTS.forEach((event) => {
      const start = parseToMonths(event.startDate);
      const end = parseToMonths(event.endDate);
      if (start < minM) minM = start;
      if (end > maxM) maxM = end;
    });

    // Make sure we encompass whole years
    const startYear = Math.floor(minM / 12);
    const endYear = Math.ceil(maxM / 12);

    const minMonthsBound = startYear * 12;
    const maxMonthsBound = endYear * 12;
    const total = maxMonthsBound - minMonthsBound;

    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }

    return {
      minMonths: minMonthsBound,
      totalMonths: total,
    };
  }, []);

  const totalCareerYears = useMemo(() => {
    // Find min start and max end to calculate true span
    let minM = Infinity;
    let maxM = -Infinity;
    EXPERIENCE_EVENTS.forEach((e) => {
      const start = parseToMonths(e.startDate);
      const end = parseToMonths(e.endDate);
      if (start < minM) minM = start;
      if (end > maxM) maxM = end;
    });
    const differenceYears = (maxM - minM) / 12;
    return Math.max(1, Math.round(differenceYears * 10) / 10);
  }, []);

  // 2. Position Gantt events into non-overlapping rows
  const { eventsWithLayout, maxRows } = useMemo(() => {
    // Sort events by starting date first
    const sorted = [...EXPERIENCE_EVENTS].sort(
      (a, b) => parseToMonths(a.startDate) - parseToMonths(b.startDate)
    );

    const rowEndMonths: number[] = [];
    const layout = sorted.map((event) => {
      const start = parseToMonths(event.startDate);
      const end = parseToMonths(event.endDate);

      // Find first row where this event fits
      let rowIndex = 0;
      while (rowIndex < rowEndMonths.length) {
        // Add a 1-month buffer to prevent items touching directly
        if (rowEndMonths[rowIndex] + 1 <= start) {
          break;
        }
        rowIndex++;
      }

      rowEndMonths[rowIndex] = end;

      // Position ratios
      const leftOffsetMonths = start - minMonths;
      const durationMonths = Math.max(1.5, end - start); // Min length for visibility

      const left = leftOffsetMonths * MONTH_WIDTH;
      const width = durationMonths * MONTH_WIDTH;

      return {
        event,
        left,
        width,
        row: rowIndex,
      };
    });

    return {
      eventsWithLayout: layout,
      maxRows: rowEndMonths.length,
    };
  }, [minMonths]);

  // 3. Center viewport to Today's date on mount
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      setTimeout(() => {
        const todayMonths = parseToMonths("Present");
        const todayPixel = (todayMonths - minMonths) * MONTH_WIDTH;
        const container = scrollContainerRef.current;
        if (container) {
          // Center today inside the scroll view width
          const centerScroll = todayPixel - container.clientWidth / 2;
          container.scrollTo({
            left: Math.max(0, centerScroll),
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [isOpen, minMonths]);

  // 4. Mouse Grabbing Handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDown.current = true;
    setActiveDrag(true);
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftVal.current = scrollContainerRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4; // scroll speed factor
    scrollContainerRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDown.current = false;
    setActiveDrag(false);
  };

  // Determine standard hex color variants
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "WORK":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "EDUCATION":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Professional Experience"
    >
      <div className="relative flex h-full w-full overflow-hidden bg-background/5">
        {/* Main Timeline Workspace */}
        <div className="flex flex-1 flex-col h-full overflow-hidden p-6 pb-4">
          {/* Subheader */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Career History
              </span>
              <h3 className="text-lg font-bold text-foreground/80">
                CAREER TIMELINE ({totalCareerYears} YEARS)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 border border-border/30 rounded-lg px-2.5 py-1">
              <ArrowRightLeft className="size-3.5" />
              <span>Scroll or drag horizontally to explore</span>
            </div>
          </div>

          {/* Timeline Viewport Wrapper */}
          <div className="flex-1 min-h-0 border border-border/40 rounded-2xl bg-muted/10 relative overflow-hidden flex flex-col">
            {/* Horizontal Ruler/Scroll Container */}
            <div
              ref={scrollContainerRef}
              className={cn(
                "flex-1 overflow-x-auto overflow-y-hidden select-none cursor-grab active:cursor-grabbing scrollbar-none relative",
                activeDrag && "select-none"
              )}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUpOrLeave}
              onMouseLeave={onMouseUpOrLeave}
            >
              {/* Ruler & Gantt Layout (width scales with total months) */}
              <div
                style={{ width: `${totalMonths * MONTH_WIDTH}px` }}
                className="relative h-full flex flex-col pt-12"
              >
                {/* Year and Month Ticks (Floating Ruler header) */}
                <div className="absolute top-0 left-0 right-0 h-10 border-b border-border/40 bg-card/40 backdrop-blur-sm flex items-end">
                  {Array.from({ length: totalMonths }).map((_, mIndex) => {
                    const currentTotalMonths = minMonths + mIndex;
                    const year = Math.floor(currentTotalMonths / 12);
                    const monthNum = currentTotalMonths % 12;
                    const isNewYear = monthNum === 0;

                    return (
                      <div
                        key={mIndex}
                        style={{
                          width: `${MONTH_WIDTH}px`,
                          left: `${mIndex * MONTH_WIDTH}px`,
                        }}
                        className="absolute bottom-0 flex flex-col items-start justify-end pl-2.5 pb-1 h-full border-l border-border/20"
                      >
                        {isNewYear ? (
                          <span className="text-xs font-black text-foreground mb-1">
                            {year}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 mb-0.5">
                            {MONTHS_LIST[monthNum]}
                          </span>
                        )}
                        {/* Height increments: tall for new year, medium for half year, small for others */}
                        <div
                          className={cn(
                            "w-px bg-border/40",
                            isNewYear
                              ? "h-4 bg-foreground/50"
                              : monthNum === 6
                              ? "h-2.5 bg-foreground/30"
                              : "h-1.5"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Vertical grid lines to assist viewing */}
                <div className="absolute inset-y-10 left-0 right-0 pointer-events-none">
                  {Array.from({ length: totalMonths }).map((_, mIndex) => {
                    const currentTotalMonths = minMonths + mIndex;
                    const isNewYear = currentTotalMonths % 12 === 0;
                    return (
                      <div
                        key={`line-${mIndex}`}
                        style={{
                          left: `${mIndex * MONTH_WIDTH}px`,
                        }}
                        className={cn(
                          "absolute top-0 bottom-0 w-px border-l pointer-events-none",
                          isNewYear ? "border-border/15" : "border-border/5"
                        )}
                      />
                    );
                  })}
                </div>

                {/* Today's indicator red pointer line */}
                {(() => {
                  const todayMonths = parseToMonths("Present");
                  const todayLeft = (todayMonths - minMonths) * MONTH_WIDTH;
                  return (
                    <div
                      style={{ left: `${todayLeft}px` }}
                      className="absolute top-0 bottom-0 w-px bg-red-500/50 z-10 pointer-events-none"
                    >
                      <div className="absolute top-10 -translate-x-1/2 bg-red-500 text-[9px] font-black text-white px-1.5 py-0.5 rounded shadow-sm">
                        TODAY
                      </div>
                    </div>
                  );
                })()}

                {/* Gantt Bars Area */}
                <div
                  style={{
                    height: `${(maxRows + 1) * ROW_HEIGHT}px`,
                  }}
                  className="relative mt-8 flex-1"
                >
                  {eventsWithLayout.map(({ event, left, width, row }) => {
                    const isSelected = selectedEvent?.id === event.id;
                    return (
                      <button
                        key={event.id}
                        onClick={(e) => {
                          // Allow selection only if it wasn't a long drag drag scroll
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          top: `${row * ROW_HEIGHT + 10}px`,
                        }}
                        className={cn(
                          "absolute h-12 rounded-xl border px-3 flex items-center justify-start gap-2.5 text-left transition-all shadow-sm hover:shadow-md cursor-pointer group select-none",
                          isSelected
                            ? "bg-primary border-transparent text-primary-foreground scale-[1.01] shadow-lg ring-2 ring-primary/20"
                            : "bg-card hover:bg-muted/40 border-border/40 text-card-foreground"
                        )}
                      >
                        {/* Dot */}
                        <div
                          style={{
                            backgroundColor: isSelected ? "#fff" : event.color,
                          }}
                          className="size-2.5 rounded-full shrink-0 group-hover:scale-110 transition-transform"
                        />
                        {/* Title Info */}
                        <div className="flex flex-col min-w-0 select-none">
                          <span className="text-xs font-bold truncate tracking-tight">
                            {event.orgName}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] truncate leading-none",
                              isSelected
                                ? "text-primary-foreground/75"
                                : "text-muted-foreground"
                            )}
                          >
                            {event.role}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Details Overlay Panel */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-card/95 backdrop-blur-md border-l border-border/30 shadow-2xl z-20 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
                <Badge className={cn("text-[10px] font-bold", getBadgeColor(selectedEvent.type))} variant="outline">
                  {selectedEvent.type}
                </Badge>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/20 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable details content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Org & Role */}
                <div>
                  <h4 className="text-2xl font-black text-foreground tracking-tight">
                    {selectedEvent.orgName}
                  </h4>
                  <p className="text-sm font-semibold text-muted-foreground mt-0.5">
                    {selectedEvent.role}
                  </p>
                </div>

                <Separator />

                {/* Location and Date Range Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <MapPin className="size-4 text-foreground/45 shrink-0" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Calendar className="size-4 text-foreground/45 shrink-0" />
                    <span>
                      {formatDisplayDate(selectedEvent.startDate)} – {formatDisplayDate(selectedEvent.endDate)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Description Bullet points */}
                <div>
                  <span className="text-xs font-black tracking-widest text-foreground/70 uppercase">
                    What I worked on:
                  </span>
                  <ul className="mt-3.5 space-y-3 pl-3">
                    {selectedEvent.description.map((bullet, index) => (
                      <li
                        key={index}
                        className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
                      >
                        <span className="mt-1.5 size-1.5 rounded-full bg-foreground/20 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalWrapper>
  );
}
