import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { currentPath } from '../stores/navigationStore';

const Navigation = () => {
  const [hoveredShape, setHoveredShape] = useState<string | null>(null);
  const $currentPath = useStore(currentPath);

  return (
    <nav className="fixed top-8 left-8 z-[100] flex items-center bg-transparent">
      {/* Logo/Home */}
      <a 
        href="/"
        className="block mr-4 font-sm"
      >
        <img 
          src="/images/nav-logo.svg" 
          alt="BK Logo" 
          className="w-[50px] h-[36px]"
        />
      </a>

      <div className="flex items-center">
        {/* Projects (Triangle) */}
        <div className={`
          relative w-5 h-5
          transition-[margin] duration-300
          ${hoveredShape === 'triangle' ? 'mr-4 ml-2' : 'mr-4 ml-2'}
        `}>
          <a 
            href="/"
            className="block h-full font-sm"
            onMouseEnter={() => setHoveredShape('triangle')}
            onMouseLeave={() => setHoveredShape(null)}
          >
            <div 
              className={`
                absolute top-1/2 -translate-y-1/2
                w-[32px] h-[28px]
                transition-all duration-300 ease-out
                ${hoveredShape === 'triangle' 
                  ? 'bg-[#17120A] rounded-[10px] w-[100px] py-3 px-2'
                  : 'bg-[#EC6A5C]'
                }
              `}
              style={{ 
                clipPath: hoveredShape === 'triangle' ? 'none' : 'polygon(50% 0, 0% 100%, 100% 100%)',
              }}
            >
              <span className={`
                absolute inset-0 
                flex items-center justify-center 
                text-white font-medium text-sm
                transition-opacity duration-200
                ${hoveredShape === 'triangle' ? 'opacity-100' : 'opacity-0'}
              `}>
                projects
              </span>
            </div>
          </a>
        </div>

        {/* About (Square) */}
        <div className={`
          relative w-5 h-5
          transition-[margin] duration-300
          ${hoveredShape === 'square' ? 'mr-4 ml-2' : 'mr-4 ml-2'}
        `}>
          <a 
            href="/about"
            className="block h-full font-sm"
            onMouseEnter={() => setHoveredShape('square')}
            onMouseLeave={() => setHoveredShape(null)}
          >
            <div 
              className={`
                absolute top-1/2 -translate-y-1/2
                w-[28px] h-[28px]
                transition-all duration-300 ease-out
                ${hoveredShape === 'square' 
                  ? 'bg-[#17120A] rounded-[10px] w-[100px] py-3 px-2'
                  : 'bg-[#7EAEFF]'
                }
              `}
            >
              <span className={`
                absolute inset-0 
                flex items-center justify-center 
                text-white font-medium text-sm
                transition-opacity duration-200
                ${hoveredShape === 'square' ? 'opacity-100' : 'opacity-0'}
              `}>
                about
              </span>
            </div>
          </a>
        </div>

        {/* Blog (Circle) */}
        <div className="relative w-5 h-5">
          <a 
            href="/blog"
            className="block h-full font-sm"
            onMouseEnter={() => setHoveredShape('circle')}
            onMouseLeave={() => setHoveredShape(null)}
          >
            <div 
              className={`
                absolute top-1/2 -translate-y-1/2
                w-[28px] h-[28px]
                transition-all duration-300 ease-out
                ${hoveredShape === 'circle' 
                  ? 'bg-[#17120A] rounded-[10px] w-[100px] py-3 px-2'
                  : 'bg-[#7FD1B9] rounded-full'
                }
              `}
            >
              <span className={`
                absolute inset-0 
                flex items-center justify-center 
                text-white font-medium text-sm
                transition-opacity duration-200
                ${hoveredShape === 'circle' ? 'opacity-100' : 'opacity-0'}
              `}>
                blog
              </span>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 