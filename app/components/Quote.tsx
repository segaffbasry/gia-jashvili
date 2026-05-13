"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function Quote() {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const charsRef   = useRef<(HTMLSpanElement | null)[]>([]);

  const chars: string[] = t.quote.split("");

  useEffect(() => {
    // Refs are populated by the time this runs (after DOM commit)
    const els = charsRef.current.filter((el): el is HTMLSpanElement => el !== null);
    if (!els.length || !sectionRef.current) return;

    // Kill any previous ScrollTriggers on this section
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) st.kill();
    });

    gsap.set(els, { color: "rgba(255,255,255,0.12)" });
    if (textRef.current) textRef.current.style.opacity = "1";

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=250%",
      pin: true,
      scrub: 1,
      onUpdate(self) {
        const p1 = Math.min(1, self.progress / 0.6);
        const p2 = Math.max(0, (self.progress - 0.6) / 0.4);

        els.forEach((c, i) => {
          const cp = Math.min(1, Math.max(0, (p1 * els.length - i) / (els.length * 0.15)));
          const r  = Math.round(155 + (255 - 155) * cp);
          const g  = Math.round(96  + (255 - 96)  * cp);
          const b  = Math.round(87  + (255 - 87)  * cp);
          const a  = 0.12 + cp * 0.88;
          c.style.color = cp < 0.5 ? `rgba(${r},${g},${b},${a})` : `rgba(255,255,255,${a})`;
        });

        if (textRef.current) textRef.current.style.opacity = String(1 - p2);
      },
    });

    return () => st.kill();
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      style={{ background: "#000000", height: "100vh" }}
    >
      <div
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
                key={`${locale}-${i}`}
                ref={(el) => { charsRef.current[i] = el; }}
                style={{ color: "rgba(255,255,255,0.12)", display: "inline" }}
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
