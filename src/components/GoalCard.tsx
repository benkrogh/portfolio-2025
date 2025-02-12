import React from 'react';
import { motion } from 'framer-motion';

interface GoalCardProps {
  number: string;
  text: string;
}

const GoalCard: React.FC<GoalCardProps> = ({ number, text }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="p-6 rounded-[24px] border-2 border-[#17120A] min-h-[200px] sm:min-h-[260px] lg:h-[360px]"
    >
      <h3 className="font-geist-mono text-[16px] sm:text-[18px] lg:text-[22px] tracking-[-0.02em] mb-3 text-[#524D47]">
        GOAL {number.padStart(2, '0')}
      </h3>
      <h2 className="font-geist-mono text-[20px] sm:text-[22px] lg:text-[32px] tracking-[-0.03em] leading-[1.2]">
        {text}
      </h2>
    </motion.div>
  );
};

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" }
};

export default GoalCard; 