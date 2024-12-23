import React, { useState, useEffect } from "react";
import throttle from "lodash.throttle";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isNav: boolean | 'footer';
}

export default function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isNav: false,
  });

  useEffect(() => {
    const onMouseMove = throttle((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navArea = target.closest(`nav`);
      const footerArea = target.closest("footer");
      const isFooterNav = footerArea?.contains(navArea);

      setCursor((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        isNav: footerArea ? 'footer' : navArea && !isFooterNav ? true : false
      }));
    }, 16);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectCard = target.closest("[data-project]");
      const blogCard = target.closest("[data-blog-card]");
      const navArea = target.closest(`nav`);
      const footerArea = target.closest("footer");
      const isFooterNav = footerArea?.contains(navArea);
      const isLink = target.closest("a");
      const projectGrid = document.querySelector(".project-grid-area");

      if (footerArea && isLink) {
        setCursor((prev) => ({
          ...prev,
          isHovering: true,
          isNav: 'footer',
        }));
      } else if ((projectCard && projectGrid?.contains(target)) || blogCard) {
        setCursor((prev) => ({
          ...prev,
          isHovering: true,
          isNav: false,
        }));
      } else if (navArea && !isFooterNav && isLink) {
        setCursor((prev) => ({
          ...prev,
          isHovering: true,
          isNav: true,
        }));
      } else {
        setCursor((prev) => ({
          ...prev,
          isHovering: false,
          isNav: footerArea ? 'footer' : navArea && !isFooterNav ? true : false,
        }));
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleHover);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleHover);
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
      className="fixed pointer-events-none z-[9999] will-change-transform hidden md:block"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate3d(${cursor.x - (cursor.isHovering ? 16 : 5)}px, ${cursor.y - (cursor.isHovering ? 16 : 5)}px, 0)`,
        WebkitBackfaceVisibility: "hidden",
        WebkitPerspective: 1000,
        zIndex: 9999,
      }}
    >
      <div
        className={`
          relative flex items-center justify-center
          transition-all duration-300 ease-out
          ${
            cursor.isHovering
              ? cursor.isNav === true
                ? "w-8 h-8 bg-[#17120A] text-white rounded-[24px]"
                : cursor.isNav === 'footer'
                  ? "w-8 h-8 bg-white text-black rounded-[24px]"
                  : "w-8 h-8 bg-black text-white rounded-[24px]"
              : cursor.isNav === true
                ? "w-[10px] h-[10px] bg-[#17120A] rounded-[24px]"
                : cursor.isNav === 'footer'
                  ? "w-[10px] h-[10px] bg-white rounded-[24px]"
                  : "w-[10px] h-[10px] bg-black rounded-[24px]"
          }
        `}
      >
        {cursor.isHovering && (
          <span className={cursor.isNav === 'footer' ? "text-black" : "text-white"}>
            →
          </span>
        )}
      </div>
    </div>
  );
}
