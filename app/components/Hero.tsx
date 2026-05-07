"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const titles = [t.hero.violinist, t.hero.concertmaster, t.hero.artisticDirector];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    if (imgRef.current) {
      gsap.set(imgRef.current, { opacity: 0 });
      tl.to(imgRef.current, { opacity: 1, duration: 1.6 }, 0);
    }

    if (nameRef.current) {
      const words = nameRef.current.innerText.split(/(\s+)/);
      nameRef.current.innerHTML = words
        .map((w) =>
          /^\s+$/.test(w)
            ? w
            : `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.1"><span class="hw" style="display:inline-block">${w}</span></span>`
        )
        .join("");
      const spans = nameRef.current.querySelectorAll<HTMLElement>(".hw");
      gsap.set(spans, { y: "110%" });
      tl.to(spans, { y: "0%", duration: 1.1, stagger: 0.14 }, 0.5);
    }

    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { y: "110%" });
      tl.to(subtitleRef.current, { y: "0%", duration: 0.9 }, 1.1);
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <section
        id="home"
        style={{ background: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* Top half — black + centered text */}
        <div
          style={{
            flex: 1,
            background: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "5rem 6% 2rem",
          }}
        >
          <h1
            ref={nameRef}
            style={{
              fontFamily: '"Hedvig Letters Serif", serif',
              color: "#ffffff",
              fontSize: "clamp(2.4rem, 11vw, 80px)",
              fontWeight: 300,
              lineHeight: "1.2",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1.2rem",
            }}
          >
            Gia Jashvili
          </h1>

          <div ref={subtitleRef} style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            {/* Left deco line */}
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none" style={{ opacity: 0.8, flexShrink: 0 }}>
              <line x1="0" y1="4" x2="28" y2="4" stroke="var(--color-accent)" strokeWidth="0.8"/>
              <polygon points="30,4 34,1.5 34,6.5" fill="var(--color-accent)" opacity="0.7"/>
            </svg>

            {titles.map((title, i) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                {i > 0 && (
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="3" y="0" width="4.24" height="4.24" transform="rotate(45 3 0)" fill="var(--color-accent)" opacity="0.7"/>
                  </svg>
                )}
                <span style={{
                  fontFamily: '"Hedvig Letters Serif", serif',
                  color: "var(--color-accent)",
                  fontSize: "clamp(0.65rem, 2.5vw, 12px)",
                  fontWeight: 400,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {title}
                </span>
              </div>
            ))}

            {/* Right deco line */}
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none" style={{ opacity: 0.8, flexShrink: 0 }}>
              <polygon points="2,4 6,1.5 6,6.5" fill="var(--color-accent)" opacity="0.7"/>
              <line x1="8" y1="4" x2="36" y2="4" stroke="var(--color-accent)" strokeWidth="0.8"/>
            </svg>
          </div>
        </div>

        {/* Bottom half — image */}
        <div ref={imgRef} style={{ height: "60vh", position: "relative", overflow: "hidden" }}>
          <Image
            src="/hero-mobile.png"
            alt="Gia Jashvili"
            fill
            style={{ objectFit: "cover", objectPosition: "25% center" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, transparent 0%, #000000 100%)" }} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      style={{ background: "#000", position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <div ref={imgRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/hero-desktop.png"
          alt="Gia Jashvili"
          fill
          style={{ objectFit: "cover", objectPosition: "40% 30%" }}
          priority
        />

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "220px", background: "linear-gradient(to bottom, transparent 0%, #000000 100%)", zIndex: 1 }} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 6%",
        }}
      >
        <h1
          ref={nameRef}
          style={{
            fontFamily: '"Hedvig Letters Serif", serif',
            color: "#ffffff",
            fontSize: "clamp(2.4rem, 11vw, 80px)",
            fontWeight: 300,
            lineHeight: "1.2",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1.6rem",
          }}
        >
          Gia Jashvili
        </h1>

          <div ref={subtitleRef} style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            {/* Left deco line */}
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none" style={{ opacity: 0.8, flexShrink: 0 }}>
              <line x1="0" y1="4" x2="28" y2="4" stroke="var(--color-accent)" strokeWidth="0.8"/>
              <polygon points="30,4 34,1.5 34,6.5" fill="var(--color-accent)" opacity="0.7"/>
            </svg>

            {titles.map((title, i) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                {i > 0 && (
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="none" style={{ flexShrink: 0 }}>
                    <rect x="3" y="0" width="4.24" height="4.24" transform="rotate(45 3 0)" fill="var(--color-accent)" opacity="0.7"/>
                  </svg>
                )}
                <span style={{
                  fontFamily: '"Hedvig Letters Serif", serif',
                  color: "var(--color-accent)",
                  fontSize: "12px",
                  fontWeight: 400,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  {title}
                </span>
              </div>
            ))}

            {/* Right deco line */}
            <svg width="36" height="8" viewBox="0 0 36 8" fill="none" style={{ opacity: 0.8, flexShrink: 0 }}>
              <polygon points="2,4 6,1.5 6,6.5" fill="var(--color-accent)" opacity="0.7"/>
              <line x1="8" y1="4" x2="36" y2="4" stroke="var(--color-accent)" strokeWidth="0.8"/>
            </svg>
          </div>
      </div>
    </section>
  );
}
