import { useState, useEffect, useRef } from "react";

/**
 * IntersectionObserver 기반 등장 애니메이션.
 * trigger 후 observer를 해제하여 불필요한 콜백을 방지합니다.
 */
export const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
};

/**
 * Parallax: rAF로 throttle하여 CSS 변수에 직접 기록.
 * React 리렌더 없이 동작합니다.
 */
export const useParallax = (speed = 0.3) => {
  const ref = useRef(null);

  useEffect(() => {
    let rafId = 0;
    const handle = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${center * speed}px)`;
      });
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => {
      window.removeEventListener("scroll", handle);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return ref;
};

/**
 * 마우스 추적: rAF + CSS 변수로 직접 반영.
 * setState를 사용하지 않아 리렌더가 0회입니다.
 */
export const useMouseFollow = (containerRef) => {
  useEffect(() => {
    let rafId = 0;
    const handle = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const el = containerRef.current;
        if (!el) return;
        el.style.setProperty("--mx", `${e.clientX}`);
        el.style.setProperty("--my", `${e.clientY}`);
      });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handle);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};
