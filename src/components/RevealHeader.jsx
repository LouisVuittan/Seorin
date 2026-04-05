import { useReveal } from "../hooks";

const RevealHeader = ({ label, children }) => {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal-up${visible ? " visible" : ""}`}>
      <span className="section-label">{label}</span>
      {children}
    </div>
  );
};

export default RevealHeader;
