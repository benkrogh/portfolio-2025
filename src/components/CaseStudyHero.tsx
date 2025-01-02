import React from 'react';
import { motion } from 'framer-motion';

interface CaseStudyHeroProps {
  imageSrc: string;
  alt: string;
}

const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ imageSrc, alt }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      className="w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-hidden"
    >
      <div className="
        h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-screen 
        relative w-full
      ">
        <div className="
          absolute inset-0
          sm:scale-95 md:scale-100
          transition-transform duration-1000
        ">
          <div className="
            w-full h-full
            bg-[#EDE9E5]
          ">
            {imageSrc && (
              <img
                src={imageSrc} 
                alt={alt}
                className="
                  w-full h-full
                  object-cover
                  object-center
                "
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyHero; 