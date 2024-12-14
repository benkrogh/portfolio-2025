import styles from "./navigation.module.css";
import React from "react";
import useScrollDirection from "@/hooks/useScrollDirection";

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath }: NavigationProps) => {
  const isNavVisible = useScrollDirection(50);

  return (
    <div
      className={`${styles.headerNav} ${
        isNavVisible ? styles.visible : styles.hidden
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 pt-8">
        <nav 
          className="flex items-center justify-between h-[72px] pl-8 pr-3 bg-[#1C1C1C] rounded-[24px]"
        >
          <a href="/" className="flex items-center">
            <img
              src="/images/BK.svg"
              alt="BK Logo"
              className="w-[34px] h-[16px]"
            />
          </a>
          
          <div 
            className={`flex items-center text-[0.938rem] font-medium z-10`}
          >
            <a
              href="/"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl transition-all ${
                currentPath === "/" 
                  ? "bg-white text-[#1C1C1C]" 
                  : "text-white"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
              projects
            </a>
            <a
              href="/about"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl transition-all ${
                currentPath === "/about" 
                  ? "bg-white text-[#1C1C1C]" 
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              about
            </a>
            <a
              href="/blog"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl transition-all ${
                currentPath === "/blog" 
                  ? "bg-white text-[#1C1C1C]" 
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              blog
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
