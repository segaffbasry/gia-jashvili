"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pieces = [
  { composer: "Johann Sebastian Bach", work: "Chaconne in D minor", catalog: "BWV 1004", era: "Baroque" },
  { composer: "Ludwig van Beethoven", work: "Violin Concerto in D major", catalog: "Op. 61", era: "Classical" },
  { composer: "Johannes Brahms", work: "Violin Sonata No. 1", catalog: "Op. 78", era: "Romantic" },
  { composer: "Pyotr Ilyich Tchaikovsky", work: "Violin Concerto in D major", catalog: "Op. 35", era: "Romantic" },
  { composer: "Béla Bartók", work: "Violin Concerto No. 2", catalog: "BB 117", era: "Modern" },
  { composer: "Giya Kancheli", work: "Styx", catalog: "1999", era: "Contemporary" },
];

function Card({ piece, index }: { piece: typeof pieces[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "2rem",
        border: `1px solid ${hovered ? "rgba(226,218,202,0.25)" : "rgba(226,218,202,0.07)"}`,
        background: hovered ? "rgba(226,218,202,0.03)" : "transparent",
        cursor: "default",
        transition: "all 0.35s ease",
        transitionDelay: `${index * 70}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div style={{ fontFamily: "var(--font-grotesk)", color: "#8f8f8f", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 300 }}>
        {piece.era}
      </div>
      <h3 style={{ fontFamily: "var(--font-hedvig)", color: hovered ? "#e2daca" : "rgba(226,218,202,0.8)", fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.5rem", transition: "color 0.3s" }}>
        {piece.work}
      </h3>
      <p style={{ fontFamily: "var(--font-grotesk)", color: "#8f8f8f", fontSize: "13px", fontWeight: 300 }}>
        {piece.composer}
      </p>
      <p style={{ fontFamily: "var(--font-grotesk)", color: "rgba(143,143,143,0.5)", fontSize: "11px", marginTop: "0.25rem" }}>
        {piece.catalog}
      </p>
    </div>
  );
}

export default function Repertoire() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (eyebrowRef.current) {
        gsap.from(eyebrowRef.current, {
          y: 16, opacity: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 85%", once: true },
        });
      }
      if (headingRef.current) {
        const words = headingRef.current.innerText.split(/(\s+)/);
        headingRef.current.innerHTML = words
          .map((w) => /^\s+$/.test(w) ? w : `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="gw" style="display:inline-block">${w}</span></span>`)
          .join("");
        gsap.from(headingRef.current.querySelectorAll(".gw"), {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.09, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        });
      }
      if (gridRef.current) {
        gsap.from(Array.from(gridRef.current.children), {
          y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="repertoire" style={{ background: "#000000", borderTop: "1px solid rgba(226,218,202,0.07)" }} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p ref={eyebrowRef} style={{ fontFamily: "var(--font-grotesk)", color: "#8f8f8f", fontSize: "11px", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 300 }}>
            Repertoire
          </p>
          <h2 ref={headingRef} style={{ fontFamily: "var(--font-hedvig)", color: "#e2daca", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 500 }}>
            Selected Works
          </h2>
        </div>
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pieces.map((piece, i) => (
            <Card key={piece.work} piece={piece} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
