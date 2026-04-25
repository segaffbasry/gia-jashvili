"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Hero() {
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

          <div style={{ overflow: "hidden" }}>
            <div
              ref={subtitleRef}
              style={{
                fontFamily: '"Hedvig Letters Serif", serif',
                color: "rgba(255,255,255,0.72)",
                fontSize: "clamp(0.75rem, 3.2vw, 25px)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "0.04em",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <span>Violinist</span>
              <span style={{ fontSize: "10px", opacity: 0.6 }}>◆</span>
              <span>Concertmaster</span>
              <span style={{ fontSize: "10px", opacity: 0.6 }}>◆</span>
              <span>Artistic Director</span>
            </div>
          </div>
        </div>

        {/* Bottom half — video */}
        <div ref={imgRef} style={{ height: "60vh", position: "relative", overflow: "hidden" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "25% center" }}
          >
            <source src="/Man_with_glowing_202604200241.mp4" type="video/mp4" />
          </video>
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
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
        >
          <source src="/Man_with_glowing_202604200241.mp4" type="video/mp4" />
        </video>
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
            marginBottom: "1.6rem",
          }}
        >
          Gia Jashvili
        </h1>

        <div style={{ overflow: "hidden" }}>
          <div
            ref={subtitleRef}
            style={{
              fontFamily: '"Hedvig Letters Serif", serif',
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(0.75rem, 3.2vw, 25px)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.04em",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <span>Violinist</span>
            <span style={{ fontSize: "10px", opacity: 0.6 }}>◆</span>
            <span>Concertmaster</span>
            <span style={{ fontSize: "10px", opacity: 0.6 }}>◆</span>
            <span>Artistic Director</span>
          </div>
        </div>
      </div>
    </section>
  );
}
