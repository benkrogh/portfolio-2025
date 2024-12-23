import React, { useState, useRef, useEffect } from "react";

// Add icons for expand/collapse
const ExpandIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const designPrinciples = [
  {
    id: 1,
    title: "DESIGN TO DELIGHT AND INSPIRE",
    description: "Good design doesn't end at pleasing visuals. Every detail and interaction with one's work is an opportunity to create a meaningful exchange. This can be realized in many ways: clever copy, perfectly-timed animations, or interactions to guide the user."
  },
  {
    id: 2,
    title: "BE THOUGHTFUL FIRST, CLEVER LATER",
    description: "Begin with clarity. Ensure the core experience is intuitive and accessible before adding creative flourishes. Cleverness should enhance a design, not obstruct it."
  },
  {
    id: 3,
    title: "DESIGN WITH CONSTRAINTS",
    description: "Constraints breed creativity. Working within limitations - whether technical, visual, or conceptual - often leads to more focused and innovative solutions."
  },
  {
    id: 4,
    title: "DESIGN SYSTEMS THAT INSPIRE TRUST",
    description: "Consistency in design details builds trust with your users. Every interaction should reinforce that trust through predictable patterns and honest communication."
  },
  {
    id: 5,
    title: "DESIGN TO EMPOWER PEOPLE",
    description: "Good design removes barriers and enables users to achieve their goals efficiently. It should make complex tasks feel simple and give users confidence in their actions."
  },
  {
    id: 6,
    title: "HAVE A REASON FOR WHAT YOU DO",
    description: "Every design decision should serve a purpose. From color choices to interaction patterns, be intentional and able to articulate the reasoning behind each choice."
  },
  {
    id: 7,
    title: "GOOD DESIGN IS REDUCTIVE",
    description: "Our world is full of clutter and noise that we navigate every day. Good design takes away the extra elements that distract and offer a clear and engaging experience that stands apart. As designers, we reduce what is necessary until all that remains is crucial."
  },
];

export default function DesignPrinciples() {
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number | null }>({ x: 0, y: null });
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize mouse position when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const containerBounds = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: containerBounds.width / 2,
        y: null // We'll set this to null initially to prevent the card from showing
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const containerBounds = containerRef.current.getBoundingClientRect();
    const cardWidth = 446;
    
    const xPos = e.clientX - containerBounds.left;
    const yPos = e.clientY - containerBounds.top;
    
    let finalX = xPos;
    if (xPos + cardWidth/2 > containerBounds.width) {
      finalX = containerBounds.width - cardWidth - 16;
    } else if (xPos - cardWidth/2 < 0) {
      finalX = cardWidth/2 + 16;
    }

    setMousePosition({ 
      x: finalX,
      y: yPos + 32
    });
  };

  return (
    <div className="relative" ref={containerRef} onMouseMove={handleMouseMove}>
      <div
        style={{
          backgroundColor: "#EC6A5C",
          borderRadius: "24px",
        }}
        className="w-full max-w-[1500px] mx-auto mb-4 p-8 sm:p-12"
      >
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <span
              className="GeistMono text-base"
              style={{ 
                color: "#521710",
                letterSpacing: "-0.02em"
              }}
            >
              SEVEN DESIGN PRINCIPLES:
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#521710] hover:text-white transition-colors duration-500"
            >
              {isExpanded ? <CloseIcon /> : <ExpandIcon />}
            </button>
          </div>

          {/* Mobile Expanded View with smooth transition */}
          <div 
            className={`grid transition-[grid-template-rows] duration-500 ease-out ${
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-6">
                {designPrinciples.map((principle) => (
                  <div 
                    key={principle.id}
                    className="mb-4 last:mb-0"
                  >
                    <div
                      className="text-base"
                      style={{ 
                        color: "#521710",
                        letterSpacing: "-0.02em"
                      }}
                    >
                      {String(principle.id).padStart(2, "0")}.{principle.title}
                    </div>
                    <p className="mt-2 text-sm text-[#521710]/80">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <span
          className="GeistMono text-2xl inline line-height-1.4 hidden md:inline"
          style={{ 
            color: "#521710",
            letterSpacing: "-0.02em"
          }}
        >
          SEVEN DESIGN PRINCIPLES:{" "}
          {designPrinciples.map((principle) => (
            <React.Fragment key={principle.id}>
              <span
                className="cursor-pointer relative"
                style={{
                  color: "#521710",
                  transition: "color 400ms ease-in-out",
                  letterSpacing: "-0.02em"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#FFFFFF";
                  setHoveredPrinciple(principle.id);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#521710";
                  setHoveredPrinciple(null);
                }}
              >
                {String(principle.id).padStart(2, "0")}.{principle.title}
              </span>{" "}
            </React.Fragment>
          ))}
        </span>
      </div>

      {/* Hover Card (Desktop Only) */}
      <div
        className={`absolute bg-[#17120A] text-white rounded-xl py-3 px-4 text-sm w-[446px] z-50 transition-all duration-300 ease-out hidden md:block`}
        style={{
          left: `${mousePosition.x}px`,
          top: mousePosition.y ? `${mousePosition.y}px` : '0',
          transform: `translate(-50%, 0) scale(${hoveredPrinciple ? 1 : 0.97})`,
          opacity: hoveredPrinciple && mousePosition.y !== null ? 1 : 0,
          pointerEvents: 'none',
          visibility: hoveredPrinciple && mousePosition.y !== null ? 'visible' : 'hidden',
        }}
      >
        {designPrinciples.find(p => p.id === hoveredPrinciple)?.description}
      </div>
    </div>
  );
}
