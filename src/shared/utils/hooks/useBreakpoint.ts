import { useEffect, useState } from "react";

const BREAKPOINT = 1024; // Breakpoint for mobile devices from tailwindcss 1024px and below

const getIsMobile = () => window.innerWidth < BREAKPOINT;

/**
 * A custom hook that detects the current viewport width and whether it is less than the 1024px breakpoint.
 * @returns A boolean indicating if the current viewport width is less than the 1024px breakpoint.
 */
export const useBreakpoint = (): boolean => {
  const [isMobile, setIsMobile] = useState(getIsMobile());
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};
