import React from 'react';
import { motion } from 'framer-motion';

interface CustomerQuoteProps {
  quote: string;
  author: string;
  company: string;
  variant?: 'light' | 'dark';
}

const CustomerQuote: React.FC<CustomerQuoteProps> = ({ 
  quote, 
  author, 
  company, 
  variant = 'light' 
}) => {
  const bgColor = variant === 'dark' ? 'bg-[#1C1C1C]' : 'bg-[#EDE9E5]';
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#1C1C1C]';
  const authorColor = variant === 'dark' ? 'text-[#999999]' : 'text-[#666666]';

  return (
    <motion.div 
      {...fadeInUpAnimation}
      className={`p-8 rounded-[24px] ${bgColor} h-[320px] relative`}
    >
      <h2 className={`font-geist-mono text-[26px] tracking-[-0.03em] leading-tight ${textColor}`}>
        "{quote}"
      </h2>
      <h3 className={`font-geist-mono text-[22px] tracking-[-0.02em] ${authorColor} absolute bottom-8 left-8`}>
        -{author}, {company}
      </h3>
    </motion.div>
  );
};

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" }
};

export default CustomerQuote; 