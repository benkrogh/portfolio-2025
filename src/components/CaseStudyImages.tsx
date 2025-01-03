import React from 'react';
import { motion } from 'framer-motion';

interface MediaProps {
  src?: string;
  alt: string;
}

interface TwoImageGridProps {
  images: [MediaProps, MediaProps];
}

interface AsymmetricGridProps {
  largeImage: MediaProps;
  smallImage: MediaProps;
}

const isVideo = (src: string = '') => {
  return src.match(/\.(mp4|webm|mov)$/i);
};

const MediaElement: React.FC<MediaProps> = ({ src, alt }) => {
  if (!src) {
    return <div className="w-full h-full rounded-3xl bg-[#EDE9E5]" />;
  }

  if (isVideo(src)) {
    return (
      <video
        src={src}
        title={alt}
        controls={false}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-3xl"
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover rounded-3xl"
    />
  );
};

export const FullWidthImage: React.FC<MediaProps> = ({ src, alt }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="max-w-[1500px] mx-auto px-6 mb-6"
    >
      <div className="w-full aspect-[16/9] rounded-3xl bg-[#EDE9E5]">
        <MediaElement src={src} alt={alt} />
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
      {images.map((media, index) => (
        <div 
          key={index}
          className="aspect-square rounded-3xl bg-[#EDE9E5]"
        >
          <MediaElement src={media.src} alt={media.alt} />
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
        <MediaElement src={largeImage.src} alt={largeImage.alt} />
      </div>
      <div className="aspect-[3/4] rounded-3xl bg-[#EDE9E5]">
        <MediaElement src={smallImage.src} alt={smallImage.alt} />
      </div>
    </motion.div>
  );
};

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" }
}; 