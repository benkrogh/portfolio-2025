import React from 'react';
import { motion } from 'framer-motion';

interface TextWithImageProps {
  headline: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
}

const TextWithImage: React.FC<TextWithImageProps> = ({ headline, text, imageSrc, imageAlt }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="py-16 sm:py-24"
    >
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="font-geist-mono text-[24px] sm:text-[28px] md:text-[32px] tracking-[-0.03em]">
              {headline}
            </h2>
            <p className="font-geist-mono text-[18px] sm:text-[20px] md:text-[22px] text-[#524D47] tracking-[-0.03em] mt-6 sm:mt-8">
              {text}
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TextWithImage; 