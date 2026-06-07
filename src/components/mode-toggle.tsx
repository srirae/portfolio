"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // 🛑 Fallback for older browsers that don't support View Transitions
    if (!document.startViewTransition) {
      setTheme(theme === "dark" ? "light" : "dark");
      return;
    }

    // 🎨 Inject a temporary style tag to make the global transition slow and smooth
    const style = document.createElement("style");
    style.innerHTML = `
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 800ms; /* ⏳ Set transition duration (e.g., 800ms or 1s) */
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);

    // 🎬 Run the cinematic crossfade transition via JS
    const transition = document.startViewTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    });

    // 🧹 Clean up the style tag once the animation finishes
    transition.finished.then(() => {
      style.remove();
    });
  };

  return (
    <Button
      type="button"
      variant="link"
      size="icon"
      className={cn("relative overflow-hidden", className)} 
      onClick={toggleTheme} // ⚡ Invokes our smooth JS theme animator
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ 
              duration: 0.4, // Matches the slower pace of the layout
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MoonIcon className="h-full w-full" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
            transition={{ 
              duration: 0.4, // Matches the slower pace of the layout
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SunIcon className="h-full w-full" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}