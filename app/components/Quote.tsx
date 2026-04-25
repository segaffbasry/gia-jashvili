"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUOTE =
  "\u201cBridging the expressive intensity of the Russian violin school with the elegance of the Viennese tradition.\u201d";

export default function Quote() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stickyRef   = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const charsRef    = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const chars = charsRef.current;
    if (!chars.length || !sectionRef.current) return;

    gsap.set(chars, { color: "rgba(255,255,255,0.12)" });

    // Phase 1 (0→0.6): light up letters
    // Phase 2 (0.6→1): fade the whole text block out
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=250%",          // scroll 2.5× viewport height while pinned
      pin: true,
      scrub: 1,
      onUpdate(self) {
        const p1 = Math.min(1, self.progress / 0.6);   // 0→1 during first 60%
        const p2 = Math.max(0, (self.progress - 0.6) / 0.4); // 0→1 during last 40%

        chars.forEach((c, i) => {
          const cp = Math.min(1, Math.max(0, (p1 * chars.length - i) / (chars.length * 0.15)));
          c.style.color = `rgba(255,255,255,${0.12 + cp * 0.88})`;
        });

        if (textRef.current) {
          textRef.current.style.opacity = String(1 - p2);
        }
      },
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  const chars = QUOTE.split("");

  return (
    <section
      ref={sectionRef}
      style={{ background: "#000000", height: "100vh" }}
    >
      <div
        ref={stickyRef}
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
        }}
      >
        <div ref={textRef} style={{ maxWidth: "900px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-hedvig)",
              fontSize: "clamp(1.6rem, 3.8vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            {chars.map((char, i) => (
              <span
                key={i}
                ref={(el) => { if (el) charsRef.current[i] = el; }}
                style={{ color: "rgba(255,255,255,0.12)", display: "inline", whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
