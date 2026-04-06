import { useState, useEffect, useRef, useCallback, React } from "react";
import {
  useReveal,
  useParallax,
  useMouseFollow,
  useHeroFade,
  useScrollProgress,
} from "./hooks";
import {
  KAKAO_LINK,
  PHONE_NUMBER,
  INSTAGRAM_LINK,
  INSTAGRAM_HANDLE,
  KAKAO_HANDLE,
  PHONE_HREF,
  INSTRUCTOR_NAME,
} from "./config";
import {
  navItems,
  programs,
  faqs,
  credentials,
  milestones,
  instructorTags,
  careerCards,
  galleryItems,
} from "./data";
import {
  KakaoIcon,
  MenuIcon,
  CloseIcon,
  KakaoLarge,
  PhoneIcon,
} from "./components/Icons";
import AnimCounter from "./components/AnimCounter";
import FaqItem from "./components/FaqItem";
import RevealHeader from "./components/RevealHeader";
import GalleryItem from "./components/GalleryItem";
import MilestoneItem from "./components/MilestoneItem";
import ProgramCard from "./components/ProgramCard";
import "./styles.css";
import instructorImg from "./assets/instructor.jpg";

/* ── Ink Divider with scroll progress ── */
function InkDivider({ flip, fillColor, bgColor }) {
  const spRef = useScrollProgress("--ink-sp", { start: 1, end: 0.6 });

  // 각 디바이더마다 다른 path를 씀
  const pathD = flip
    ? "M0,0 C360,50 720,10 1080,40 C1260,55 1380,20 1440,0 L1440,60 L0,60Z"
    : "M0,0 C240,55 480,20 720,45 C960,70 1200,15 1440,0 L1440,60 L0,60Z";

  return (
    <svg
      ref={spRef}
      className={`ink-divider${flip ? " ink-divider--flip" : ""}`}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ background: bgColor }}
    >
      <path d={pathD} fill={fillColor} className="ink-divider-path" />
    </svg>
  );
}

/* ── Gallery Carousel ── */
function GalleryCarousel({ gallRef, gallVis }) {
  const total = galleryItems.length;
  const [cur, setCur] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);
  const autoRef = useRef(null);

  const go = useCallback(
    (dir) => setCur((p) => (p + dir + total) % total),
    [total],
  );

  useEffect(() => {
    autoRef.current = setInterval(() => go(1), 4500);
    return () => clearInterval(autoRef.current);
  }, [go]);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => go(1), 4500);
  };

  const handlePrev = () => {
    go(-1);
    resetAuto();
  };
  const handleNext = () => {
    go(1);
    resetAuto();
  };

  const onDown = (e) => {
    setDragging(true);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX.current = 0;
  };
  const onMove = (e) => {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    deltaX.current = x - startX.current;
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(deltaX.current) > 50) {
      deltaX.current < 0 ? handleNext() : handlePrev();
    }
  };

  const getPos = (idx) => {
    let diff = idx - cur;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section ref={gallRef} id="gallery" className="gallery has-texture">
      <div className={`gallery-header reveal-up${gallVis ? " visible" : ""}`}>
        <span className="section-label">GALLERY</span>
        <h2 className="section-title section-title--md">수업 풍경</h2>
      </div>
      <div
        className="carousel"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <div className="carousel-viewport">
          {galleryItems.map((g, i) => {
            const pos = getPos(i);
            const active = pos === 0;
            const visible = Math.abs(pos) <= 2;
            return (
              <div
                key={i}
                className={`carousel-slide${active ? " active" : ""}`}
                style={{
                  "--pos": pos,
                  visibility: visible ? "visible" : "hidden",
                }}
              >
                <GalleryItem g={g} idx={i} />
              </div>
            );
          })}
        </div>
        <button
          className="carousel-btn carousel-btn--prev"
          onClick={handlePrev}
          aria-label="이전 사진"
        >
          &#8249;
        </button>
        <button
          className="carousel-btn carousel-btn--next"
          onClick={handleNext}
          aria-label="다음 사진"
        >
          &#8250;
        </button>
      </div>
      <div className="carousel-dots">
        {galleryItems.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === cur ? " active" : ""}`}
            onClick={() => {
              setCur(i);
              resetAuto();
            }}
            aria-label={`${i + 1}번째 사진`}
          />
        ))}
      </div>
      <p className="gallery-note">* 실제 수업 사진으로 교체 예정</p>
    </section>
  );
}

export default function SeorinLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const heroRef = useRef(null);
  useMouseFollow(heroRef);

  // ── 스크롤 연동: 히어로 fade-out ──
  const heroFadeRef = useHeroFade();

  // ── 스크롤 연동: 크레덴셜 섹션 ──
  const credSpRef = useScrollProgress("--cred-sp", { start: 1, end: 0.4 });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => {
      window.removeEventListener("scroll", h);
      clearTimeout(timer);
    };
  }, []);

  const [credRef, credVis] = useReveal();
  const [instrRef, instrVis] = useReveal(0.1);
  const [gallRef, gallVis] = useReveal(0.1);
  const [faqRef, faqVis] = useReveal(0.1);
  const [footRef, footVis] = useReveal(0.1);
  const parRef = useParallax(0.15);
  const [ctaRef, ctaVis] = useReveal(0.2);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  const loaded = heroLoaded ? " loaded" : "";

  return (
    <div className="app">
      {/* ═══ NAV ═══ */}
      <nav
        aria-label="주 내비게이션"
        className={`nav${scrolled ? " nav--scrolled" : ""}`}
      >
        <div className="nav-inner">
          <button
            className="nav-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="서린 홈으로 이동"
          >
            서린
          </button>
          <div className="nav-links">
            {navItems.map((n) => (
              <button
                key={n.id}
                className="nav-link"
                onClick={() => scrollTo(n.id)}
              >
                {n.label}
              </button>
            ))}
            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
            >
              <KakaoIcon size={16} /> 상담하기
            </a>
          </div>
          <button
            className="mob-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-expanded={mobileMenu}
            aria-label={mobileMenu ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileMenu ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        {mobileMenu && (
          <div className="mobile-menu">
            {navItems.map((n) => (
              <button
                key={n.id}
                className="mobile-menu-link"
                onClick={() => scrollTo(n.id)}
              >
                {n.label}
              </button>
            ))}
            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-cta"
            >
              <KakaoIcon size={18} /> 카카오톡 상담하기
            </a>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero" ref={heroRef}>
        <div className="hero-orb hero-orb--1" />
        <div className="hero-orb hero-orb--2" />
        <div className="hero-grain" />

        {/* 히어로 콘텐츠: 스크롤 시 fade-out + 위로 이동 */}
        <div className="hero-layout" ref={heroFadeRef}>
          <div className="hero-content">
            <div className={`hero-overline${loaded}`}>
              <span className="hero-badge">어린이 민요 교육</span>
            </div>
            <h1 className="hero-title">
              <span className="hero-line hero-line--cream">
                {"아이의".split("").map((c, i) => (
                  <span
                    key={`a${i}`}
                    className={`hero-char${loaded}`}
                    style={{ "--i": 12 + i }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              <span className="hero-line hero-line--cream">
                {"마음에".split("").map((c, i) => (
                  <span
                    key={`b${i}`}
                    className={`hero-char${loaded}`}
                    style={{ "--i": 16 + i }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              <span className="hero-line hero-line--gold">
                {"민요".split("").map((c, i) => (
                  <span
                    key={`c${i}`}
                    className={`hero-char${loaded}`}
                    style={{ "--i": 22 + i }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              <span className="hero-line hero-line--gold">
                {"한 소절".split("").map((c, i) => (
                  <span
                    key={`d${i}`}
                    className={`hero-char${loaded}`}
                    style={{ "--i": 26 + i }}
                  >
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </span>
            </h1>
            <p className={`hero-subtitle${loaded}`}>
              노래 한 곡에 담긴 감성과 이야기,
              <br />
              서린에서 우리 아이의 첫 민요를 시작하세요
            </p>
            <div className={`hero-cta-wrap${loaded}`}>
              <a
                href={KAKAO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta"
              >
                <KakaoIcon /> 카카오톡으로 상담하기
              </a>
            </div>
          </div>

          {/* 금박 세로 장식선 */}
          <div className={`hero-deco${loaded}`} aria-hidden="true">
            <div className="hero-deco-line" />
            <span className="hero-deco-text">聲</span>
            <div className="hero-deco-line" />
          </div>
        </div>

        <div className={`hero-scroll${loaded}`}>
          <div className="scroll-line" />
          <span className="hero-scroll-text">scroll</span>
        </div>
      </section>

      {/* 먹 번짐 디바이더: 히어로 → 크레덴셜 */}
      <InkDivider fillColor="var(--hanji)" bgColor="var(--ink)" />

      {/* ═══ CREDENTIALS ═══ */}
      <section ref={credRef} id="about" className="credentials has-texture">
        <div className="credentials-grid" ref={credSpRef}>
          {credentials.map((c, i) => (
            <div
              key={i}
              className={`credential-item${credVis ? " visible" : ""}`}
              style={{ "--delay": `${i * 0.12}s` }}
            >
              <div className="credential-num">
                <AnimCounter
                  end={c.num}
                  suffix={c.suffix}
                  triggered={credVis}
                />
              </div>
              <div className="credential-title">{c.title}</div>
              <div className="credential-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ═══ INSTRUCTOR ═══ */}
      <section ref={instrRef} className="instructor">
        <div ref={parRef} className="instructor-inner">
          <div className={`instructor-header${instrVis ? " visible" : ""}`}>
            <span className="section-label">Instructor</span>
            <h2 className="section-title">서린을 이끄는 사람</h2>
            {/* 붓 터치 장식: stroke-dashoffset 애니메이션 */}
            <svg
              className="brush-stroke"
              width="120"
              height="12"
              viewBox="0 0 120 12"
              aria-hidden="true"
            >
              <path
                className="brush-stroke-path"
                d="M2 8 C20 2, 40 10, 60 6 S100 2, 118 7"
              />
            </svg>
            <div className="section-divider" />
          </div>

          <div className="profile-row">
            <div className={`profile-photo-wrap${instrVis ? " visible" : ""}`}>
              <img
                src={instructorImg}
                alt="김효슬 프로필 사진"
                className="profile-photo"
              />
            </div>

            <div className={`profile-info${instrVis ? " visible" : ""}`}>
              <h3 className="profile-name">{INSTRUCTOR_NAME}</h3>

              <div className="profile-badge">
                <div className="profile-badge-text">
                  <span className="profile-badge-title">
                    국가무형문화재 제57호
                  </span>
                  <span className="profile-badge-sub">경기민요 전수자</span>
                </div>
              </div>

              <span className="profile-role">국악인 · 민요 교육가</span>

              <div className="profile-edu">
                국립국악고등학교 졸업 · 이화여자대학교 재학
              </div>

              <blockquote className="profile-quote">
                <span className="profile-quote-mark" aria-hidden="true">
                  "
                </span>
                민요는 단순한 노래가 아니라
                <br />
                아이에게 감정을 표현하는 방법을
                <br />
                알려주는 시간입니다
              </blockquote>

              <div className="profile-tags">
                {instructorTags.map((t, i) => (
                  <span key={i} className="profile-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Career Cards ── */}
          <div className={`career-section${instrVis ? " visible" : ""}`}>
            <h4 className="career-section-title">주요 이력</h4>
            <div className="career-track">
              {careerCards.map((c, i) => (
                <div key={i} className="career-card" style={{ "--i": i }}>
                  <span className="career-card-title">{c.title}</span>
                  <ul className="career-card-list">
                    {c.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Timeline (세로 라인) — 스크롤 연동 채우기 ── */}
          <div className={`timeline-wrap${instrVis ? " visible" : ""}`}>
            <h4 className="timeline-title">경력 타임라인</h4>
            <div className="timeline-line">
              {milestones.map((m, i) => (
                <MilestoneItem key={i} m={m} idx={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 먹 번짐 디바이더: 강사 → 프로그램 */}
      <InkDivider fillColor="var(--hanji)" bgColor="var(--ink)" />

      {/* ═══ PROGRAMS ═══ */}
      <section id="programs" className="programs has-texture">
        <div className="programs-inner">
          <div className="programs-header-split">
            <RevealHeader label="Programs">
              <div className="section-divider" />
            </RevealHeader>
            <div className="reveal-up">
              <h2 className="section-title section-title--md programs-title-right">
                목소리로 피어나는
                <br />
                우리 민요
              </h2>
            </div>
          </div>
          <div className="programs-grid-asym">
            {programs.map((p, i) => (
              <ProgramCard key={i} p={p} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section ref={ctaRef} className="cta-banner">
        <div className="cta-pattern" />
        <div className={`cta-layout${ctaVis ? " visible" : ""}`}>
          <div className="cta-left">
            <h3 className="cta-title">
              우리 아이의 성장,
              <br />
              함께 지켜봐요
            </h3>
            <p className="cta-desc">
              수업 후 피드백과 성장 기록을 통해
              <br />
              아이의 변화를 확인할 수 있습니다
            </p>
          </div>
          <div className="cta-right">
            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              <KakaoIcon /> 카카오톡으로 상담하기
            </a>
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <GalleryCarousel gallRef={gallRef} gallVis={gallVis} />

      {/* ═══ FAQ ═══ */}
      <section ref={faqRef} id="faq" className="faq-section has-texture">
        <div className="faq-inner">
          <div className={`faq-header reveal-up${faqVis ? " visible" : ""}`}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title section-title--md">자주 묻는 질문</h2>
            <p className="faq-subtitle">서린에 대해 궁금한 점을 모았습니다</p>
            <div className="section-divider" />
          </div>
          <div className="faq-layout">
            <div className="faq-list">
              {faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} idx={i} />
              ))}
            </div>
            <div className="faq-sidebar">
              <div className={`faq-sidebar-reveal${faqVis ? " visible" : ""}`}>
                <div className="faq-contact">
                  <div className="faq-contact-accent" aria-hidden="true" />
                  <div className="faq-contact-icon" aria-hidden="true">
                    <PhoneIcon />
                  </div>
                  <p className="faq-contact-text">
                    궁금한 점이 있으시면
                    <br />
                    편하게 연락주세요
                  </p>
                  <div className="faq-contact-label">전화 문의</div>
                  <div className="faq-contact-phone">{PHONE_NUMBER}</div>
                  <div className="faq-contact-hours">평일 10:00 - 18:00</div>
                  <div className="faq-contact-divider" />
                  <a
                    href={KAKAO_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="faq-contact-cta"
                  >
                    <KakaoIcon /> 카톡 상담하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer ref={footRef} className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className={`footer-brand${footVis ? " visible" : ""}`}>
              <div className="footer-logo">서린</div>
              <div className="footer-tagline">Seorin · 민요 교육 플랫폼</div>
            </div>
            <div className={`footer-links${footVis ? " visible" : ""}`}>
              {[
                {
                  title: "카카오톡",
                  sub: KAKAO_HANDLE,
                  href: KAKAO_LINK,
                },
                {
                  title: "인스타그램",
                  sub: INSTAGRAM_HANDLE,
                  href: INSTAGRAM_LINK,
                },
                {
                  title: "전화",
                  sub: PHONE_NUMBER,
                  href: PHONE_HREF,
                },
              ].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-card"
                >
                  <div className="footer-link-title">{c.title}</div>
                  <div className="footer-link-sub">{c.sub}</div>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">
              &copy; 2026 서린(Seorin). All rights reserved.
            </span>
            <span className="footer-copy">어린이 민요 교육 플랫폼</span>
          </div>
        </div>
      </footer>

      {/* ═══ FLOATING KAKAO ═══ */}
      <a
        href={KAKAO_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="float-kakao"
        aria-label="카카오톡으로 상담하기"
      >
        <KakaoLarge />
      </a>
    </div>
  );
}
