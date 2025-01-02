import React from 'react';
import { motion } from 'framer-motion';

interface CaseStudyTextProps {
  children: React.ReactNode;
}

const CaseStudyText: React.FC<CaseStudyTextProps> = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-[75vh] flex items-center py-24"
    >
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="max-w-[660px] mx-auto">
          <p className="font-geist-mono text-[32px] tracking-[-0.03em] [&:not(:last-child)]:mb-8">
            {children}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyText; 