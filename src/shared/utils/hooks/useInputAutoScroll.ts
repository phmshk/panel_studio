import { useEffect } from "react";

// Hook to auto scroll the input field to the center of the screen on mobile devices
// so that input does not hide behind the keyboard
export const useInputAutoScroll = () => {
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInput = target.tagName === "INPUT";

      if (!isInput) return;

      setTimeout(() => {
        if (target.isConnected) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    };

    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("focusin", handleFocus);
    };
  }, []);
};
