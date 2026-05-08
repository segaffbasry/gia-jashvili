"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Languages } from "lucide-react";
import gsap from "gsap";
import { useLanguage } from "../context/LanguageContext";
import { Locale } from "../translations";

const navHrefs = ["#home", "#about", "#events", "#gallery", "#teaching", "#contact"];

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "id", label: "Indonesia" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ka", label: "ქართული" },
];

const FONT: React.CSSProperties = {
  fontFamily: "var(--font-hedvig)",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  fontWeight: 400,
  lineHeight: "1em",
  whiteSpace: "pre" as const,
};

function LangDropdown({ locale, setLocale, langOpen, setLangOpen }: {
  locale: Locale; setLocale: (l: Locale) => void;
  langOpen: boolean; setLangOpen: (v: boolean) => void;
}) {
  const panelRef  = useRef<HTMLDivElement>(null);
  const itemsRef  = useRef<(HTMLButtonElement | null)[]>([]);
  const tweenRef  = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    tweenRef.current?.kill();

    if (langOpen) {
      gsap.set(panelRef.current, { display: "block" });
      const tl = gsap.timeline();
      tl.fromTo(panelRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.38, ease: "expo.out" }
      );
      tl.fromTo(itemsRef.current.filter(Boolean),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, stagger: 0.055, ease: "power3.out" },
        0.1
      );
      tweenRef.current = tl;
    } else {
      const tl = gsap.timeline({ onComplete: () => { if (panelRef.current) gsap.set(panelRef.current, { display: "none" }); } });
      tl.to(itemsRef.current.filter(Boolean), { y: -6, opacity: 0, duration: 0.18, stagger: 0.03, ease: "power2.in" });
      tl.to(panelRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 0, duration: 0.28, ease: "expo.in" }, 0.06);
      tweenRef.current = tl;
    }
  }, [langOpen]);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setLangOpen(!langOpen)}
        aria-label="Select language"
        style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "0.35rem",
          color: langOpen ? "#cac2b6" : "rgba(255,255,255,0.75)",
          padding: "4px 6px", transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#cac2b6")}
        onMouseLeave={(e) => { if (!langOpen) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
      >
        <Languages size={16} strokeWidth={1.5} />
        <span style={{ fontFamily: "var(--font-hedvig)", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {locale.toUpperCase()}
        </span>
      </button>

      <div
        ref={panelRef}
        style={{
          display: "none",
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
          minWidth: "140px",
          zIndex: 300,
          overflow: "hidden",
        }}
        onMouseLeave={() => setLangOpen(false)}
      >
        {/* top accent line */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #cac2b6, transparent)" }} />
        {LOCALES.map(({ code, label }, i) => (
          <button
            key={code}
            ref={(el) => { itemsRef.current[i] = el; }}
            onClick={() => { setLocale(code); setLangOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              width: "100%", background: "none", border: "none", cursor: "pointer",
              textAlign: "left", padding: "0.65rem 1rem",
              fontFamily: "var(--font-hedvig)", fontSize: "0.78rem", letterSpacing: "0.05em",
              color: code === locale ? "#cac2b6" : "rgba(255,255,255,0.6)",
              borderBottom: i < LOCALES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              transition: "color 0.15s, padding-left 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.paddingLeft = "1.3rem"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = code === locale ? "#cac2b6" : "rgba(255,255,255,0.6)"; e.currentTarget.style.paddingLeft = "1rem"; }}
          >
            {code === locale && <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#cac2b6", flexShrink: 0 }} />}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NavLink({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const lineRef    = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.set(wrapperRef.current.querySelectorAll<HTMLElement>(".nl-d"), { yPercent: 0 });
    gsap.set(wrapperRef.current.querySelectorAll<HTMLElement>(".nl-h"), { yPercent: 100 });
    if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0 });
  }, [label]);

  const enter = () => {
    if (!wrapperRef.current) return;
    const d = Array.from(wrapperRef.current.querySelectorAll<HTMLElement>(".nl-d"));
    const h = Array.from(wrapperRef.current.querySelectorAll<HTMLElement>(".nl-h"));
    gsap.killTweensOf([...d, ...h, lineRef.current]);
    gsap.to(d, { yPercent: -100, duration: 0.4, stagger: 0.025, ease: "power3.inOut" });
    gsap.to(h, { yPercent: 0,    duration: 0.4, stagger: 0.025, ease: "power3.inOut" });
    gsap.to(lineRef.current, { scaleX: 1, transformOrigin: "right center", duration: 0.45, ease: "power3.inOut" });
  };

  const leave = () => {
    if (!wrapperRef.current) return;
    const d = Array.from(wrapperRef.current.querySelectorAll<HTMLElement>(".nl-d"));
    const h = Array.from(wrapperRef.current.querySelectorAll<HTMLElement>(".nl-h"));
    gsap.killTweensOf([...d, ...h, lineRef.current]);
    gsap.to(h, { yPercent: 100, duration: 0.35, stagger: 0.02, ease: "power3.inOut" });
    gsap.to(d, { yPercent: 0,   duration: 0.35, stagger: 0.02, ease: "power3.inOut" });
    gsap.to(lineRef.current, { scaleX: 0, transformOrigin: "left center", duration: 0.35, ease: "power3.inOut" });
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <a
        ref={wrapperRef}
        href={href}
        onClick={(e) => { e.preventDefault(); onClick(); }}
        onMouseEnter={enter}
        onMouseLeave={leave}
        style={{ display: "inline-flex", cursor: "pointer", textDecoration: "none", gap: 0 }}
      >
        {label.split("").map((ch, i) => (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", position: "relative", verticalAlign: "top", ...FONT }}>
            <span style={{ visibility: "hidden" }}>{ch}</span>
            <span className="nl-d" style={{ position: "absolute", inset: 0, color: "rgba(255,255,255,0.88)" }}>{ch}</span>
            <span className="nl-h" style={{ position: "absolute", inset: 0, color: "#cac2b6", fontStyle: "italic" }}>{ch}</span>
          </span>
        ))}
      </a>
      <span
        ref={lineRef}
        style={{
          display: "block",
          width: "100%",
          height: "1px",
          background: "#cac2b6",
          marginTop: "3px",
          transformOrigin: "right center",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}

export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home,      href: "#home" },
    { label: t.nav.biography, href: "#about" },
    { label: t.nav.concerts,  href: "#events" },
    { label: t.nav.gallery,   href: "#gallery" },
    { label: t.nav.teaching,  href: "#teaching" },
    { label: t.nav.contact,   href: "#contact" },
  ];

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const buildTimeline = useCallback(() => {
    if (!overlayRef.current) return;

    tlRef.current?.kill();

    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      overlayRef.current,
      { clipPath: "inset(0 0 100% 0)", pointerEvents: "none" },
      { clipPath: "inset(0 0 0% 0)", pointerEvents: "all", duration: 0.68, ease: "expo.inOut" }
    );

    if (overlayBgRef.current) {
      tl.fromTo(
        overlayBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.36, ease: "power2.out" },
        0.14
      );
    }

    tl.to(line1Ref.current, { y: 8, rotate: 45, duration: 0.32, ease: "power3.inOut" }, 0);
    tl.to(line2Ref.current, { scaleX: 0, opacity: 0, duration: 0.18, ease: "power2.in" }, 0);
    tl.to(line3Ref.current, { y: -8, rotate: -45, duration: 0.32, ease: "power3.inOut" }, 0);

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
          {!isMobile && navLinks.map((link) => (
            <NavLink key={link.label} label={link.label} href={link.href} onClick={() => scrollTo(link.href)} />
          ))}

          {/* Language switcher + hamburger group */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: isMobile ? "auto" : 0 }}>
            <LangDropdown locale={locale} setLocale={setLocale} langOpen={langOpen} setLangOpen={setLangOpen} />

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
                <span ref={line1Ref} style={{ display: "block", width: 26, height: 1.5, background: "#ffffff", transformOrigin: "center", borderRadius: 2 }} />
                <span ref={line2Ref} style={{ display: "block", width: 26, height: 1.5, background: "#ffffff", transformOrigin: "center", borderRadius: 2 }} />
                <span ref={line3Ref} style={{ display: "block", width: 26, height: 1.5, background: "#ffffff", transformOrigin: "center", borderRadius: 2 }} />
              </button>
            )}
          </div>
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

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

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

// suppress unused import warning
void navHrefs;
