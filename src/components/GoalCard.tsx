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
      className="p-8 rounded-[24px] border-2 border-[#17120A] h-[360px]"
    >
      <h3 className="font-geist-mono text-[22px] tracking-[-0.02em] mb-4 text-[#524D47]">
        GOAL {number.padStart(2, '0')}
      </h3>
      <h2 className="font-geist-mono text-[32px] tracking-[-0.03em] leading-tight">
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