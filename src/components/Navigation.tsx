import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { currentPath } from '../stores/navigationStore';

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath: initialPath }: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const $currentPath = useStore(currentPath);

  useEffect(() => {
    console.log("Navigation component mounted");
    currentPath.set(initialPath);
    
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show nav if scrolling up or at the top, hide if scrolling down
      const shouldBeVisible = currentScrollY < lastScrollY || currentScrollY < 100;
      setIsVisible(shouldBeVisible);

      // Console logs for debugging
      console.log(`Current Scroll Y: ${currentScrollY}, Last Scroll Y: ${lastScrollY}, Is Visible: ${shouldBeVisible}`);

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    console.log("Scroll event listener added");

    return () => {
      window.removeEventListener('scroll', handleScroll);
      console.log("Scroll event listener removed");
    };
  }, [initialPath]);

  return (
    <>
      <div className={`header-nav ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
        <div className="max-w-[1320px] mx-auto px-4 pt-8">
          <nav className="flex items-center h-[56px] pl-4 pr-3 bg-[#1C1C1C] rounded-full">
            <a href="/" className="mx-6">
              <img 
                src="/images/BK.svg" 
                alt="BK Logo" 
                className="w-[34px] h-[16px]" 
              />
            </a>
            <div className="flex items-center gap-1.5">
              {/* Navigation Items */}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navigation; 