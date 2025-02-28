import React from 'react';
import { motion } from 'framer-motion';

interface CaseStudyTextProps {
  children: React.ReactNode;
}

// Add type definition for the Secondary component
interface CaseStudyTextComponent extends React.FC<CaseStudyTextProps> {
  Secondary: React.FC<{ children: React.ReactNode }>;
}

// Update the component declaration to use the new type
const CaseStudyText: CaseStudyTextComponent = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="min-h-[60vh] sm:min-h-[75vh] flex items-center py-16 sm:py-24"
    >
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="max-w-[660px] mx-auto">
          {/* Primary text styling */}
          <div className="font-geist-mono text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.03em] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Define Secondary as a subcomponent
CaseStudyText.Secondary = ({ children }: { children: React.ReactNode }) => {
  if (typeof children === 'string') {
    return (
      <p className="font-geist-mono text-[18px] sm:text-[20px] md:text-[22px] text-[#524D47] max-w-[546px] tracking-[-0.03em] mt-6 sm:mt-8 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1">
        {children}
      </p>
    );
  }
  
  return (
    <div className="space-y-6">
      {React.Children.map(children, (child) => (
        <p className="font-geist-mono text-[18px] sm:text-[20px] md:text-[22px] text-[#524D47] max-w-[546px] tracking-[-0.03em] mt-6 sm:mt-8 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1">
          {child}
        </p>
      ))}
    </div>
  );
};

export default CaseStudyText; 