import { useReveal } from "../hooks";
import { KAKAO_LINK } from "../config";

const ProgramCard = ({ p, idx }) => {
  const [ref, visible] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`program-card${visible ? " visible" : ""}`}
      style={{ "--delay": `${0.15 + idx * 0.15}s`, "--accent": p.accent }}
    >
      <span className="program-num" aria-hidden="true">
        {String(idx + 1).padStart(2, "0")}
      </span>
      <h3 className="program-title">{p.title}</h3>
      <div className="program-sub">{p.sub}</div>
      <p className="program-desc">{p.desc}</p>
      <a
        href={KAKAO_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="program-cta"
      >
        상담 문의하기 <span className="program-cta-arrow">&rarr;</span>
      </a>
    </div>
  );
};

export default ProgramCard;
