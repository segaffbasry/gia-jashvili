"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const event = {
  day: "FRI",
  date: "May 23",
  year: "2026",
  country: "INDONESIA",
  title: "Bruch Violin Concerto",
  program: "Max Bruch, Violin Concerto No. 1 in G minor, Op. 26",
  ensemble: "Jakarta Concert Orchestra",
  role: "Gia Jashvili, solo violin",
  venue: "BALAI RESITAL KERTAGANEGARA, JAKARTA",
};

function maskWords(el: HTMLElement, trigger: Element, delay = 0) {
  const words = el.innerText.split(/(\s+)/);
  el.innerHTML = words
    .map((w) =>
      /^\s+$/.test(w)
        ? w
        : `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="mw" style="display:inline-block">${w}</span></span>`
    )
    .join("");
  const spans = el.querySelectorAll<HTMLElement>(".mw");
  gsap.set(spans, { y: "110%" });
  gsap.to(spans, {
    y: "0%", duration: 1, stagger: 0.08, ease: "power4.out", delay,
    scrollTrigger: { trigger, start: "top 82%", once: true },
  });
}

function maskLines(el: HTMLElement, trigger: Element, delay = 0) {
  const text = el.innerText;
  const containerWidth = el.getBoundingClientRect().width;
  const computed = getComputedStyle(el);
  const tempSpan = document.createElement("span");
  tempSpan.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-size:${computed.fontSize};font-weight:${computed.fontWeight};font-family:${computed.fontFamily};font-style:${computed.fontStyle};line-height:${computed.lineHeight};`;
  document.body.appendChild(tempSpan);
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    tempSpan.textContent = test;
    if (tempSpan.offsetWidth > containerWidth && current) { lines.push(current); current = word; }
    else { current = test; }
  });
  if (current) lines.push(current);
  document.body.removeChild(tempSpan);
  el.innerHTML = lines
    .map((line) => `<span style="display:block;overflow:hidden;line-height:inherit"><span class="ml" style="display:block">${line}</span></span>`)
    .join("");
  const spans = el.querySelectorAll<HTMLElement>(".ml");
  gsap.set(spans, { y: "110%" });
  gsap.to(spans, {
    y: "0%", duration: 0.9, stagger: 0.08, ease: "power4.out", delay,
    scrollTrigger: { trigger, start: "top 82%", once: true },
  });
}

export default function Events() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sectionRef      = useRef<HTMLElement>(null);
  const calendarRef     = useRef<HTMLSpanElement>(null);
  const titleRef        = useRef<HTMLDivElement>(null);
  const programRef      = useRef<HTMLDivElement>(null);
  const ensembleRef     = useRef<HTMLDivElement>(null);
  const roleRef         = useRef<HTMLDivElement>(null);
  const venueRef        = useRef<HTMLDivElement>(null);
  const dateColRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      if (calendarRef.current) maskWords(calendarRef.current, trigger, 0);

      // date column fade in
      if (dateColRef.current) {
        gsap.from(dateColRef.current, {
          opacity: 0, y: 20, duration: 0.9, ease: "power4.out",
          scrollTrigger: { trigger, start: "top 82%", once: true },
        });
      }

      if (titleRef.current)    maskWords(titleRef.current,    trigger, 0.1);
      if (programRef.current)  maskLines(programRef.current,  trigger, 0.2);
      if (ensembleRef.current) maskLines(ensembleRef.current, trigger, 0.28);
      if (roleRef.current)     maskLines(roleRef.current,     trigger, 0.34);
      if (venueRef.current)    maskLines(venueRef.current,    trigger, 0.4);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="events"
      ref={sectionRef}
      style={{ background: "#000000" }}
    >
      <div
        style={{
          display: isMobile ? "block" : "grid",
          gridTemplateColumns: "1fr 1.4fr",
          minHeight: "100vh",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Left — sticky CALENDAR label (desktop only) */}
        {!isMobile && (
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <div>
              <span
                ref={calendarRef}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "#ffffff",
                  fontSize: "60px",
                  fontWeight: 300,
                  lineHeight: "72px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                CALENDAR
              </span>
            </div>
          </div>
        )}

        {/* Mobile label */}
        {isMobile && (
          <div style={{ padding: "4rem 6% 2rem" }}>
            <span
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "#ffffff",
                fontSize: "40px",
                fontWeight: 300,
                lineHeight: "48px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              CALENDAR
            </span>
          </div>
        )}

        {/* Right — single event */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "10% 6% 10% 5%",
          }}
          className="max-md:!pt-0"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr",
              gap: "0 2.5rem",
            }}
          >
            {/* Date column */}
            <div ref={dateColRef} style={{ textAlign: "center", paddingTop: "6px" }}>
              <div
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "14px",
                  fontWeight: 300,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {event.day}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "#ffffff",
                  fontSize: "28px",
                  fontWeight: 300,
                  lineHeight: "28px",
                }}
              >
                {event.date}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "13px",
                  fontWeight: 300,
                  marginTop: "4px",
                }}
              >
                {event.year}
              </div>
            </div>

            {/* Info column */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "14px",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  display: "inline-block",
                  paddingBottom: "2px",
                  marginBottom: "14px",
                }}
              >
                {event.country}
              </div>

              <div
                ref={titleRef}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "#ffffff",
                  fontSize: "28px",
                  fontWeight: 300,
                  lineHeight: "1.35",
                  marginBottom: "20px",
                }}
              >
                {event.title}
              </div>

              <div
                ref={programRef}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "19px",
                  fontWeight: 300,
                  lineHeight: "1.5",
                  marginBottom: "6px",
                }}
              >
                {event.program}
              </div>

              <div
                ref={ensembleRef}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: "1.6",
                }}
              >
                {event.ensemble}
              </div>

              <div
                ref={roleRef}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: "1.6",
                  marginBottom: "14px",
                }}
              >
                {event.role}
              </div>

              <div
                ref={venueRef}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                  fontWeight: 300,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {event.venue}
              </div>

              <a
                href="#contact"
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "16px",
                  fontWeight: 300,
                  fontStyle: "italic",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                tickets
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
