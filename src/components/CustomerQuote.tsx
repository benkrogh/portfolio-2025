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
      className={`p-6 sm:p-8 rounded-[24px] ${bgColor} min-h-[280px] sm:min-h-[300px] md:h-[320px] relative flex flex-col`}
    >
      <h2 className={`font-geist-mono text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.03em] leading-tight ${textColor} mb-8 sm:mb-0`}>
        "{quote}"
      </h2>
      <h3 className={`font-geist-mono text-[16px] sm:text-[18px] md:text-[20px] tracking-[-0.02em] ${authorColor} mt-auto pt-4`}>
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