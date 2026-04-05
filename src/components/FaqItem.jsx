import { useState, useId } from "react";
import { useReveal } from "../hooks";
import { ChevronDown } from "./Icons";

const FaqItem = ({ q, a, idx }) => {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useReveal();
  const answerId = useId();

  return (
    <div
      ref={ref}
      className={`faq-item${visible ? " visible" : ""}`}
      style={{ "--delay": `${idx * 0.07}s` }}
    >
      <button
        className="faq-question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span className="faq-question-inner">
          <span className={`faq-q-badge${open ? " active" : ""}`}>Q</span>
          {q}
        </span>
        <span className={`faq-chevron${open ? " open" : ""}`}>
          <ChevronDown />
        </span>
      </button>
      <div
        id={answerId}
        className={`faq-answer${open ? " open" : ""}`}
        role="region"
      >
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  );
};

export default FaqItem;
