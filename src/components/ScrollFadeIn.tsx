import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

const ScrollFadeIn = ({ children, className = "", maxWidth = "" }: ScrollFadeInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  // Only apply max-width if specified
  const widthClass = maxWidth ? `max-w-[${maxWidth}] mx-auto` : "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`${widthClass} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFadeIn; 