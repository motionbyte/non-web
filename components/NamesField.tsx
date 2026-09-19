"use client";

import { useEffect, useRef, useState } from "react";

const ROWS = 48;
const READ = "h1,h2,h3,h4,p,a,button,label,input,textarea,span,summary";
const RAD = 224;
const PAD = 18;
const DESKTOP = "(min-width: 768px)";

function lineFor(names: string[], row: number) {
  const start = (row * 5) % names.length;
  const rotated = names.slice(start).concat(names.slice(0, start));
  return Array.from({ length: 8 }, () => rotated.join("   ·   ")).join("   ·   ");
}

function boxesOf(node: Element) {
  if (node.tagName === "INPUT" || node.tagName === "TEXTAREA" || node.tagName === "BUTTON" || node.tagName === "LABEL") {
    return [node.getBoundingClientRect()];
  }
  try {
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = range.getClientRects();
    if (rects.length) return Array.from(rects);
  } catch {
    /* fall through */
  }
  return [node.getBoundingClientRect()];
}

function useDesktopPointer() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return on;
}

function NamesFieldCanvas({ names }: { names: string[] }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGMaskElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const holesRef = useRef<SVGGElement>(null);
  const bgRef = useRef<SVGRectElement>(null);
  const source = names.length ? names : ["Names of Note"];

  useEffect(() => {
    const field = fieldRef.current;
    const mask = maskRef.current;
    const circle = circleRef.current;
    const holes = holesRef.current;
    const bg = bgRef.current;
    if (!field || !mask || !circle || !holes || !bg) return;

    let frame = 0;
    let last: PointerEvent | MouseEvent | null = null;

    function paint() {
      frame = 0;
      const e = last;
      if (!e || !field || !mask || !circle || !holes || !bg) return;
      const origin = field.getBoundingClientRect();
      const x = e.clientX - origin.left;
      const y = e.clientY - origin.top;
      field.style.setProperty("--sx", `${x}px`);
      bg.setAttribute("width", String(origin.width));
      bg.setAttribute("height", String(origin.height));
      mask.setAttribute("width", String(origin.width));
      mask.setAttribute("height", String(origin.height));
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", String(RAD));
      holes.replaceChildren();
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const text = hit && !hit.closest(".names-field") ? hit.closest(READ) : null;
      if (text) {
        for (const box of boxesOf(text)) {
          if (!box.width || !box.height) continue;
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", String(box.left - origin.left - PAD));
          rect.setAttribute("y", String(box.top - origin.top - PAD));
          rect.setAttribute("width", String(box.width + PAD * 2));
          rect.setAttribute("height", String(box.height + PAD * 2));
          rect.setAttribute("rx", "6");
          rect.setAttribute("fill", "black");
          holes.appendChild(rect);
        }
      }
    }

    function go(event: PointerEvent | MouseEvent) {
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    document.addEventListener("pointermove", go, { capture: true, passive: true });
    document.addEventListener("mousemove", go, { capture: true, passive: true });
    return () => {
      document.removeEventListener("pointermove", go, { capture: true });
      document.removeEventListener("mousemove", go, { capture: true });
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="names-field-root hidden md:block" aria-hidden>
      <svg className="pointer-events-none absolute h-0 w-0">
        <defs>
          <mask ref={maskRef} id="names-spot-mask" maskUnits="userSpaceOnUse" x="0" y="0">
            <rect ref={bgRef} id="names-spot-bg" x="0" y="0" fill="black" />
            <circle ref={circleRef} id="names-spot-circle" cx="-400" cy="-400" r="0" fill="white" />
            <g ref={holesRef} id="names-spot-holes" />
          </mask>
        </defs>
      </svg>
      <div ref={fieldRef} className="names-field pointer-events-none fixed inset-0 z-[15] hidden overflow-hidden mix-blend-multiply md:block">
        {Array.from({ length: ROWS }, (_, row) => (
          <p
            key={row}
            className="names-row font-ghost whitespace-nowrap text-[clamp(1.35rem,2.4vw,2.15rem)] leading-[1.12] text-black/50"
            style={{ ["--slide" as string]: row % 2 === 0 ? 1 : -1 }}
          >
            {lineFor(source, row)}
          </p>
        ))}
      </div>
    </div>
  );
}

export function NamesField({ names }: { names: string[] }) {
  const desktop = useDesktopPointer();
  if (!desktop) return null;
  return <NamesFieldCanvas names={names} />;
}
