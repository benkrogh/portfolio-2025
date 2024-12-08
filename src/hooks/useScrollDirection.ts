import { useState, useEffect } from "react";

const useScrollDirection = (threshold: number = 50): boolean => {
  const [isVisible, setIsVisible] = useState<boolean>(true); // Determines whether the element is visible
  const [lastScrollPos, setLastScrollPos] = useState<number>(0); // Keeps track of the last scroll position
  const [delta, setDelta] = useState<number>(0); // Accumulates the distance scrolled in one direction

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollDelta = currentScrollPos - lastScrollPos;

      if (Math.abs(delta + scrollDelta) > threshold) {
        if (scrollDelta > 0) {
          setIsVisible(false); // Hide on downward scroll
        } else {
          setIsVisible(true); // Show on upward scroll
        }
        setDelta(0); // Reset delta after reaching threshold
      } else {
        setDelta(delta + scrollDelta);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPos, delta, threshold]);

  return isVisible;
};

export default useScrollDirection;
