import { useEffect } from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  id?: string;
}

export default function AnimatedTitle({ 
  text, 
  className = "text-[32px] md:text-3xl font-mono bg-[#EDE9E5] rounded-[24px] w-full h-[55vh] flex items-center p-8 md:p-12",
  id = "animated-title"
}: AnimatedTitleProps) {
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
            titleElement.insertAdjacentHTML('beforeend', '<br class="hidden md:block" />');
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
  }, [text, id]);

  return (
    <h1
      id={id}
      className={className}
    />
  );
} 