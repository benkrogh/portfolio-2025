import React from 'react';
import { motion } from 'framer-motion';

interface CaseStudyHeaderProps {
  title: string;
  tags: string[];
  description: string;
}

const CaseStudyHeader: React.FC<CaseStudyHeaderProps> = ({ title, tags, description }) => {
  return (
    <header className="min-h-screen flex flex-col -mt-[104px] pt-[104px]">
      <div className="max-w-[1500px] mt-[20vh]">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-geist font-regular text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] 
                     tracking-[-0.03em] mb-4 sm:mb-6"
        >
          {title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {tags.map((tag, index) => (
            <div 
              key={index}
              className="h-[28px] sm:h-[36px] px-3 sm:px-4 rounded-[10px] bg-[#fcfaf7] 
                       border border-[#D6D2CB] flex items-center"
            >
              <span className="font-geist-mono text-[13px] sm:text-[15px]">{tag}</span>
            </div>
          ))}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="font-geist-mono text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] 
                     max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
        >
          {description}
        </motion.p>
      </div>
    </header>
  );
};

export default CaseStudyHeader; 