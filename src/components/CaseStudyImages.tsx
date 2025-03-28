import React from 'react';
import { motion } from 'framer-motion';

interface MediaProps {
  src?: string;
  alt: string;
  caption?: string;
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
    return <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-[#EDE9E5]" />;
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
        className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
    />
  );
};

export const FullWidthImage = ({ src, alt, caption }: MediaProps) => {
  return (
    <div className="max-w-[1500px] mx-auto px-6 my-12">
      <div className="relative">
        <img 
          src={src} 
          alt={alt || "Case study image"} 
          className="w-full rounded-[24px] object-cover" 
        />
        {caption && (
          <p className="text-sm text-gray-500 mt-2">{caption}</p>
        )}
      </div>
    </div>
  );
};

export const TwoByTwoGrid: React.FC<TwoImageGridProps> = ({ images }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="max-w-[1500px] mx-auto px-6 py-12 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {images.map((media, index) => (
        <div 
          key={index}
          className="aspect-square rounded-2xl sm:rounded-3xl bg-[#EDE9E5]"
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
      className="max-w-[1500px] mx-auto px-6 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6"
    >
      <div className="sm:col-span-2 aspect-[4/3] rounded-2xl sm:rounded-3xl bg-[#EDE9E5]">
        <MediaElement src={largeImage.src} alt={largeImage.alt} />
      </div>
      <div className="aspect-[4/3] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl bg-[#EDE9E5]">
        <MediaElement src={smallImage.src} alt={smallImage.alt} />
      </div>
    </motion.div>
  );
};

export const ContentImage: React.FC<MediaProps> = ({ src, alt, caption }) => {
  return (
    <motion.div 
      {...fadeInUpAnimation}
      className="max-w-[1500px] mx-auto px-6 mb-6"
    >
      <div className="w-full rounded-2xl sm:rounded-[24px] overflow-hidden">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <div className="flex justify-center mt-6">
          <span className="font-geist-mono text-[15px] text-[#524D47] max-w-[400px] text-left">
            {caption}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" }
}; 