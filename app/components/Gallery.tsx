"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const itemsMeta = [
  { src: "/gia-ivry-gitlis.jpg",        caption: "Gia Jashvili & Ivry Gitlis", align: "left" as const,         aspect: "16/10", width: 680 },
  { src: "/gia-joshua-bell-concert.jpg", caption: "Gia Jashvili",              align: "center-left" as const,  aspect: "16/10", width: 640 },
  { src: "/gia-perform-japan.JPG",       caption: "Gia Jashvili",              align: "center-right" as const, aspect: "16/10", width: 660 },
  { src: "/gia-solo-perform.JPG",        caption: "Gia Jashvili",              align: "left" as const,         aspect: "3/4",   width: 480 },
];

type Align = "left" | "right" | "center-left" | "center-right";

function getMargin(align: Align) {
  switch (align) {
    case "left":         return { marginLeft: "10%",  marginRight: "auto" };
    case "right":        return { marginLeft: "auto",  marginRight: "8%" };
    case "center-left":  return { marginLeft: "18%",  marginRight: "auto" };
    case "center-right": return { marginLeft: "auto",  marginRight: "18%" };
  }
}

const PARALLAX_AMOUNTS = [20, -25, 18, -20, 22];

function GalleryItem({ item, index }: { item: typeof itemsMeta[0] & { label: string; sub: string }; index: number }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLSpanElement>(null);
  const line2Ref   = useRef<HTMLSpanElement>(null);
  const line3Ref   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapRef.current) return;

      // Image slides up — triggers when the image itself hits 75% viewport
      if (imgRef.current) {
        gsap.set(imgRef.current, { y: 60, opacity: 0 });
        gsap.to(imgRef.current, {
          y: 0, opacity: 1, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: imgRef.current, start: "top 75%", once: true },
        });

        // Parallax scroll — subtle Y movement per image
        const amount = PARALLAX_AMOUNTS[index] ?? 20;
        gsap.to(imgInnerRef.current, {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: imgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Caption lines — each triggers when the IMAGE bottom edge crosses 80%
      // so captions only appear after the image is visible
      const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean);
      lines.forEach((el, i) => {
        gsap.set(el, { y: "110%" });
        gsap.to(el, {
          y: "0%",
          duration: 0.85,
          ease: "power4.out",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: imgRef.current,   // tied to this item's image, not the section
            start: "bottom 80%",       // fires when bottom of image crosses 80%
            once: true,
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  // GSAP hover zoom on inner image
  const handleMouseEnter = () => {
    if (imgInnerRef.current)
      gsap.to(imgInnerRef.current, { scale: 1.06, duration: 0.9, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    if (imgInnerRef.current)
      gsap.to(imgInnerRef.current, { scale: 1, duration: 1.1, ease: "power2.out" });
  };

  return (
    <div
      ref={wrapRef}
      style={{
        paddingTop: index === 0 ? "8vw" : "18vw",
        paddingBottom: "2vw",
        ...getMargin(item.align),
        width: item.width,
        maxWidth: "90vw",
      }}
    >
      {/* overflow:hidden on outer, GSAP scales the inner */}
      <div
        ref={imgRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ width: "100%", aspectRatio: item.aspect, overflow: "hidden", position: "relative", cursor: "pointer" }}
      >
        <div ref={imgInnerRef} style={{ width: "100%", height: "100%", willChange: "transform" }}>
          {item.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.src} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%)" }}>
              <span style={{ fontFamily: "var(--font-hedvig)", color: "rgba(255,255,255,0.1)", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Photo Coming Soon</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
        {/* Line 1 — label */}
        <div style={{ overflow: "hidden", marginBottom: "4px" }}>
          <span ref={line1Ref} style={{ display: "inline-block", fontFamily: "var(--font-hedvig)", color: "#ffffff", fontSize: "16px", fontWeight: 400 }}>
            {item.label}
          </span>
        </div>
        {/* Line 2 — sub */}
        <div style={{ overflow: "hidden" }}>
          <span ref={line2Ref} style={{ display: "inline-block", fontFamily: "var(--font-hedvig)", color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic", lineHeight: 1.6 }}>
            {item.sub}
          </span>
        </div>
        {/* Line 3 — caption */}
        <div style={{ overflow: "hidden" }}>
          <span ref={line3Ref} style={{ display: "inline-block", fontFamily: "var(--font-hedvig)", color: "rgba(255,255,255,0.4)", fontSize: "14px", fontStyle: "italic", lineHeight: 1.6 }}>
            {item.caption}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const { t } = useLanguage();
  const items = itemsMeta.map((m, i) => ({ ...m, label: t.gallery.items[i].label, sub: t.gallery.items[i].sub }));

  return (
    <section id="gallery" style={{ background: "#000000", paddingBottom: "14vw", overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        {items.map((item, i) => <GalleryItem key={i} item={item} index={i} />)}
      </div>
    </section>
  );
}
