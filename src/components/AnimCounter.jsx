import { useState, useEffect } from "react";

const AnimCounter = ({ end, suffix = "", triggered, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};

export default AnimCounter;
