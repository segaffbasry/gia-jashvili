"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  by?: "words" | "lines" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: number;
  trigger?: "scroll" | "immediate";
};

export function useTextReveal(opts: Options = {}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      by = "words",
      delay = 0,
      stagger = 0.08,
      duration = 0.9,
      y = 40,
      trigger = "scroll",
    } = opts;

    // Split the text node into spans
    const originalHTML = el.innerHTML;
    const text = el.innerText.trim();

    let units: string[] = [];
    if (by === "words") {
      units = text.split(/(\s+)/); // preserve spaces
    } else if (by === "lines") {
      units = text.split(/\n|<br\s*\/?>/i);
    } else {
      units = text.split("");
    }

    el.innerHTML = units
      .map((unit) =>
        /^\s+$/.test(unit)
          ? unit // raw whitespace — leave as-is
          : `<span class="gsap-unit" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="gsap-inner" style="display:inline-block">${unit}</span></span>`
      )
      .join("");

    const inners = el.querySelectorAll<HTMLElement>(".gsap-inner");

    gsap.set(inners, { y, opacity: 0 });

    const anim = gsap.to(inners, {
      y: 0,
      opacity: 1,
      duration,
      ease: "power3.out",
      stagger,
      delay,
      paused: trigger === "scroll",
      ...(trigger === "scroll"
        ? {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
              onEnter: () => anim.play(),
            },
          }
        : {}),
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      el.innerHTML = originalHTML;
    };
  }, []);

  return ref;
}
