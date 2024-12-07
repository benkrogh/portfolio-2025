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
      setCursor(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }));
    };

    const handleProjectHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest('[data-project]');
      const projectGrid = document.querySelector('.project-grid-area');
      
      if (projectCard && projectGrid?.contains(target)) {
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
    document.addEventListener('mouseover', handleProjectHover);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleProjectHover);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 will-change-transform"
      style={{
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