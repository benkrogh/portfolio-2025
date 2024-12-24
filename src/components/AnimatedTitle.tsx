import { useEffect } from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  id?: string;
  isHomepage?: boolean;
}

export default function AnimatedTitle({ 
  text, 
  className,
  id = "animated-title",
  isHomepage = false
}: AnimatedTitleProps) {
  // Default classes that change based on isHomepage
  const defaultClasses = isHomepage
    ? "text-[32px] md:text-3xl font-mono bg-[#EDE9E5] rounded-[24px] w-full h-[55vh] flex items-center p-8 md:p-12"
    : "text-xl md:text-3xl font-mono bg-[#EDE9E5] rounded-[24px] w-full min-h-[300px] md:h-[55vh] flex items-center p-6 md:p-12";

  useEffect(() => {
    const titleElement = document.getElementById(id);
    
    if (titleElement) {
      titleElement.textContent = '';
      const textArray = text.split("");
      let index = 0;

      const type = () => {
        if (index < textArray.length) {
          if (
            textArray[index] === "[" &&
            textArray[index + 1] === "B" &&
            textArray[index + 2] === "R" &&
            textArray[index + 3] === "]"
          ) {
            // Add responsive line break that only shows on larger screens
            titleElement.insertAdjacentHTML(
              'beforeend',
              '<br class="hidden sm:block" />'
            );
            index += 4;
          } else {
            titleElement.insertAdjacentText('beforeend', textArray[index]);
            index++;
          }
          setTimeout(type, 50);
        }
      };

      type();
    }
  }, [text, id, isHomepage]);

  return (
    <h1
      id={id}
      className={className || defaultClasses}
    />
  );
} 