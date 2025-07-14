import { useEffect, useState } from "react";

export function useCountUp(targetValue: number, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      const currentValue = Math.floor(progressRatio * targetValue);
      setValue(currentValue);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setValue(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return value;
}
