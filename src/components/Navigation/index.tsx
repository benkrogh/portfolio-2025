import styles from "./navigation.module.css";
import React, { useState, useEffect, useCallback } from "react";
import useScrollDirection from "@/hooks/useScrollDirection";

interface NavigationProps {
  currentPath: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  dotColor: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

const NAV_ITEMS = [
  { href: "/", label: "projects", dotColor: "bg-red-500" },
  { href: "/about", label: "about", dotColor: "bg-blue-500" },
  { href: "/blog", label: "blog", dotColor: "bg-green-500" },
] as const;

const NavLink = ({
  href,
  label,
  dotColor,
  isActive,
  onClick,
  className = "",
}: NavLinkProps) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl transition-all hover:bg-[#17120A]/10 ${
      isActive
        ? "bg-[#17120A] text-white hover:bg-[#17120A]/90 active"
        : "text-[#17120A]"
    } ${className}`}
  >
    <span
      className={`inline-block w-2 h-2 rounded-full ${dotColor}`}
    ></span>
    {label}
  </a>
);

const MenuButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`${styles.menuButton} sm:hidden flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-[#17120A]/10 transition-colors`}
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-nav-sheet"
  >
    <span className={styles.menuIcon} data-open={isOpen}>
      <span className={styles.menuLine} />
      <span className={styles.menuLine} />
      <span className={styles.menuLine} />
    </span>
  </button>
);

const Navigation = ({ currentPath: initialPath }: NavigationProps) => {
  const isNavVisible = useScrollDirection(50);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(
    () => setIsMenuOpen((open) => !open),
    []
  );

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePageLoad = () => {
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
      }, 50);
    };

    const handleAfterSwap = () => {
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
      }, 50);
    };

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    document.addEventListener("astro:page-load", handlePageLoad);
    document.addEventListener("astro:after-swap", handleAfterSwap);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("astro:page-load", handlePageLoad);
      document.removeEventListener("astro:after-swap", handleAfterSwap);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [initialPath]);

  useEffect(() => {
    closeMenu();
  }, [currentPath, closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const showNav = isNavVisible || isMenuOpen;

  return (
    <>
      <div
        className={`${styles.headerNav} ${
          showNav ? styles.visible : styles.hidden
        } fixed w-full`}
      >
        <div className="w-full max-w-[1500px] mx-auto">
          <div className="px-6">
            <nav className="flex items-center justify-between h-[72px] pl-4 sm:pl-8 pr-3 rounded-[24px] bg-[#FCF9F4]/20 backdrop-blur-[16px] z-[1000]">
              <a
                href="/"
                className="hover:opacity-80 transition-opacity shrink-0"
              >
                <img
                  src="/images/BK-dark.svg"
                  alt="BK Logo"
                  className="w-[50px] h-[36px]"
                />
              </a>

              <div className="hidden sm:flex items-center text-[0.938rem] font-medium z-10 gap-1.5 ml-auto">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    dotColor={item.dotColor}
                    isActive={isActive(item.href)}
                  />
                ))}
              </div>

              <MenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
            </nav>
          </div>
        </div>
      </div>

      <div
        className={`${styles.mobileNav} sm:hidden ${isMenuOpen ? styles.mobileNavOpen : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className={styles.mobileNavBackdrop}
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={isMenuOpen ? 0 : -1}
        />

        <div
          id="mobile-nav-sheet"
          className={styles.mobileNavSheet}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                dotColor={item.dotColor}
                isActive={isActive(item.href)}
                onClick={closeMenu}
                className="w-full text-base px-4 py-3"
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navigation;
