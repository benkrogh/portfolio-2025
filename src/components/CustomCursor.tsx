import { useState, useEffect } from 'react';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
}

export default function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      setCursor(prev => ({
        ...prev,
        x: e.clientX + scrollX,
        y: e.clientY + scrollY
      }));
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest('[data-project]');
      const blogCard = target.closest('[data-blog-card]');
      const projectGrid = document.querySelector('.project-grid-area');
      
      if ((projectCard && projectGrid?.contains(target)) || blogCard) {
        setCursor(prev => ({
          ...prev,
          isHovering: true
        }));
      } else {
        setCursor(prev => ({
          ...prev,
          isHovering: false
        }));
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleHover);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleHover);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      id="cursor"
      className="fixed pointer-events-none z-[9999] will-change-transform"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate3d(${cursor.x - (cursor.isHovering ? 16 : 5)}px, ${cursor.y - (cursor.isHovering ? 16 : 5)}px, 0)`,
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: 1000
      }}
    >
      <div 
        className={`
          relative flex items-center justify-center
          transition-all duration-300 ease-out
          ${cursor.isHovering 
            ? 'w-8 h-8 bg-black text-white rounded-full' 
            : 'w-[10px] h-[10px] bg-black rounded-full'
          }
        `}
      >
        {cursor.isHovering && (
          <span className="text-white">→</span>
        )}
      </div>
    </div>
  );
} 