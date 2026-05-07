"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

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
    y: "0%", duration: 1, stagger: 0.1, ease: "power4.out", delay,
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

export default function Contact() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sectionRef   = useRef<HTMLElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const descRef      = useRef<HTMLDivElement>(null);
  const emailRef     = useRef<HTMLAnchorElement>(null);
  const phoneRef     = useRef<HTMLAnchorElement>(null);
  const photoRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      if (headingRef.current)  maskWords(headingRef.current,  trigger, 0);
      if (labelRef.current)    maskLines(labelRef.current,    trigger, 0.15);
      if (descRef.current)     maskLines(descRef.current,     trigger, 0.25);

      const contactLines = [emailRef.current, phoneRef.current].filter(Boolean);
      contactLines.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 12 });
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.7, ease: "power4.out", delay: 0.4 + i * 0.1,
          scrollTrigger: { trigger, start: "top 82%", once: true },
        });
      });

      if (photoRef.current) {
        gsap.from(photoRef.current, {
          opacity: 0, y: 50, duration: 1.3, ease: "power4.out", delay: 0.1,
          scrollTrigger: { trigger, start: "top 82%", once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ background: "#000000", padding: "14vw 0 12vw" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 6%",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            gap: isMobile ? "2.5rem" : 0,
            width: isMobile ? "100%" : "auto",
          }}
        >
          {/* Left text */}
          <div
            style={{
              width: isMobile ? "100%" : "360px",
              flexShrink: 0,
              paddingRight: isMobile ? 0 : "3rem",
              paddingTop: "1rem",
            }}
          >
            <h2
              ref={headingRef}
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "#ffffff",
                fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
                fontWeight: 400,
                letterSpacing: "0.03em",
                marginBottom: "2.5rem",
                lineHeight: 1,
              }}
            >
              {t.contact.heading}
            </h2>

            <div
              ref={labelRef}
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "var(--color-accent)",
                fontSize: "20px",
                fontWeight: 300,
                lineHeight: "26px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.4rem",
              }}
            >
              {t.contact.label}
            </div>

            <div
              ref={descRef}
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "#ffffff",
                fontSize: isMobile ? "22px" : "32px",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: isMobile ? "28px" : "38px",
                marginBottom: "1rem",
              }}
            >
              {t.contact.description}
            </div>

            <a
              ref={emailRef}
              href="mailto:giajashvili@gmail.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                fontFamily: "var(--font-hedvig)",
                color: "rgba(255,255,255,0.55)",
                fontSize: "20px",
                fontWeight: 300,
                lineHeight: "26px",
                textDecoration: "none",
                marginBottom: "0.4rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              <svg width="16" height="13" viewBox="0 0 15 12" fill="none" style={{ opacity: 0.5, flexShrink: 0 }}>
                <rect x="0.5" y="0.5" width="14" height="11" rx="1.5" stroke="currentColor"/>
                <path d="M1 1.5L7.5 7L14 1.5" stroke="currentColor" strokeLinecap="round"/>
              </svg>
              giajashvili@gmail.com
            </a>

            <a
              ref={phoneRef}
              href="tel:+4917088887888"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                fontFamily: "var(--font-hedvig)",
                color: "rgba(255,255,255,0.55)",
                fontSize: "20px",
                fontWeight: 300,
                lineHeight: "26px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.5, flexShrink: 0 }}>
                <path d="M13 10.33v1.84A1.22 1.22 0 0 1 11.67 13.4a12.1 12.1 0 0 1-5.28-1.88A11.93 11.93 0 0 1 2.72 7.9 12.1 12.1 0 0 1 .84 2.6 1.22 1.22 0 0 1 2.02.6h1.84c.6 0 1.11.44 1.2 1.03.08.52.21 1.03.4 1.52.15.4.05.84-.27 1.13L4.44 5.03a9.54 9.54 0 0 0 3.53 3.53l.75-.75c.29-.3.73-.4 1.13-.27.49.18 1 .32 1.52.4.6.09 1.04.6 1.63 1.39z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +49 170 8887888
            </a>
          </div>

          {/* Right — photo */}
          <div
            ref={photoRef}
            style={{
              width: isMobile ? "100%" : "418px",
              height: isMobile ? "260px" : "623px",
              flexShrink: 0,
              marginTop: isMobile ? 0 : "-4.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src="/gia-photo.png"
              alt="Gia Jashvili"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
