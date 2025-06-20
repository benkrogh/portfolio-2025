import styles from "./navigation.module.css";
import React, { useState, useEffect } from "react";
import useScrollDirection from "@/hooks/useScrollDirection";

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath: initialPath }: NavigationProps) => {
  const isNavVisible = useScrollDirection(50);
  const [currentPath, setCurrentPath] = useState(initialPath);

  // Update currentPath when route changes
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    // Listen for ViewTransitions events
    const handlePageLoad = () => {
      // Small delay to ensure pathname is updated after transition
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
      }, 50);
    };
    
    const handleAfterSwap = () => {
      // Small delay to ensure pathname is updated after transition
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
      }, 50);
    };

    document.addEventListener('astro:page-load', handlePageLoad);
    document.addEventListener('astro:after-swap', handleAfterSwap);
    
    // Also listen for popstate events (browser back/forward)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
      document.removeEventListener('astro:after-swap', handleAfterSwap);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [initialPath]);

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <div
      className={`${styles.headerNav} ${
        isNavVisible ? styles.visible : styles.hidden
      } fixed w-full`}
    >
      <div className="w-full max-w-[1500px] mx-auto">
        <div className="px-6">
          <nav 
            className="flex items-center h-[72px] pl-4 sm:pl-8 pr-3 rounded-[24px] bg-[#FCF9F4]/20 backdrop-blur-[16px] z-[1000]"
          >
            <a href="/" className="hidden sm:block hover:opacity-80 transition-opacity">
              <img
                src="/images/BK-dark.svg"
                alt="BK Logo"
                className="w-[50px] h-[36px]"
              />
            </a>
            
            <div 
              className={`flex items-center text-[0.938rem] font-medium z-10 gap-1.5 w-full sm:w-auto justify-center sm:justify-start sm:ml-auto`}
            >
              <a
                href="/"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl transition-all hover:bg-[#17120A]/10 ${
                  isActive("/") 
                    ? "bg-[#17120A] text-white hover:bg-[#17120A]/90 active" 
                    : "text-[#17120A]"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                projects
              </a>
              <a
                href="/about"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl transition-all hover:bg-[#17120A]/10 ${
                  isActive("/about") 
                    ? "bg-[#17120A] text-white hover:bg-[#17120A]/90 active" 
                    : "text-[#17120A]"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                about
              </a>
              <a
                href="/blog"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl transition-all hover:bg-[#17120A]/10 ${
                  isActive("/blog") 
                    ? "bg-[#17120A] text-white hover:bg-[#17120A]/90 active" 
                    : "text-[#17120A]"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                blog
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
