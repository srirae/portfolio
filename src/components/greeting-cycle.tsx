"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
const GREETINGS = [
  "Hi",
  "Namaste",
  "Hola",
  "Bonjour",
  "Konnichiwa",
  "Ciao",
  "Annyeong",
  "Olá",
  "Hej",
  "Hallo",
];
export default function GreetingCycle() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2800); // Elegant timing: 2.8 seconds per greeting
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="inline-block relative min-w-[70px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[170px] h-[1.2em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={GREETINGS[index]}
          initial={{ y: "80%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-80%", opacity: 0, filter: "blur(4px)" }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth cubic bezier ease
          }}
          className="absolute left-0 text-foreground font-bold"
        >
          {GREETINGS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
