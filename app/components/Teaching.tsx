"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

/** Splits text into lines and animates each line mask-from-below */
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
    if (tempSpan.offsetWidth > containerWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  document.body.removeChild(tempSpan);

  el.innerHTML = lines
    .map((line) => `<span style="display:block;overflow:hidden;line-height:inherit"><span class="ml" style="display:block">${line}</span></span>`)
    .join("");

  const spans = el.querySelectorAll<HTMLElement>(".ml");
  gsap.set(spans, { y: "110%" });
  gsap.to(spans, {
    y: "0%", duration: 1, stagger: 0.1, ease: "power4.out", delay,
    scrollTrigger: { trigger, start: "top 82%", once: true },
  });
}

export default function Teaching() {
  const { t } = useLanguage();
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);
  const quoteRef    = useRef<HTMLParagraphElement>(null);
  const photoRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      if (headingRef.current) maskLines(headingRef.current, trigger, 0);
      if (bodyRef.current)    maskLines(bodyRef.current,    trigger, 0.15);
      if (quoteRef.current)   maskLines(quoteRef.current,   trigger, 0.3);

      if (photoRef.current) {
        gsap.from(photoRef.current, {
          x: 60, opacity: 0, duration: 1.3, ease: "power4.out",
          scrollTrigger: { trigger, start: "top 80%", once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="teaching"
      ref={sectionRef}
      style={{ background: "#000000", borderTop: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", minHeight: "100vh", maxWidth: "1400px", margin: "0 auto" }}
        className="max-md:!block"
      >
        {/* Left — text */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "10% 8% 10% 6%", borderRight: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Heading — each word masked */}
          <h2
            ref={headingRef}
            style={{
              fontFamily: "var(--font-hedvig)",
              color: "#ffffff",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
            }}
          >
            {t.teaching.heading}
          </h2>

          <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }} />
          </div>

          {/* Body — words masked */}
          <p
            ref={bodyRef}
            style={{
              fontFamily: "var(--font-hedvig)",
              color: "rgba(255,255,255,0.65)",
              fontSize: "17px",
              fontWeight: 400,
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            {t.teaching.body}
          </p>

          <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }} />
          </div>

          {/* Blockquote — words masked */}
          {/* Blockquote with large " behind */}
          <div style={{ position: "relative", margin: 0, padding: "0 0 1.5rem" }}>
            <span style={{
              position: "absolute",
              top: "-2rem",
              left: "-1rem",
              fontFamily: "var(--font-hedvig)",
              color: "rgba(155,96,87,0.25)",
              fontSize: "120px",
              lineHeight: 1,
              userSelect: "none",
              zIndex: 0,
            }}>&ldquo;</span>
            <p
              ref={quoteRef as React.RefObject<HTMLParagraphElement>}
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "var(--font-hedvig)",
                color: "rgba(255,255,255,0.65)",
                fontSize: "17px",
                fontStyle: "italic",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {t.teaching.quote}
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }} />
        </div>

        {/* Right — photo */}
        <div ref={photoRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "stretch" }} className="max-md:min-h-[60vw]">
          <Image
            src="/gia-teaching.webp"
            alt="Gia Jashvili performing"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      </div>
    </section>
  );
}
