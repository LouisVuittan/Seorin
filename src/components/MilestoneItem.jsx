import { useReveal } from "../hooks";

const MilestoneItem = ({ m, idx }) => {
  const [ref, visible] = useReveal(0.3);
  const side = idx % 2 === 0 ? "left" : "right";
  return (
    <div
      ref={ref}
      className={`tl-item tl-item--${side}${visible ? " visible" : ""}`}
      style={{ "--delay": `${idx * 0.1}s` }}
    >
      <div className="tl-content">
        <span className="tl-year">{m.year}</span>
        <span className="tl-text">{m.text}</span>
      </div>
      <span className="tl-dot" aria-hidden="true" />
    </div>
  );
};

export default MilestoneItem;
