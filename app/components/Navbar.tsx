"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Biography", href: "#about" },
  { label: "Concerts", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Teaching", href: "#teaching" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef(0);
  const translateRef = useRef(0);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number>(0);

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const overlayBgRef = useRef<HTMLDivElement>(null);

  // Detect breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Desktop: smooth hide/show + blur on scroll
  useEffect(() => {
    if (isMobile) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const animate = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      const blurTarget = Math.min(scrollY / 120, 1);
      blurRef.current += (blurTarget - blurRef.current) * 0.08;

      const hideTarget = scrollY > 80 && delta > 0 ? -100 : 0;
      translateRef.current += (hideTarget - translateRef.current) * 0.05;

      const nav = navRef.current;
      const bg = bgRef.current;

      if (nav) nav.style.transform = `translateY(${translateRef.current}%)`;

      if (bg) {
        const v = blurRef.current;
        if (v < 0.01) {
          bg.style.backdropFilter = "none";
          (bg.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter = "none";
          bg.style.opacity = "0";
        } else {
          bg.style.backdropFilter = `blur(${v * 18}px)`;
          (bg.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter = `blur(${v * 18}px)`;
          bg.style.opacity = "1";
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile]);

  // Build GSAP timeline for overlay open/close
  const buildTimeline = useCallback(() => {
    if (!overlayRef.current) return;

    tlRef.current?.kill();

    const tl = gsap.timeline({ paused: true });

    // Overlay background wipes down from top
    tl.fromTo(
      overlayRef.current,
      { clipPath: "inset(0 0 100% 0)", pointerEvents: "none" },
      { clipPath: "inset(0 0 0% 0)", pointerEvents: "all", duration: 0.68, ease: "expo.inOut" }
    );

    // Subtle dark panel behind links
    if (overlayBgRef.current) {
      tl.fromTo(
        overlayBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.36, ease: "power2.out" },
        0.14
      );
    }

    // Hamburger lines → X
    tl.to(line1Ref.current, { y: 8, rotate: 45, duration: 0.32, ease: "power3.inOut" }, 0);
    tl.to(line2Ref.current, { scaleX: 0, opacity: 0, duration: 0.18, ease: "power2.in" }, 0);
    tl.to(line3Ref.current, { y: -8, rotate: -45, duration: 0.32, ease: "power3.inOut" }, 0);

    // Nav links stagger up from below with clip reveal
    tl.fromTo(
      linkRefs.current.filter(Boolean),
      { y: 60, opacity: 0, skewY: 3 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.54, stagger: 0.07, ease: "power3.out" },
      0.27
    );

    tlRef.current = tl;
  }, []);

  useEffect(() => {
    buildTimeline();
  }, [buildTimeline, isMobile]);

  useEffect(() => {
    if (!tlRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
    } else {
      document.body.style.overflow = "";
      tlRef.current.reverse();
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Auto-close on resize to desktop
  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const delay = 500;
    setTimeout(() => {
      const id = href.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, delay);
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          willChange: "transform",
        }}
      >
        {/* Blurred backdrop (desktop) */}
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: isMobile ? "space-between" : "center",
            alignItems: "center",
            padding: isMobile ? "1.25rem 1.5rem" : "1.5rem 2rem",
            gap: isMobile ? 0 : "3rem",
          }}
        >
          {/* Mobile: name left */}
          {isMobile && (
            <span
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontStyle: "italic",
                letterSpacing: "0.08em",
                opacity: 0.9,
              }}
            >
              GIA JASHVILI
            </span>
          )}

          {/* Desktop links */}
          {!isMobile &&
            navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  opacity: 0.9,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
              >
                {link.label}
              </a>
            ))}

          {/* Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                zIndex: 110,
                position: "relative",
              }}
            >
              <span
                ref={line1Ref}
                style={{
                  display: "block",
                  width: 26,
                  height: 1.5,
                  background: "#ffffff",
                  transformOrigin: "center",
                  borderRadius: 2,
                }}
              />
              <span
                ref={line2Ref}
                style={{
                  display: "block",
                  width: 26,
                  height: 1.5,
                  background: "#ffffff",
                  transformOrigin: "center",
                  borderRadius: 2,
                }}
              />
              <span
                ref={line3Ref}
                style={{
                  display: "block",
                  width: 26,
                  height: 1.5,
                  background: "#ffffff",
                  transformOrigin: "center",
                  borderRadius: 2,
                }}
              />
            </button>
          )}
        </div>
      </nav>

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 95,
          pointerEvents: "none",
          clipPath: "inset(0 0 100% 0)",
          overflow: "hidden",
        }}
      >
        {/* Background — black with progressive blur */}
        <div
          ref={overlayBgRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,1) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            opacity: 0,
          }}
        />

        {/* Subtle diagonal grain texture via gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Links — centered */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1.5rem, 4vw, 2.5rem)",
            paddingTop: "5rem",
          }}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              ref={(el) => { linkRefs.current[i] = el; }}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              style={{
                fontFamily: "var(--font-hedvig)",
                color: "#ffffff",
                fontSize: "clamp(2.2rem, 9vw, 4rem)",
                fontStyle: "italic",
                fontWeight: 500,
                letterSpacing: "0.02em",
                textDecoration: "none",
                opacity: 0.9,
                textAlign: "center",
                display: "block",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.35")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
            >
              {link.label}
            </a>
          ))}

          {/* Footer detail inside overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            {["Instagram", "YouTube"].map((s) => (
              <a
                key={s}
                href={s === "Instagram" ? "https://www.instagram.com/giaviolin/" : "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-hedvig)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
