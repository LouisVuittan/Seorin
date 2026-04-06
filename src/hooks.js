import { useState, useEffect, useRef, useCallback } from "react";

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
 * 스크롤 진행률 추적 (0 → 1).
 * 요소가 뷰포트 하단에 진입하는 순간 0, 뷰포트를 완전히 지나가면 1.
 * rAF + CSS 변수 직접 기록 → React 리렌더 0회.
 *
 * @param {string} varName  - el.style에 기록할 CSS 변수 이름 (기본 "--sp")
 * @param {object} opts
 *   - start: 요소 상단이 뷰포트 어디에 올 때 0으로 시작할지 (0=상단, 1=하단, 기본 1)
 *   - end:   요소 하단이 뷰포트 어디에 올 때 1로 완료할지 (0=상단, 1=하단, 기본 0.3)
 */
export const useScrollProgress = (
  varName = "--sp",
  { start = 1, end = 0.3 } = {},
) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // 요소 상단이 뷰포트의 start 지점에 있을 때 progress=0
      // 요소 상단이 뷰포트의 end 지점에 있을 때 progress=1
      const triggerStart = vh * start;
      const triggerEnd = vh * end;
      const range = triggerStart - triggerEnd;

      const progress =
        range > 0
          ? Math.min(1, Math.max(0, (triggerStart - rect.top) / range))
          : 0;

      el.style.setProperty(varName, progress.toFixed(4));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update(); // 초기값

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [varName, start, end]);

  return ref;
};

/**
 * 히어로 섹션 전용: 스크롤 시 fade-out + 위로 밀림 효과.
 * CSS 변수 --hero-sp (0→1)를 직접 기록.
 */
export const useHeroFade = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      // 0 → 1: 스크롤 0에서 뷰포트 60%까지
      const progress = Math.min(1, Math.max(0, scrollY / (vh * 0.6)));
      el.style.setProperty("--hero-sp", progress.toFixed(4));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
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
