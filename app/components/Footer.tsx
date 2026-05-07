"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-hedvig)",
    color: "rgba(255,255,255,0.6)",
    fontSize: "15px",
    fontStyle: "italic",
  };

  const linkStyle: React.CSSProperties = {
    ...labelStyle,
    textDecoration: "none",
    display: "block",
  };

  if (isMobile) {
    return (
      <footer style={{ background: "#000000", padding: "3rem 1.5rem 2rem" }}>
        {/* Mobile: stacked centered layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ ...labelStyle, marginBottom: "0.3rem" }}>{t.footer.contact}</div>
            <a
              href="mailto:giajashvili@gmail.com"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              giajashvili@gmail.com
            </a>
          </div>

          <div>
            <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>{t.footer.socials}</div>
            {["YOUTUBE", "INSTAGRAM"].map((s) => (
              <a
                key={s}
                href={s === "INSTAGRAM" ? "https://www.instagram.com/giaviolin/" : "#"}
                style={{ ...linkStyle, lineHeight: 1.8 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                {s}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            style={{
              ...labelStyle,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            {t.footer.toTop} ↑
          </button>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "2.5rem",
          }}
        >
          <span style={{ ...labelStyle, color: "rgba(255,255,255,0.4)" }}>2025</span>
          <span style={{ ...labelStyle, color: "rgba(255,255,255,0.4)" }}>© GIA JASHVILI</span>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ background: "#000000" }}>
      {/* Top row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: "3rem 3rem 2.5rem",
          gap: "2rem",
        }}
      >
        {/* Left — To top */}
        <div>
          <button
            onClick={scrollToTop}
            style={{
              ...labelStyle,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            {t.footer.toTop}
          </button>
        </div>

        {/* Center — Contact */}
        <div>
          <div style={{ ...labelStyle, marginBottom: "0.3rem" }}>{t.footer.contact}</div>
          <a
            href="mailto:giajashvili@gmail.com"
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >
            giajashvili@gmail.com
          </a>
        </div>

        {/* Right — Socials */}
        <div>
          <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>{t.footer.socials}</div>
          {["YOUTUBE", "INSTAGRAM"].map((s) => (
            <a
              key={s}
              href={s === "INSTAGRAM" ? "https://www.instagram.com/giaviolin/" : "#"}
              style={{ ...linkStyle, lineHeight: 1.7 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: "1.5rem 3rem 2.5rem",
          gap: "2rem",
        }}
      >
        <div style={{ ...labelStyle, color: "rgba(255,255,255,0.4)" }}>2025</div>
        <div />
        <div style={{ ...labelStyle, color: "rgba(255,255,255,0.4)" }}>© GIA JASHVILI</div>
      </div>
    </footer>
  );
}
