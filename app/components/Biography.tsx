"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function animatePara(para: HTMLParagraphElement, text: string) {
  const containerWidth = para.getBoundingClientRect().width;
  const computedFontSize = getComputedStyle(para).fontSize;
  const tempSpan = document.createElement("span");
  tempSpan.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    font-size: ${computedFontSize};
    font-weight: 300;
    font-family: ${getComputedStyle(para).fontFamily};
    letter-spacing: -0.01em;
  `;
  document.body.appendChild(tempSpan);

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const test = currentLine ? `${currentLine} ${word}` : word;
    tempSpan.textContent = test;
    if (tempSpan.offsetWidth > containerWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  });
  if (currentLine) lines.push(currentLine);
  document.body.removeChild(tempSpan);

  para.innerHTML = lines
    .map(
      (line) =>
        `<span style="display:block;overflow:hidden;line-height:1.5"><span class="bio-line" style="display:block">${line}</span></span>`
    )
    .join("");

  const lineEls = para.querySelectorAll<HTMLElement>(".bio-line");
  gsap.set(lineEls, { y: "105%" });
  gsap.to(lineEls, {
    y: "0%",
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.09,
    scrollTrigger: { trigger: para, start: "top 85%", once: true },
  });
}

export default function Biography() {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const para1Ref   = useRef<HTMLParagraphElement>(null);
  const para2Ref   = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (para1Ref.current) animatePara(para1Ref.current, t.biography.p1);
      if (para2Ref.current) animatePara(para2Ref.current, t.biography.p2);
    });
    return () => ctx.revert();
  }, [locale, t]);

  const paraStyle: React.CSSProperties = {
    fontFamily: "var(--font-hedvig)",
    color: "#ffffff",
    fontSize: "clamp(1.1rem, 4.2vw, 36px)",
    fontWeight: 200,
    lineHeight: 1.5,
    letterSpacing: "-0.01em",
    margin: 0,
  };

  return (
    <section id="about" ref={sectionRef} style={{ background: "#000000", padding: "8vw 6% 10vw" }}>
      <p ref={para1Ref} style={paraStyle}>{t.biography.p1}</p>
      <p ref={para2Ref} style={{ ...paraStyle, marginTop: "2.5rem" }}>{t.biography.p2}</p>
    </section>
  );
}
