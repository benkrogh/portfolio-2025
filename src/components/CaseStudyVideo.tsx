import { useState, useEffect, useRef } from 'react';

interface CaseStudyVideoProps {
  src: string;
  caption?: string;
  deviceFrame?: 'phone' | 'desktop' | 'browser' | 'none';
}

export default function CaseStudyVideo({ src, caption, deviceFrame = 'none' }: CaseStudyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  const frameClasses = {
    none: '',
    phone: 'max-w-[280px] rounded-[4rem] p-3 bg-gray-900',
    desktop: 'max-w-[1200px] rounded-3xl p-2 bg-gray-900',
    browser: 'max-w-[1200px] rounded-2xl overflow-hidden border border-gray-200',
  };

  return (
    <div className="max-w-[1500px] mx-auto px-6 mb-24">
      <div className={`mx-auto ${frameClasses[deviceFrame]}`}>
        <video
          ref={videoRef}
          className={`w-full ${deviceFrame !== 'none' ? 'rounded-2xl' : 'rounded-lg'}`}
          loop
          muted
          playsInline
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {caption && (
        <p className="text-gray-500 text-sm mt-4 text-center max-w-2xl mx-auto">
          {caption}
        </p>
      )}
    </div>
  );
} 