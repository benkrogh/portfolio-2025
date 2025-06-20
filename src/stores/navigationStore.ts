import { atom } from "nanostores";

// Initialize with the current path from window if available, otherwise empty string
const initialPath =
  typeof window !== "undefined" ? window.location.pathname : "";
export const currentPath = atom<string>(initialPath);

// Function to update the current path
export const updateCurrentPath = (path: string) => {
  currentPath.set(path);
};

// Initialize path on client side
if (typeof window !== "undefined") {
  // Update path on navigation events
  const updatePath = () => {
    currentPath.set(window.location.pathname);
  };

  // Listen for ViewTransitions events
  document.addEventListener('astro:page-load', updatePath);
  document.addEventListener('astro:after-swap', updatePath);
  
  // Listen for browser navigation
  window.addEventListener('popstate', updatePath);
}
