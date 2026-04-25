"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function splitWords(el: HTMLElement) {
  const words = el.innerText.split(/(\s+)/);
  el.innerHTML = words
    .map((w) =>
      /^\s+$/.test(w)
        ? w
        : `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="gsap-word" style="display:inline-block">${w}</span></span>`
    )
    .join("");
  return el.querySelectorAll<HTMLElement>(".gsap-word");
}

export default function About() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          x: -40, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: imageRef.current, start: "top 80%", once: true },
        });
      }
      if (eyebrowRef.current) {
        gsap.from(eyebrowRef.current, {
          y: 16, opacity: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 85%", once: true },
        });
      }
      if (headingRef.current) {
        const words = splitWords(headingRef.current);
        gsap.from(words, {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.07, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        });
      }
      if (bodyRef.current) {
        const paras = bodyRef.current.querySelectorAll("p");
        gsap.from(paras, {
          y: 24, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 82%", once: true },
        });
      }
      if (statsRef.current) {
        gsap.from(Array.from(statsRef.current.children), {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 88%", once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" style={{ background: "#000000" }} className="py-32 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div ref={imageRef} className="relative">
          <div style={{ background: "#111111", aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 200 300" className="w-32 opacity-10" fill="#e2daca">
              <ellipse cx="100" cy="80" rx="35" ry="45" />
              <rect x="92" y="120" width="16" height="80" />
              <ellipse cx="100" cy="220" rx="40" ry="50" />
            </svg>
          </div>
          <div style={{ border: "1px solid rgba(226,218,202,0.15)" }} className="absolute -bottom-4 -right-4 inset-0 pointer-events-none" />
          <div style={{ background: "#e2daca", width: 20, height: 20 }} className="absolute -top-2.5 -left-2.5" />
        </div>

        <div>
          <p ref={eyebrowRef} style={{ fontFamily: "var(--font-grotesk)", color: "#8f8f8f", fontSize: "11px", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 300 }}>
            About Me
          </p>
          <h2 ref={headingRef} style={{ fontFamily: "var(--font-hedvig)", color: "#e2daca", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 500, lineHeight: 1.15, marginBottom: "2rem" }}>
            A Voice Through the Strings
          </h2>
          <div ref={bodyRef} style={{ fontFamily: "var(--font-grotesk)", color: "#8f8f8f", fontWeight: 300, lineHeight: 1.8, fontSize: "15px" }} className="space-y-5">
            <p>Gia Jashvili is a Georgian concert violinist whose performances blend technical mastery with profound emotional depth. Born in Tbilisi and trained at the Vienna Conservatory, Gia has captivated audiences across Europe, Asia, and the Americas.</p>
            <p>A laureate of multiple international competitions, including the Yehudi Menuhin Violin Competition, Gia brings a rare combination of classical discipline and expressive freedom to every performance.</p>
            <p>His repertoire spans three centuries, from Bach and Beethoven to contemporary Georgian composers whose works he champions on the world stage.</p>
          </div>
          <div ref={statsRef} className="mt-12 flex gap-12">
            {[
              { value: "15+", label: "Years Performing" },
              { value: "40+", label: "Countries Toured" },
              { value: "8", label: "Awards Won" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: "var(--font-hedvig)", color: "#e2daca", fontSize: "2.25rem", fontWeight: 500 }}>{stat.value}</div>
                <div style={{ fontFamily: "var(--font-grotesk)", color: "#8f8f8f", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "0.25rem", fontWeight: 300 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
