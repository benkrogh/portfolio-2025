import React, { useState } from "react";

const designPrinciples = [
  {
    id: 1,
    title: "DESIGN TO DELIGHT AND INSPIRE",
    description: "Good design doesn't end at pleasing visuals. Every detail and interaction with one's work is an opportunity to create a meaningful exchange. This can be realized in many ways: clever copy, perfectly-timed animations, or interactions to guide the user."
  },
  {
    id: 2,
    title: "BE THOUGHTFUL FIRST, CLEVER LATER",
    description: "Start with clarity and understanding. Ensure the core experience is intuitive and accessible before adding creative flourishes. Cleverness should enhance, not obstruct."
  },
  {
    id: 3,
    title: "DESIGN WITH RESTRAINTS",
    description: "Constraints breed creativity. Working within limitations - whether technical, visual, or conceptual - often leads to more focused and innovative solutions."
  },
  {
    id: 4,
    title: "DESIGN SYSTEMS THAT INSPIRE TRUST",
    description: "Consistency, reliability, and transparency in design build user confidence. Every interaction should reinforce that trust through predictable patterns and honest communication."
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
    description: "Simplicity is the ultimate sophistication. Continuously question what can be removed while preserving the essence of the experience. Less complexity often leads to better usability."
  },
];

export default function DesignPrinciples() {
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const viewportWidth = window.innerWidth;
    const cardWidth = 446;
    
    let xPos = e.clientX;
    if (xPos + cardWidth/2 > viewportWidth) {
      xPos = viewportWidth - cardWidth - 16;
    } else if (xPos - cardWidth/2 < 0) {
      xPos = cardWidth/2 + 16;
    }

    setMousePosition({ 
      x: xPos,
      y: e.clientY + 32
    });
  };

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      <div
        style={{
          backgroundColor: "#EC6A5C",
          borderRadius: "24px",
        }}
        className="w-full max-w-[1320px] mx-auto px-12 p-14"
      >
        <span
          className="GeistMono text-2xl inline line-height-1.4"
          style={{ color: "#521710" }}
        >
          SEVEN DESIGN PRINCIPLES:
          {designPrinciples.map((principle) => (
            <React.Fragment key={principle.id}>
              <span
                className="cursor-pointer relative"
                style={{
                  color: "#521710",
                  transition: "color 400ms ease-in-out",
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
                {String(principle.id).padStart(2, "0")}. {principle.title}
              </span>{" "}
            </React.Fragment>
          ))}
        </span>
      </div>

      {/* Hover Card */}
      <div
        className={`fixed bg-black text-white rounded-xl py-4 px-3 text-sm w-[446px] z-50 transition-all duration-300 ease-out`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, 0) scale(${hoveredPrinciple ? 1 : 0.97})`,
          opacity: hoveredPrinciple ? 1 : 0,
          pointerEvents: 'none',
          visibility: hoveredPrinciple ? 'visible' : 'hidden',
        }}
      >
        {designPrinciples.find(p => p.id === hoveredPrinciple)?.description}
      </div>
    </div>
  );
}
