import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits an element's text into word-spans wrapped in overflow:hidden clips,
 * then animates them up from y:110% — the classic masked-from-below reveal.
 */
export function maskRevealWords(
  el: HTMLElement,
  trigger: Element,
  opts: { stagger?: number; duration?: number; delay?: number; start?: string } = {}
) {
  const { stagger = 0.07, duration = 0.9, delay = 0, start = "top 88%" } = opts;

  const original = el.innerHTML;
  const words = el.innerText.split(/(\s+)/);

  el.innerHTML = words
    .map((w) =>
      /^\s+$/.test(w)
        ? w
        : `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15"><span class="mr-inner" style="display:inline-block">${w}</span></span>`
    )
    .join("");

  const inners = el.querySelectorAll<HTMLElement>(".mr-inner");
  gsap.set(inners, { y: "110%" });

  gsap.to(inners, {
    y: "0%",
    duration,
    stagger,
    delay,
    ease: "power4.out",
    scrollTrigger: { trigger, start, once: true },
  });

  return original; // return original so caller can restore if needed
}

/**
 * Single element masked reveal from below — no word splitting.
 */
export function maskRevealEl(
  el: Element | null,
  opts: { duration?: number; delay?: number; start?: string; y?: string } = {}
) {
  if (!el) return;
  const { duration = 0.9, delay = 0, start = "top 88%", y = "40px" } = opts;

  // Wrap in a clip container
  const parent = el.parentElement;
  if (!parent) return;

  gsap.set(el, { y, opacity: 0 });
  gsap.to(el, {
    y: 0,
    opacity: 1,
    duration,
    delay,
    ease: "power4.out",
    scrollTrigger: { trigger: el, start, once: true },
  });
}
