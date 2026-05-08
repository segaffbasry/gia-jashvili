"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
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
      tl.to(imgRef.current, { opacity: 1, duration: 2 }, 0);
    }

    if (nameRef.current) {
      const text = nameRef.current.innerText;
      nameRef.current.innerHTML = text
        .split("")
        .map((ch) =>
          ch === " "
            ? `<span style="display:inline-block;width:0.55em"> </span>`
            : `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15"><span class="hl" style="display:inline-block">${ch}</span></span>`
        )
        .join("");
      const letters = nameRef.current.querySelectorAll<HTMLElement>(".hl");
      gsap.set(letters, { y: "115%", opacity: 0 });
      tl.to(letters, {
        y: "0%",
        opacity: 1,
        duration: 1.0,
        stagger: 0.045,
        ease: "power3.out",
      }, 0.3);
    }

    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0, transformOrigin: "center center" });
      tl.to(lineRef.current, { scaleX: 1, opacity: 1, duration: 1.0, ease: "power3.inOut" }, 1.2);
    }

    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0 });
      tl.to(subtitleRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" }, 1.5);
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <section
        id="home"
        style={{ background: "#000", minHeight: "100vh", position: "relative", overflow: "hidden" }}
      >
        {/* Full-bleed background image */}
        <div ref={imgRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/hero-mobile.png"
            alt="Gia Jashvili"
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "160px", background: "linear-gradient(to bottom, transparent 0%, #000000 100%)" }} />
        </div>

        {/* Text overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "6rem 6% 4rem",
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

          <div ref={lineRef} style={{ width: "clamp(160px, 50vw, 360px)", margin: "1.2rem auto", position: "relative", height: "6px", display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 0%, rgba(135,122,114,0.2) 20%, rgba(135,122,114,0.45) 50%, rgba(135,122,114,0.2) 80%, transparent 100%)", filter: "blur(5px)" }} />
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", transform: "translateY(-50%)", background: "linear-gradient(to right, transparent 0%, rgba(135,122,114,0.5) 15%, #877a72 38%, #a09690 50%, #877a72 62%, rgba(135,122,114,0.5) 85%, transparent 100%)" }} />
            <div style={{ position: "absolute", top: "50%", left: "35%", right: "35%", height: "1px", transform: "translateY(-50%)", background: "linear-gradient(to right, transparent, rgba(135,122,114,0.9), #ffffff, rgba(135,122,114,0.9), transparent)", opacity: 0.75 }} />
          </div>

          <div ref={subtitleRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
            {titles.map((title) => (
              <span key={title} style={{
                fontFamily: '"Hedvig Letters Serif", serif',
                color: "rgba(255,255,255,0.7)",
                fontSize: "clamp(0.6rem, 2.8vw, 11px)",
                fontWeight: 400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {title}
              </span>
            ))}
          </div>
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
          style={{ objectFit: "cover", objectPosition: "40% 15%" }}
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
          alignItems: "flex-end",
          justifyContent: "center",
          textAlign: "right",
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
            marginBottom: "1.2rem",
          }}
        >
          Gia Jashvili
        </h1>

        <div ref={lineRef} style={{ width: "clamp(200px, 40vw, 480px)", margin: "0.6rem 60px 1.2rem 0", alignSelf: "flex-end", position: "relative", height: "6px", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 0%, rgba(135,122,114,0.2) 20%, rgba(135,122,114,0.45) 50%, rgba(135,122,114,0.2) 80%, transparent 100%)", filter: "blur(5px)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", transform: "translateY(-50%)", background: "linear-gradient(to right, transparent 0%, rgba(135,122,114,0.5) 15%, #877a72 38%, #a09690 50%, #877a72 62%, rgba(135,122,114,0.5) 85%, transparent 100%)" }} />
          <div style={{ position: "absolute", top: "50%", left: "35%", right: "35%", height: "1px", transform: "translateY(-50%)", background: "linear-gradient(to right, transparent, rgba(135,122,114,0.9), #ffffff, rgba(135,122,114,0.9), transparent)", opacity: 0.75 }} />
        </div>

          <div ref={subtitleRef} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "2rem", alignSelf: "flex-end", marginRight: "55px" }}>
            {titles.map((title) => (
              <span key={title} style={{
                fontFamily: '"Hedvig Letters Serif", serif',
                color: "rgba(255,255,255,0.7)",
                fontSize: "12px",
                fontWeight: 400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}>
                {title}
              </span>
            ))}
          </div>
      </div>
    </section>
  );
}
