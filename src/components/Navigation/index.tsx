import styles from "./navigation.module.css";

import React from "react";
import useScrollDirection from "@/hooks/useScrollDirection";

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath }: NavigationProps) => {
  const isNavVisible = useScrollDirection(50); // Pass the threshold as a parameter if needed

  // Placeholder for the current path
  console.log(currentPath);

  return (
    <>
      <div
        className={`${styles.headerNav} ${
          isNavVisible ? styles.visible : styles.hidden
        }`}
      >
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
