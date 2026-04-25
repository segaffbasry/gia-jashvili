"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPHS = [
  "Gia Jashvili is an Austrian violinist with Georgian roots, bridging the Eastern and Western European musical traditions. Renowned for his ability to seamlessly blend the bold, expressive intensity of the Russian violin school with the refined clarity and elegance of the Viennese sound, Gia\u2019s musical journey reflects the profound impact of these traditions, blending technical brilliance with nuanced artistry.",
  "Born into a family of renowned musicians, Gia inherited the tradition of the Russian violin school. He studied with Zakhar Bron in Cologne, refined his Viennese style with Gerhard Schulz in Vienna, and was mentored for over a decade by the legendary Ivry Gitlis, who shaped his artistic voice with a balance of freedom, authenticity, and individuality.",
];

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
  const sectionRef = useRef<HTMLElement>(null);
  const para1Ref   = useRef<HTMLParagraphElement>(null);
  const para2Ref   = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (para1Ref.current) animatePara(para1Ref.current, PARAGRAPHS[0]);
      if (para2Ref.current) animatePara(para2Ref.current, PARAGRAPHS[1]);
    });
    return () => ctx.revert();
  }, []);

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
      <p ref={para1Ref} style={paraStyle}>{PARAGRAPHS[0]}</p>
      <p ref={para2Ref} style={{ ...paraStyle, marginTop: "2.5rem" }}>{PARAGRAPHS[1]}</p>
    </section>
  );
}
