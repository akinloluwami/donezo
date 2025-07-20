import { useEffect, useState } from "react";

/**
 * Animates a string, revealing one character at a time.
 * @param text The full string to animate
 * @param options Optional: { delay, startDelay } - delay per char and initial delay in ms
 * @returns The currently revealed string
 */
export function useTypingEffect(
  text: string,
  options?: { delay?: number; startDelay?: number }
) {
  const { delay = 30, startDelay = 0 } = options || {};
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay("");
    let timeout: NodeJS.Timeout;
    let cancelled = false;
    function typeChar(idx: number) {
      if (cancelled) return;
      setDisplay(text.slice(0, idx));
      if (idx <= text.length) {
        timeout = setTimeout(() => typeChar(idx + 1), delay);
      }
    }
    timeout = setTimeout(() => typeChar(1), startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [text, delay, startDelay]);

  return display;
}
