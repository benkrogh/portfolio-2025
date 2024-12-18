import { useEffect } from "react";

export default function GlobalCursor() {
  useEffect(() => {
    // Check if we're on mobile/small screen
    const isMobile = window.innerWidth < 768; // 768px is Tailwind's md breakpoint
    if (isMobile) return; // Don't initialize cursor on mobile

    // First, clean up any existing cursors from previous page loads
    const existingCursors = document.querySelectorAll("#custom-cursor");
    existingCursors.forEach((cursor) => cursor.remove());

    // Create new cursor
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      // Start cursor offscreen if no mouse position is available
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      // Ensure cursor is visible only after we have a position
      cursor.style.opacity = "1";
    };

    // Initially hide cursor until we have a mouse position
    cursor.style.opacity = "0";

    // Add hover detection
    const addHoverClass = () => cursor.classList.add("hover");
    const removeHoverClass = () => cursor.classList.remove("hover");

    // Add event listeners to all links and buttons
    const elements = document.querySelectorAll("a, button");
    elements.forEach((el) => {
      el.addEventListener("mouseenter", addHoverClass);
      el.addEventListener("mouseleave", removeHoverClass);
    });

    // Add resize listener to remove cursor if window is resized to mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        cursor.style.display = 'none';
      } else {
        cursor.style.display = 'block';
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", handleResize);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", addHoverClass);
        el.removeEventListener("mouseleave", removeHoverClass);
      });
      cursor.remove();
    };
  }, []);

  return null;
}
