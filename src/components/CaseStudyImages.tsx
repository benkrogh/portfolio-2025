import React from 'react';
import { motion } from 'framer-motion';

interface ImageProps {
  src?: string;
  alt: string;
}

interface TwoImageGridProps {
  images: [ImageProps, ImageProps];
}

interface AsymmetricGridProps {
  largeImage: ImageProps;
  smallImage: ImageProps;
}

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" }
};

export const FullWidthImage: React.FC<ImageProps> = ({ src, alt }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="max-w-[1500px] mx-auto px-6 mb-6"
    >
      <div 
        className="w-full aspect-[16/9] rounded-3xl bg-[#EDE9E5]"
      >
        {src && <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-3xl"
        />}
      </div>
    </motion.div>
  );
};

export const TwoByTwoGrid: React.FC<TwoImageGridProps> = ({ images }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="max-w-[1500px] mx-auto px-6 mb-6 grid grid-cols-2 gap-6"
    >
      {images.map((image, index) => (
        <div 
          key={index}
          className="aspect-square rounded-3xl bg-[#EDE9E5]"
        >
          {image.src && <img 
            src={image.src} 
            alt={image.alt}
            className="w-full h-full object-cover rounded-3xl"
          />}
        </div>
      ))}
    </motion.div>
  );
};

export const AsymmetricGrid: React.FC<AsymmetricGridProps> = ({ largeImage, smallImage }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="max-w-[1500px] mx-auto px-6 mb-6 grid grid-cols-3 gap-6"
    >
      <div className="col-span-2 aspect-[4/3] rounded-3xl bg-[#EDE9E5]">
        {largeImage.src && <img 
          src={largeImage.src} 
          alt={largeImage.alt}
          className="w-full h-full object-cover rounded-3xl"
        />}
      </div>
      <div className="aspect-[3/4] rounded-3xl bg-[#EDE9E5]">
        {smallImage.src && <img 
          src={smallImage.src} 
          alt={smallImage.alt}
          className="w-full h-full object-cover rounded-3xl"
        />}
      </div>
    </motion.div>
  );
}; 