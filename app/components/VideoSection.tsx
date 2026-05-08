"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection() {
  const { t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (wrapRef.current) {
        gsap.from(wrapRef.current, {
          opacity: 0, y: 50, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: wrapRef.current, start: "top 80%", once: true },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section style={{ background: "#000000", padding: "0 6% 12vw" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>

          {/* YouTube embed */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
            <iframe
              src="https://www.youtube.com/embed/8cMvb3r38mQ"
              title={t.events.videoCaption}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>

          {/* Caption — overlaps bottom edge, black bg */}
          <div
            style={{
              position: "relative",
              marginTop: "-1px",
              background: "#000000",
              padding: "0.85rem 1.2rem",
              display: "inline-block",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "rgba(255,255,255,0.75)",
                fontSize: "19px",
                fontWeight: 300,
                lineHeight: "21px",
              }}
            >
              {t.events.videoCaption}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
